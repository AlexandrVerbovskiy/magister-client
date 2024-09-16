import { useDropzone } from "react-dropzone";
import BaseModal from "../_App/BaseModal";
import SelectWithIcon from "../FormComponents/SelectWithIcon";
import InputWithIcon from "../FormComponents/InputWithIcon";
import { getListingImageByType, uniqueImageId } from "../../utils";
import ErrorSpan from "../ErrorSpan";
import STATIC from "../../static";
import { useIsMobile } from "../../hooks";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";

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
  photoPopupError,
  setPhotoPopupError,
  linkSuccessPhoto,
  successLoadLinkPhoto,
}) => {
  const isMobile = useIsMobile();

  const { error: mainError } = useContext(IndiceContext);

  const { getRootProps: getRootPropsBase, getInputProps: getInputPropsBase } =
    useDropzone({
      accept: STATIC.ACCEPT_IMAGE_FORMAT,
      maxSize: STATIC.LIMITS.FILE_SIZE,
      onDrop: (acceptedFiles, fileRejections) => {
        if (acceptedFiles.length + files.length + linkFiles.length > 5) {
          mainError.set("You can't set more than 5 files");
          return;
        }

        const newFiles = acceptedFiles.slice(
          0,
          5 - files.length - linkFiles.length
        );
        setFiles((prev) => [
          ...prev,
          ...newFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
              localId: uniqueImageId(),
              date: Date.now(),
            })
          ),
        ]);

        if (fileRejections.length > 0) {
          setFileError(fileRejections[0]["errors"][0].message);
        } else {
          setFileError(null);
        }
      },
    });

  const { getRootProps: getRootPropsPopup, getInputProps: getInputPropsPopup } =
    useDropzone({
      accept: STATIC.ACCEPT_IMAGE_FORMAT,
      maxSize: STATIC.LIMITS.FILE_SIZE,
      multiple: false,
      onDrop: (acceptedFiles, fileRejections) => {
        const newFiles = acceptedFiles.slice(0, 1);

        if (newFiles.length > 0) {
          setPhotoPopupPhoto(
            Object.assign(newFiles[0], {
              preview: URL.createObjectURL(newFiles[0]),
              localId: uniqueImageId(),
              date: Date.now(),
            })
          );
        } else {
          setPhotoPopupPhoto(null);
        }

        if (fileRejections.length > 0) {
          setPhotoPopupError(fileRejections[0]["errors"][0].message);
        } else {
          setPhotoPopupError(null);
        }
      },
    });

  const handleChangePhotoPopupType = (e) => {
    if (e.value === photoPopupType) return;

    setPhotoPopupLink("");
    setPhotoPopupPhoto(null);
    setPhotoPopupType(e.value);
    setPhotoPopupError(null);
  };

  const handleChangePhotoPopupLink = (value) => {
    setPhotoPopupLink(value);
    setPhotoPopupError(null);
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
        <input name="modalImage" {...getInputPropsBase()} />

        <h3>
          Photos
          <div className="form-hint">
            You can add maximum 5 files with maximum summary size 20 MB
          </div>
        </h3>

        <div
          className="row mx-0 gallery-flex"
          style={{ width: "100%", marginBottom: "25px" }}
        >
          <div className="col col-12 form-group">
            <div
              className="add-more-image"
              /*onClick={(e) => {
                    e.stopPropagation();
                    setPhotoPopupActive(true);
                  }}*/
            >
              {isMobile
                ? "Click to select files"
                : "Click or drag and drop to select files"}
            </div>
          </div>

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

      <BaseModal active={photoPopupActive} closeModal={handleClosePhotoPopup}>
        <span className="sub-title mb-2">
          <span>Photo Popup</span>
        </span>

        <form method="get" className="popup-get-image">
          {/*<SelectWithIcon
            value={photoPopupType}
            onChange={handleChangePhotoPopupType}
            options={linkTypeOptions}
            isSearchable={false}
            name="photoPopupType"
          />*/}

          {photoPopupType !== "storage" && (
            <div style={{ marginBottom: "15px" }}>
              <InputWithIcon
                name="photoPopupLink"
                value={photoPopupLink}
                onInput={(e) => handleChangePhotoPopupLink(e.target.value)}
                placeholder="https://storage.google.com"
                error={photoPopupError}
              />

              {photoPopupLink.length > 0 && (
                <div className="invoice-btn-box gallery-flex form-group">
                  <img
                    onLoad={successLoadLinkPhoto}
                    style={
                      linkSuccessPhoto
                        ? {}
                        : {
                            width: "20px",
                            height: "20px",
                            display: "none",
                          }
                    }
                    src={photoPopupLink}
                  />

                  {!linkSuccessPhoto && (
                    <img
                      src="/images/no-image.png"
                      style={{ width: "20px", height: "20px" }}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {photoPopupType === "storage" && (
            <div
              className="dropzone add-listings-box"
              {...getRootPropsPopup()}
              style={{ marginBottom: "25px" }}
            >
              <input name="modalImage" {...getInputPropsPopup()} />

              {!photoPopupPhoto && !photoPopupLink && (
                <div className="gallery-flex form-group">
                  <div className="add-more-image">
                    {isMobile
                      ? "Click to select files"
                      : "Click or drag and drop to select files"}
                  </div>
                </div>
              )}

              {!photoPopupPhoto && photoPopupLink && (
                <div className="invoice-btn-box gallery-flex form-group">
                  <img src={getListingImageByType(photoPopupLink, "storage")} />
                </div>
              )}

              {photoPopupPhoto && (
                <div className="invoice-btn-box gallery-flex form-group">
                  <img src={photoPopupPhoto.preview} />
                </div>
              )}

              <ErrorSpan error={photoPopupError} className="d-block mb-3" />
            </div>
          )}
          <button type="button" onClick={handlePhotoAddByPopup}>
            {photoPopupLocalFileId ? "Update" : "Append"}
          </button>
        </form>
      </BaseModal>
    </>
  );
};

export default EditPhotosSection;
