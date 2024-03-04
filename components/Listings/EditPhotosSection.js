import { uniqueId } from "lodash";
import { useDropzone } from "react-dropzone";
import BaseModal from "../_App/BaseModal";
import SelectWithIcon from "../FormComponents/SelectWithIcon";
import InputWithIcon from "../FormComponents/InputWithIcon";

const linkTypeOptions = [
  { value: "storage", label: "Storage" },
  { value: "url", label: "Url" },
];

const ImageView = ({
  removeFile,
  inputProps,
  path,
  onImageClick = () => {},
}) => {
  const handleRemoveClick = (e) => {
    e.stopPropagation();
    removeFile();
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    onImageClick();
  };

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 gallery-flex-parent">
      <div className="invoice-btn-box gallery-flex form-group">
        <img src={path} onClick={handleImageClick} />
        <input {...inputProps} />
        <button
          type="button"
          className="default-btn remove-file-btn"
          onClick={handleRemoveClick}
        >
          <i className="flaticon-more"></i>
        </button>
      </div>
    </div>
  );
};

const acceptImageOptions = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

const EditPhotosSection = ({
  files,
  removeFile,
  photoPopupActive,
  setPhotoPopupActive,
  setPhotoPopupLink,
  photoPopupPhoto,
  setPhotoPopupPhoto,
  handlePhotoAddByPopup,
  photoPopupLink,
  linkFiles,
  photoPopupType,
  setPhotoPopupType,
  photoPopupLocalFileId,
  setPhotoPopupLocalFileId,
  handleClosePhotoPopup,
  setFiles,
}) => {
  const { getRootProps: getRootPropsBase, getInputProps: getInputPropsBase } =
    useDropzone({
      accept: acceptImageOptions,
      onDrop: (acceptedFiles) => {
        const newFiles = acceptedFiles.slice(
          0,
          5 - files.length - linkFiles.length
        );
        setFiles((prev) => [
          ...prev,
          ...newFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
              localId: uniqueId(),
              date: Date.now(),
            })
          ),
        ]);
      },
    });

  const { getRootProps: getRootPropsPopup, getInputProps: getInputPropsPopup } =
    useDropzone({
      accept: acceptImageOptions,
      onDrop: (acceptedFiles) => {
        const newFiles = acceptedFiles.slice(0, 1);

        if (newFiles.length > 0) {
          setPhotoPopupPhoto(
            Object.assign(newFiles[0], {
              preview: URL.createObjectURL(newFiles[0]),
              localId: uniqueId(),
              date: Date.now(),
            })
          );
        } else {
          setPhotoPopupPhoto(null);
        }
      },
    });

  const handleChangePhotoPopupType = (e) => {
    setPhotoPopupLink("");
    setPhotoPopupPhoto(null);
    setPhotoPopupType(e.target.value);
  };

  const handleStartEditImage = (localId, type) => {
    setPhotoPopupType(type);
    setPhotoPopupLocalFileId(localId);

    if (type == "url") {
      const info = linkFiles.filter((file) => file.localId === localId)[0];
      setPhotoPopupLink(info.link);
      setPhotoPopupPhoto(null);
    } else {
      const info = files.filter((file) => file.localId === localId)[0];
      setPhotoPopupLink("");
      setPhotoPopupPhoto(info);
    }

    setPhotoPopupActive(true);
  };

  const infosToView = [
    ...files.map((file) => ({
      type: "storage",
      localId: file.localId,
      path: file.preview,
      date: file.date,
    })),
    ...linkFiles.map((info) => ({
      type: "url",
      localId: info.localId,
      path: info.link,
      date: info.date,
    })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      <div {...getRootPropsBase()} className="dropzone add-listings-box">
        <h3>Photos</h3>

        <div className="row" style={{ width: "100%" }}>
          {infosToView.map((file) => (
            <ImageView
              key={file.localId}
              removeFile={() => removeFile(file.localId, file.type)}
              inputProps={getInputPropsBase()}
              path={file.path}
              onImageClick={() => handleStartEditImage(file.localId, file.type)}
            />
          ))}

          {files.length + linkFiles.length < 5 && (
            <div className="col-xl-3 col-lg-4 col-md-6 gallery-flex-parent">
              <div className="gallery-flex form-group">
                <div
                  className="add-more-image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoPopupActive(true);
                  }}
                >
                  Drag 'n' drop some files here, or click to select files
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <BaseModal active={photoPopupActive} toggleActive={handleClosePhotoPopup}>
        <span className="sub-title mb-2">
          <span>Photo Popup</span>
        </span>

        <form method="get" className="popup-get-image">
          <SelectWithIcon
            value={photoPopupType}
            onChange={handleChangePhotoPopupType}
            options={linkTypeOptions}
          />

          {photoPopupType !== "storage" && (
            <div style={{ marginBottom: "15px" }}>
              <InputWithIcon
                value={photoPopupLink}
                onInput={(e) => setPhotoPopupLink(e.target.value)}
                placeholder="https://storage.google.com"
              />

              {photoPopupLink.length > 0 && (
                <div className="invoice-btn-box gallery-flex form-group">
                  <img src={photoPopupLink}/>
                </div>
              )}
            </div>
          )}

          {photoPopupType === "storage" && (
            <div
              className="dropzone add-listings-box"
              {...getRootPropsPopup()}
              style={{ marginBottom: "15px" }}
            >
              {!photoPopupPhoto && (
                <div className="gallery-flex form-group">
                  <div className="add-more-image">
                    Drag 'n' drop some file here, or click to select file
                  </div>
                </div>
              )}

              {photoPopupPhoto && (
                <div className="invoice-btn-box gallery-flex form-group">
                  <img src={photoPopupPhoto.preview} />
                  <input {...getInputPropsPopup()} />
                </div>
              )}
            </div>
          )}

          <button type="button" onClick={handlePhotoAddByPopup}>
            {photoPopupLocalFileId ? "Edit" : "Add"}
          </button>
        </form>
      </BaseModal>
    </>
  );
};

export default EditPhotosSection;
