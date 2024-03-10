import { useState, useRef } from "react";
import env from "../../../env";
import ErrorSpan from "../ErrorSpan";

const defaultPhotoLink = "/images/admin/user-avatar-80.png";

const ImageInput = ({
  label = null,
  photoUrl,
  defaultUrl = null,
  onChange,
  btnText = "Change",
  name = "file",
  fileSizeLimit = null,
}) => {
  if (!fileSizeLimit) fileSizeLimit = env.MAX_FILE_SIZE;

  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  if (!defaultUrl) defaultUrl = defaultPhotoLink;

  const handleChange = (e) => {
    setError(null);

    if (!e.target.files.length) return;

    const img = e.target.files[0];

    if (img.size > fileSizeLimit) {
      setError("File can't be larger than " + fileSizeLimit + " bytes");
    } else {
      onChange(e);
    }
  };

  const handleInputClick = () => inputRef.current.click();

  return (
    <div className="flex items-center image-input-parent">
      {label && <label>{label}</label>}

      <div className="flex items-center">
        <div className="mr-4">
          <img
            className="cursor-pointer w-20 h-20 rounded-full"
            src={photoUrl ?? defaultPhotoLink}
            width="80"
            height="80"
            alt="User upload"
            onClick={handleInputClick}
          />
        </div>

        <button
          onClick={handleInputClick}
          className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          {btnText}
        </button>

        <input
          ref={inputRef}
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          name={name}
          onChange={handleChange}
        />
      </div>

      <ErrorSpan error={error} />
    </div>
  );
};

export default ImageInput;
