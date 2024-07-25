import { useState } from "react";
import ErrorSpan from "../ErrorSpan";
import ImagePopup from "../_App/ImagePopup";
import STATIC from "../../static";
import { byteConverter } from "../../utils";

const ImageInput = ({
  label = null,
  photoUrl,
  defaultUrl = null,
  onChange,
  btnText = "Upload Photo",
  name = "file",
  disabled = false,
  fileSizeLimit = null,
}) => {
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  if (!defaultUrl) {
    defaultUrl = STATIC.DEFAULTS.PHOTO_LINK;
  }

  if (!fileSizeLimit) {
    fileSizeLimit = STATIC.LIMITS.FILE_SIZE;
  }

  const handleChange = (e) => {
    setError(null);
    const img = e.target.files[0];
    if (!img) return;

    if (img.size > fileSizeLimit) {
      setError(
        "File can't be larger than " + byteConverter(Number(fileSizeLimit))
      );
    } else {
      onChange(e);
    }
  };

  const closeImagePopup = (event) => {
    if (!event.target.matches(".modal-content img")) {
      setIsPopupOpen(false);
    }
  };

  return (
    <div className="form-group profile-box">
      {label && <label>{label}</label>}

      <div className="image-box">
        <img
          src={photoUrl ?? defaultUrl}
          alt="image"
          width="300px"
          height="300px"
          style={{ cursor: disabled ? "zoom-in" : "auto" }}
          onClick={() => disabled && setIsPopupOpen(true)}
        />
        <div className="file-upload">
          <input
            type="file"
            id={name}
            name={name}
            style={{ display: "none" }}
            accept="image/*"
            className="inputfile"
            onChange={handleChange}
          />

          {!disabled && (
            <label htmlFor={name}>
              <i className="bx bx-upload"></i> {btnText}
            </label>
          )}
        </div>
      </div>

      <ErrorSpan error={error} className="d-block mt-0 position-absolute" />

      <ImagePopup
        open={isPopupOpen}
        close={closeImagePopup}
        photoUrl={photoUrl}
      />
    </div>
  );
};

export default ImageInput;
