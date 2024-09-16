import { useContext, useRef, useState } from "react";
import { authSideProps } from "../../middlewares";
import {
  getCurrentUserDocumentsPageOptions,
  saveMyDocuments,
} from "../../services";
import NavbarThree from "../../components/_App/NavbarThree";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import Link from "next/link";
import MainSection from "../../components/Dashboard/DocumentVerification/MainSection";
import StatusBar from "../../components/StatusBar";
import UserPhotoSection from "../../components/Dashboard/DocumentVerification/UserPhotoSection";
import DocumentPhotoSection from "../../components/Dashboard/DocumentVerification/DocumentPhotoSection";
import FinishedSection from "../../components/Dashboard/DocumentVerification/FinishedSection";
import { useRouter } from "next/router";
import { IndiceContext } from "../../contexts";
import { base64ToBlob } from "../../utils";

const accessCameraDenied =
  "Access to the camera is not granted. Please grant access to the camera and refresh page";

const SECTION_NAMES = {
  MAIN: "main",
  USER_PHOTO: "user-photo",
  DOCUMENT_PHOTO: "document-photo",
  FINISHED: "finished",
};

const DocumentsVerification = () => {
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [frontDocumentPhoto, setFrontDocumentPhoto] = useState(null);
  const [backDocumentPhoto, setBackDocumentPhoto] = useState(null);
  const [currentSection, setCurrentSection] = useState(SECTION_NAMES.MAIN);
  const { authToken, success } = useContext(IndiceContext);

  const userPhotoVideoRef = useRef(null);
  const userPhotoStreamRef = useRef(null);

  const router = useRouter();

  const stopUserPhotoStream = () => {
    if (userPhotoStreamRef.current) {
      userPhotoStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  const startUserPhotoStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 250 },
        height: { ideal: 300 },
        facingMode: "user",
      },
    });
    const video = userPhotoVideoRef.current;
    video.srcObject = stream;
    video.play();
    userPhotoStreamRef.current = stream;
  };

  const goToUserPhotoSection = async () => {
    if (disabled) {
      return;
    }

    setDisabled(true);
    setError(null);

    try {
      await startUserPhotoStream();
      setCurrentSection(SECTION_NAMES.USER_PHOTO);
    } catch (err) {
      let message = err.message;

      if (
        err.message.toLowerCase() === "permission dismissed" ||
        err.message.toLowerCase() === "permission denied"
      ) {
        message = accessCameraDenied;
      }

      setError(message);
    }

    setDisabled(false);
  };

  const goToDocumentPhotoSection = () =>
    setCurrentSection(SECTION_NAMES.DOCUMENT_PHOTO);

  const goToFinishedSection = async () => {
    if (disabled) {
      return;
    }

    setDisabled(true);

    try {
      const formData = new FormData();
      const userPhotoFile = await base64ToBlob(userPhoto);
      formData.append("userPhoto", userPhotoFile);
      formData.append("documentFront", frontDocumentPhoto);
      formData.append("documentBack", backDocumentPhoto);
      await saveMyDocuments(formData, authToken);
      success.set("Request successfully sent");
      setCurrentSection(SECTION_NAMES.FINISHED);
    } catch (e) {
      setError(e.message);
    }

    setDisabled(false);
  };

  const goBackToProfile = () => {
    router.push("/dashboard/profile-edit/");
  };

  const statuses = [
    {
      title: "Facial verification",
      finished: ["user-photo", "document-photo", "finished"].includes(
        currentSection
      ),
    },
    {
      title: "Documents verification",
      finished: ["document-photo", "finished"].includes(currentSection),
    },
    {
      title: "Finish",
      finished: ["finished"].includes(currentSection),
    },
  ];

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="miran-grid-sorting row align-items-center d-none d-xl-block">
          <div className="col-12 result-count">
            <div className="breadcrumb-area">
              <h1>Documents Verification</h1>
              <ol className="breadcrumb">
                <li className="item">
                  <Link href="/">Home</Link>
                </li>
                <li className="item">
                  <Link href="/dashboard/">Dashboard</Link>
                </li>
                <li className="item">
                  <Link href="/dashboard/profile-edit/">Profile</Link>
                </li>
                <li className="item">Documents Verification</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="my-profile-box document-verification">
              <form
                method="post"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MainSection
                  goNext={goToUserPhotoSection}
                  error={error}
                  disabled={disabled}
                  active={currentSection == SECTION_NAMES.MAIN}
                />

                {currentSection != SECTION_NAMES.MAIN && (
                  <StatusBar statuses={statuses} />
                )}

                <UserPhotoSection
                  goNext={goToDocumentPhotoSection}
                  videoRef={userPhotoVideoRef}
                  streamRef={userPhotoStreamRef}
                  error={error}
                  setError={setError}
                  disabled={disabled}
                  setDisabled={setDisabled}
                  stopStream={stopUserPhotoStream}
                  startStream={startUserPhotoStream}
                  active={currentSection == SECTION_NAMES.USER_PHOTO}
                  image={userPhoto}
                  setImage={setUserPhoto}
                />

                <DocumentPhotoSection
                  active={currentSection == SECTION_NAMES.DOCUMENT_PHOTO}
                  goNext={goToFinishedSection}
                  error={error}
                  setError={setError}
                  disabled={disabled}
                  setDisabled={setDisabled}
                  frontPhoto={frontDocumentPhoto}
                  setFrontPhoto={setFrontDocumentPhoto}
                  backPhoto={backDocumentPhoto}
                  setBackPhoto={setBackDocumentPhoto}
                />

                <FinishedSection
                  active={currentSection == SECTION_NAMES.FINISHED}
                  goNext={goBackToProfile}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps }) => {
  const options = await getCurrentUserDocumentsPageOptions(
    baseSideProps.authToken
  );
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Documents Verification" },
  });

export default DocumentsVerification;
