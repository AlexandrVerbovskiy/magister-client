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
}) => {
  const [error, setError] = useState(null);
  if (!defaultUrl) defaultUrl = defaultPhotoLink;

  const handleChange = (e) => {
    setError(null);
    const img = e.target.files[0];

    if (img.size > env.MAX_FILE_SIZE) {
      setError("File can't be larger than " + env.MAX_FILE_SIZE + " bytes");
    } else {
      onChange(e);
    }
  };

  return (
    <div className="form-group profile-box">
      {label && <label>{label}</label>}

      <img src={photoUrl ?? defaultUrl} alt="image" width="300px" height="300px"/>
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

      <ErrorSpan error={error} className="d-block mt-0 position-absolute" />
    </div>
  );
};

export default ImageInput;
