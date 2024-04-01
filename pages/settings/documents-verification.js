import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { IndiceContext } from "../../contexts";
import NavbarThree from "../../components/_App/NavbarThree";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import ImageInput from "../../components/DashboardComponents/ImageInput";
import {
  saveMyDocuments,
  userVerifyRequestCreate,
  getCurrentUserDocumentsPageOptions,
} from "../../services";
import { authSideProps } from "../../middlewares";
import { getFilePath } from "../../utils";
import YesNoModal from "../../components/_App/YesNoModal";

const DocumentsVerification = ({
  documents,
  canSend,
  lastAnswerDescription,
}) => {
  const [formError, setFormError] = useState(null);
  const { success, setLoading, sessionUser, authToken, setVerified } =
    useContext(IndiceContext);
  const [activeSendRequestBtn, setActiveSendRequestBtn] = useState(canSend);
  const [userVerified, setUserVerified] = useState(sessionUser.verified);
  const [activeReverifiedModal, setActiveReverifiedModal] = useState(false);

  const [saveDocumentsDisabled, setSaveDocumentsDisabled] = useState(false);
  const [sendRequestDisabled, setSendRequestDisabled] = useState(false);

  const [newProofOfAddress, setNewProofOfAddress] = useState(null);
  const [proofOfAddressLink, setProofOfAddressLink] = useState(null);

  const handleProofOfAddressChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewProofOfAddress(img);
    setProofOfAddressLink(url);
  };

  const [newReputableBankId, setNewReputableBankId] = useState(null);
  const [reputableBankIdLink, setReputableBankIdLink] = useState(null);

  const handleReputableBankIdChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewReputableBankId(img);
    setReputableBankIdLink(url);
  };

  const [newUtility, setNewUtility] = useState(null);
  const [utilityLink, setUtilityLink] = useState(null);

  const handleUtilityChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewUtility(img);
    setUtilityLink(url);
  };

  const [newHmrc, setNewHmrc] = useState(null);
  const [hmrcLink, setHmrcLink] = useState(null);

  const handleHmrcChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewHmrc(img);
    setHmrcLink(url);
  };

  const [newCouncilTaxBill, setNewCouncilTaxBill] = useState(null);
  const [councilTaxBillLink, setCouncilTaxBillLink] = useState(null);

  const handleCouncilTaxBillChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewCouncilTaxBill(img);
    setCouncilTaxBillLink(url);
  };

  const [newPassportOrDrivingId, setNewPassportOrDrivingId] = useState(null);
  const [passportOrDrivingIdLink, setPassportOrDrivingIdLink] = useState(null);

  const handlePassportOrDrivingIdChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewPassportOrDrivingId(img);
    setPassportOrDrivingIdLink(url);
  };

  const [
    newConfirmMoneyLaunderingChecksAndCompliance,
    setNewConfirmMoneyLaunderingChecksAndCompliance,
  ] = useState(null);
  const [
    confirmMoneyLaunderingChecksAndComplianceLink,
    setConfirmMoneyLaunderingChecksAndComplianceLink,
  ] = useState(null);

  const handleConfirmMoneyLaunderingChecksAndComplianceChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewConfirmMoneyLaunderingChecksAndCompliance(img);
    setConfirmMoneyLaunderingChecksAndComplianceLink(url);
  };

  const initDocuments = async () => {
    if (documents.proofOfAddressLink) {
      setProofOfAddressLink(getFilePath(documents.proofOfAddressLink));
    } else {
      setProofOfAddressLink(null);
    }

    if (documents.reputableBankIdLink) {
      setReputableBankIdLink(getFilePath(documents.reputableBankIdLink));
    } else {
      setReputableBankIdLink(null);
    }

    if (documents.utilityLink) {
      setUtilityLink(getFilePath(documents.utilityLink));
    } else {
      setUtilityLink(null);
    }

    if (documents.hmrcLink) {
      setHmrcLink(getFilePath(documents.hmrcLink));
    } else {
      setHmrcLink(null);
    }

    if (documents.councilTaxBillLink) {
      setCouncilTaxBillLink(getFilePath(documents.councilTaxBillLink));
    } else {
      setCouncilTaxBillLink(null);
    }

    if (documents.passportOrDrivingIdLink) {
      setPassportOrDrivingIdLink(
        getFilePath(documents.passportOrDrivingIdLink)
      );
    } else {
      setPassportOrDrivingIdLink(null);
    }

    if (documents.confirmMoneyLaunderingChecksAndComplianceLink) {
      setConfirmMoneyLaunderingChecksAndComplianceLink(
        getFilePath(documents.confirmMoneyLaunderingChecksAndComplianceLink)
      );
    } else {
      setConfirmMoneyLaunderingChecksAndComplianceLink(null);
    }
  };

  const dataToSave = () => {
    const formData = new FormData();

    let hasUpdates = false;

    if (newProofOfAddress) {
      formData.append("proofOfAddress", newProofOfAddress);
      hasUpdates = true;
    }

    if (newReputableBankId) {
      formData.append("reputableBankId", newReputableBankId);
      hasUpdates = true;
    }

    if (newUtility) {
      formData.append("utility", newUtility);
      hasUpdates = true;
    }

    if (newHmrc) {
      formData.append("hmrc", newHmrc);
      hasUpdates = true;
    }

    if (newCouncilTaxBill) {
      formData.append("councilTaxBill", newCouncilTaxBill);
      hasUpdates = true;
    }

    if (newPassportOrDrivingId) {
      formData.append("passportOrDrivingId", newPassportOrDrivingId);
      hasUpdates = true;
    }

    if (newConfirmMoneyLaunderingChecksAndCompliance) {
      formData.append(
        "confirmMoneyLaunderingChecksAndCompliance",
        newConfirmMoneyLaunderingChecksAndCompliance
      );
      hasUpdates = true;
    }

    return hasUpdates ? formData : null;
  };

  const handleSaveClick = async () => {
    if (saveDocumentsDisabled) return;

    setFormError(null);
    const formData = dataToSave();

    if (formData) {
      setSaveDocumentsDisabled(true);

      try {
        await saveMyDocuments(formData, authToken);
        setUserVerified(false);
        setVerified(false);
      } catch (e) {
        setFormError(e.message);
      } finally {
        setSaveDocumentsDisabled(false);
      }
    }

    success.set("Documents updated successfully");
  };

  const handleBeforeSaveClick = async (e) => {
    e.preventDefault();
    const formData = dataToSave();

    if (formData) {
      setActiveReverifiedModal(true);
    } else {
      handleSaveClick();
    }
  };

  const handleSendRequestToVerify = async () => {
    if (saveDocumentsDisabled || sendRequestDisabled) return;

    setSaveDocumentsDisabled(true);
    setSendRequestDisabled(true);
    setFormError(null);

    try {
      const formData = dataToSave();

      if (formData) {
        await saveMyDocuments(formData, authToken);
      }

      const message = await userVerifyRequestCreate(authToken);
      success.set(message);
      setActiveSendRequestBtn(false);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaveDocumentsDisabled(false);
      setSendRequestDisabled(false);
    }
  };

  useEffect(() => {
    initDocuments();
  }, [documents]);

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="breadcrumb-area">
          <h1>Documents Verification</h1>
          <ol className="breadcrumb">
            <li className="item">
              <Link href="/">Home</Link>
            </li>
            <li className="item">
              <Link href="/settings/">Settings</Link>
            </li>
            <li className="item">Documents Verification</li>
          </ol>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="my-profile-box document-verification">
              <h3>Documents</h3>

              {!sessionUser?.verified && lastAnswerDescription && (
                <div className="row" style={{ padding: "0 25px" }}>
                  <div className="col-lg-12 col-md-12">
                    <div
                      className="alert-dismissible fade show alert alert-danger"
                      role="alert"
                    >
                      <b>Rejected feedback: </b>
                      {lastAnswerDescription}
                    </div>
                  </div>
                </div>
              )}

              <form method="get">
                <div className="row">
                  <div className="col-12 col-lg-3 col-md-4 document-view">
                    <ImageInput
                      label="Proof of Address"
                      photoUrl={proofOfAddressLink}
                      onChange={handleProofOfAddressChange}
                      name="proofOfAddressLink"
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-md-4 document-view">
                    <ImageInput
                      label="Reputable Bank Id"
                      photoUrl={reputableBankIdLink}
                      onChange={handleReputableBankIdChange}
                      name="reputableBankIdLink"
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-md-4 document-view">
                    <ImageInput
                      label="Utility"
                      photoUrl={utilityLink}
                      onChange={handleUtilityChange}
                      name="utilityLink"
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-md-4 document-view">
                    <ImageInput
                      label="HMRC"
                      photoUrl={hmrcLink}
                      onChange={handleHmrcChange}
                      name="hmrcLink"
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-md-4 document-view">
                    <ImageInput
                      label="Council Tax Bill"
                      photoUrl={councilTaxBillLink}
                      onChange={handleCouncilTaxBillChange}
                      name="councilTaxBillLink"
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-md-4 document-view">
                    <ImageInput
                      label="Passport Or Driving Id"
                      photoUrl={passportOrDrivingIdLink}
                      onChange={handlePassportOrDrivingIdChange}
                      name="passportOrDrivingIdLink"
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-md-4 document-view">
                    <ImageInput
                      label="Confirm Money Laundering Check And Compliance"
                      photoUrl={confirmMoneyLaunderingChecksAndComplianceLink}
                      onChange={
                        handleConfirmMoneyLaunderingChecksAndComplianceChange
                      }
                      name="confirmMoneyLaunderingChecksAndComplianceLink"
                    />
                  </div>

                  {formError && (
                    <div className="col-lg-12 col-md-12 mb-2">
                      <div
                        className="alert-dismissible fade show alert alert-danger"
                        role="alert"
                      >
                        {formError}
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <div className="form-group d-flex gap-2 justify-content-between">
                      <button
                        type="button"
                        style={{ width: "300px" }}
                        onClick={
                          userVerified ? handleBeforeSaveClick : handleSaveClick
                        }
                        disabled={saveDocumentsDisabled}
                      >
                        Save Changes
                      </button>

                      {!userVerified && activeSendRequestBtn && (
                        <button
                          type="button"
                          style={{ width: "300px" }}
                          onClick={handleSendRequestToVerify}
                          disabled={sendRequestDisabled}
                        >
                          Send Request To Verify
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {userVerified && (
        <YesNoModal
          active={activeReverifiedModal}
          toggleActive={() => setActiveReverifiedModal(false)}
          title="Are you sure you want update documents?"
          body="When you update your documents, your profile will automatically be transferred to an unverified status. Until the administrator confirms your profile, you will not be able to manage the listings. A verification request will be sent automatically"
          onAccept={handleSaveClick}
          acceptText="Update Documents"
          actionsParentClass="mt-4"
        />
      )}
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
  authSideProps(context, boostServerSideProps);

export default DocumentsVerification;
