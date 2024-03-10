import { useState } from "react";
import env from "../../env";
import ErrorSpan from "../ErrorSpan";

const defaultPhotoLink = "/images/admin/user-avatar-80.png";

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

  if (!defaultUrl) defaultUrl = defaultPhotoLink;

  if (!fileSizeLimit) fileSizeLimit = env.MAX_FILE_SIZE;

  const handleChange = (e) => {
    setError(null);
    const img = e.target.files[0];

    if (img.size > fileSizeLimit) {
      setError("File can't be larger than " + fileSizeLimit + " bytes");
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

      {isPopupOpen && (
        <div className="view-picture-parent bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            onClick={closeImagePopup}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-xl"
              style={{ maxWidth: "42rem" }}
            >
              <div className="modal-content">
                <div className="modal-body">
                  <img
                    src={photoUrl ?? defaultUrl}
                    alt="image"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageInput;
