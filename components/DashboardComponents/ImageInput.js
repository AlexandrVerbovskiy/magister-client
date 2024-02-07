import { useState } from "react";
import ENV from "../../env";

const defaultPhotoLink = "/images/admin/user-avatar-80.png";

const ImageInput = ({
  label = null,
  photoUrl,
  defaultUrl = null,
  onChange,
  btnText = "Upload Photo",
  name = "file",
}) => {
  const [error, setError] = useState(null);
  if (!defaultUrl) defaultUrl = defaultPhotoLink;

  const handleChange = (e) => {
    setError(null);
    const img = e.target.files[0];

    if (img.size > ENV.MAX_FILE_SIZE) {
      setError("File can't be larger than " + ENV.MAX_FILE_SIZE + " bytes");
    } else {
      onChange(e);
    }
  };

  return (
    <div className="form-group profile-box">
      {label && <label>{label}</label>}

      <img src={photoUrl ?? defaultUrl} alt="image" />
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

        <label htmlFor={name}>
          <i className="bx bx-upload"></i> {btnText}
        </label>
      </div>
      {error && (
        <div className="invalid-feedback d-block mt-0 position-absolute">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageInput;
