import { uniqueId } from "lodash";
import { useDropzone } from "react-dropzone";
import BaseModal from "../_App/BaseModal";
import SelectWithIcon from "../FormComponents/SelectWithIcon";
import InputWithIcon from "../FormComponents/InputWithIcon";
import { getListingImageByType } from "../../utils";
import ErrorSpan from "../ErrorSpan";
import env from "../../env";

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
      <div
        className="invoice-btn-box gallery-flex form-group"
        onClick={handleImageClick}
      >
        <img src={path} />
        <input name="image[]" {...inputProps} />
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
  fileError,
  setFileError,
}) => {
  const { getRootProps: getRootPropsBase, getInputProps: getInputPropsBase } =
    useDropzone({
      accept: acceptImageOptions,
      maxFiles: env.MAX_FILE_SIZE,
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
        setFileError(null);
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
    setPhotoPopupType(e.value);
  };

  const handleStartEditImage = (localId, type) => {
    setPhotoPopupType(type);
    setPhotoPopupLocalFileId(localId);

    const linkInfo = linkFiles.filter((file) => file.localId === localId)[0];
    const file = files.filter((file) => file.localId === localId)[0];

    if (linkInfo) {
      setPhotoPopupLink(linkInfo.link);
      setPhotoPopupPhoto(null);
    } else if (file) {
      setPhotoPopupLink("");
      setPhotoPopupPhoto(file);
    }

    setPhotoPopupActive(true);
  };

  const infosToView = [
    ...files.map((file) => ({
      type: "storage",
      localId: file.localId,
      path: file.preview,
      date: file.date,
      full: true,
    })),
    ...linkFiles.map((info) => ({
      type: info.type,
      localId: info.localId,
      path: info.link,
      date: info.date,
      full: false,
    })),
  ].sort((a, b) => {
    const dateComparison =
      new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateComparison === 0) {
      return a.localId.localeCompare(b.localId);
    }
    return dateComparison;
  });

  return (
    <>
      <div {...getRootPropsBase()} className="dropzone add-listings-box">
        <h3>Photos</h3>

        <div className="row" style={{ width: "100%" }}>
          {infosToView.map((file) => (
            <ImageView
              key={file.localId}
              removeFile={() => removeFile(file.localId)}
              inputProps={getInputPropsBase()}
              path={
                file.full
                  ? file.path
                  : getListingImageByType(file.path, file.type)
              }
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

          {fileError && (
            <div className="col-12 form-group">
              <div
                className="is-invalid"
                style={{ marginBottom: "10px", marginTop: "-15px" }}
              >
                <ErrorSpan error={fileError} />
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
            isSearchable={false}
            name="photoPopupType"
          />

          {photoPopupType !== "storage" && (
            <div style={{ marginBottom: "15px" }}>
              <InputWithIcon
                name="photoPopupLink"
                value={photoPopupLink}
                onInput={(e) => setPhotoPopupLink(e.target.value)}
                placeholder="https://storage.google.com"
              />

              {photoPopupLink.length > 0 && (
                <div className="invoice-btn-box gallery-flex form-group">
                  <img src={photoPopupLink} />
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
              {!photoPopupPhoto && !photoPopupLink && (
                <div className="gallery-flex form-group">
                  <div className="add-more-image">
                    Drag 'n' drop some file here, or click to select file
                  </div>
                </div>
              )}

              {!photoPopupPhoto && photoPopupLink && (
                <div className="invoice-btn-box gallery-flex form-group">
                  <img src={getListingImageByType(photoPopupLink, "storage")} />
                  <input name="modalImage" {...getInputPropsPopup()} />
                </div>
              )}

              {photoPopupPhoto && (
                <div className="invoice-btn-box gallery-flex form-group">
                  <img src={photoPopupPhoto.preview} />
                  <input name="modalImage" {...getInputPropsPopup()} />
                </div>
              )}
            </div>
          )}

          <button type="button" onClick={handlePhotoAddByPopup}>
            {photoPopupLocalFileId ? "Save" : "Append"}
          </button>
        </form>
      </BaseModal>
    </>
  );
};

export default EditPhotosSection;
