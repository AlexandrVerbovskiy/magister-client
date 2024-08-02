import { useRef, useState } from "react";
import { byteConverter } from "../../../utils";
import STATIC from "../../../static";

const TABS = {
  FRONT: "front",
  BACK: "back",
};

const FileUploadSection = ({
  active,
  photoImg,
  setPhoto,
  setPhotoImg,
  goNext,
  fileName,
  setError,
}) => {
  const inputRef = useRef(null);

  if (!active) {
    return <></>;
  }

  const handleUploadPhoto = (e) => {
    const fileSizeLimit = Number(STATIC.LIMITS.FILE_SIZE);
    const file = e.target.files[0];
    setError(null);

    if(!file){
      setPhoto(null);
      setPhotoImg(null);
      return;
    }

    if (file.size > fileSizeLimit) {
      setError("File can't be larger than " + byteConverter(fileSizeLimit));
      setPhoto(null);
      setPhotoImg(null);
      return;
    }

    setPhoto(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const fileInputTrigger = (e) => {
    inputRef.current.click();
  };

  return (
    <div className="row justify-content-center photo-input-section">
      <div className="col col-12 col-md-6">
        <div className="d-flex flex-column align-items-center">
          <img
            onClick={fileInputTrigger}
            src={photoImg ?? "/images/svg/document-validation.svg"}
          />

          <div className="sub-title">
            Please upload a copy of your valid identification in PNG, JPEG or
            PDF format, no larger than {byteConverter(STATIC.LIMITS.FILE_SIZE)} size
          </div>

          <input
            type="file"
            ref={inputRef}
            accept="image/*"
            name={fileName}
            onChange={handleUploadPhoto}
            style={{ display: "none" }}
          />

          <button
            type="button"
            className="d-flex align-items-center justify-content-center"
            onClick={fileInputTrigger}
          >
            Upload
          </button>

          {photoImg && (
            <button
              type="button"
              className="d-flex align-items-center justify-content-center mt-2"
              onClick={goNext}
            >
              Continue <i className="ms-2 flaticon-right-arrow"> </i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DocumentPhotoSection = ({
  active,
  goNext,
  error,
  setError,
  setFrontPhoto,
  setBackPhoto,
  disabled,
}) => {
  const [currentPhotoTab, setCurrentPhotoTab] = useState(TABS.FRONT);
  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);

  if (!active) {
    return <></>;
  }

  const goNextByFrontSection = () => {
    if (disabled) {
      return;
    }
    
    setCurrentPhotoTab(TABS.BACK);
  };

  const goNextByBackSection = () => {
    if (disabled) {
      return;
    }

    goNext();
  };

  return (
    <div className={`document-section ${active ? "" : " d-none"}`}>
      <div className="row justify-content-center">
        <div className="col col-12 col-md-9">
          <div className="row">
            <div className="col col-12 col-md-6 d-flex align-items-center justify-content-center">
              <div
                className={`status-bar-step me-2${
                  currentPhotoTab == TABS.FRONT ? " active" : ""
                }`}
              >
                1
              </div>
              <div className="sub-title" style={{ fontWeight: 500 }}>
                Upload ID front page
              </div>
            </div>
            <div className="col col-12 col-md-6 d-flex align-items-center justify-content-center">
              <div
                className={`status-bar-step me-2${
                  currentPhotoTab == TABS.BACK ? " active" : ""
                }`}
              >
                2
              </div>
              <div className="sub-title" style={{ fontWeight: 500 }}>
                Upload ID back page
              </div>
            </div>
          </div>

          <FileUploadSection
            active={currentPhotoTab == TABS.FRONT}
            photoImg={frontImg}
            setPhoto={setFrontPhoto}
            goNext={goNextByFrontSection}
            fileName="front-photo"
            setPhotoImg={setFrontImg}
            setError={setError}
          />

          <FileUploadSection
            active={currentPhotoTab == TABS.BACK}
            photoImg={backImg}
            setPhoto={setBackPhoto}
            goNext={goNextByBackSection}
            fileName="back-photo"
            setPhotoImg={setBackImg}
            setError={setError}
          />

          {error && <div className="error-block mt-2 text-center">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default DocumentPhotoSection;
