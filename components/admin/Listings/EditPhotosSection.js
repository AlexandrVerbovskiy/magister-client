import { useDropzone } from "react-dropzone";
import ModalBlank from "../ModalBlank";
import {
  getListingImageByType,
  sortListingImages,
  uniqueImageId,
} from "../../../utils";
import DropdownClassic from "../DropdownClassic";
import Input from "../../../components/admin/Form/Input";
import ErrorSpan from "../ErrorSpan";
import STATIC from "../../../static";
import { useIsMobile } from "../../../hooks";
import { useContext } from "react";
import { IndiceContext } from "../../../contexts";

const linkTypeOptions = [
  { value: "storage", title: "Storage" },
  { value: "url", title: "Url" },
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
    <div className="bg-gray-100 border relative rounded-lg overflow-hidden shadow-md xl:w-1/4 lg:w-1/3 md:w-1/2 gallery-flex-parent">
      <div className="flex flex-col form-group" onClick={handleImageClick}>
        <img src={path} />
        <input name="image[]" {...inputProps} className="mt-2" />
      </div>
      <button
        type="button"
        className="remove-file-btn bg-teal-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-teal-600"
        onClick={handleRemoveClick}
      >
        +
      </button>
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
      maxSize: STATIC.LIMITS.FILE_SIZE,
      accept: STATIC.ACCEPT_IMAGE_FORMAT,
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

  const handleChangePhotoPopupType = (value) => {
    if (value === photoPopupType) return;

    setPhotoPopupLink("");
    setPhotoPopupPhoto(null);
    setPhotoPopupType(value);
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

  const infosToView = sortListingImages([
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
  ]);

  return (
    <>
      <section {...getRootPropsBase()} className="dropzone add-listings-box">
        <input name="modalImage" {...getInputPropsBase()} />

        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
          Photos
        </h2>

        <div className="text-sm">
          You can add maximum 5 files with maximum summary size 20 MB
        </div>

        <div
          className="flex flex-wrap mt-5 bg-gray-100 border rounded-lg shadow-md"
          style={{ width: "100%", gridGap: "0.5rem" }}
        >
          <div className="flex flex-col form-group">
            <div
              className="add-more-image p-4 cursor-pointer"
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
            <div className="w-full form-group p-2">
              <div
                className="is-invalid"
                style={{ marginBottom: "10px", marginTop: "-15px" }}
              >
                <ErrorSpan error={fileError} />
              </div>
            </div>
          )}
        </div>
      </section>

      <ModalBlank
        id="edit-listing-photo-popup"
        modalOpen={photoPopupActive}
        setModalOpen={handleClosePhotoPopup}
      >
        <div className="p-5">
          <div>
            <div className="mb-2">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Photo Popup
              </div>
            </div>
            <div className="text-sm mb-4">
              <div className="space-y-2">
                {/*<DropdownClassic
                  options={linkTypeOptions}
                  selected={photoPopupType}
                  setSelected={handleChangePhotoPopupType}
                  needSearch={false}
                />*/}

                {photoPopupType !== "storage" && (
                  <div className="mb-4">
                    <Input
                      name="photoPopupLink"
                      placeholder="https://storage.google.com"
                      labelClassName="block text-sm font-medium mb-1"
                      value={photoPopupLink}
                      setValue={handleChangePhotoPopupLink}
                      inputClassName="form-input w-full"
                      error={photoPopupError}
                    />

                    {photoPopupLink.length > 0 && (
                      <div className="bg-gray-100 invoice-btn-box gallery-flex form-group mt-2">
                        <img
                          onLoad={successLoadLinkPhoto}
                          style={
                            linkSuccessPhoto
                              ? {}
                              : {
                                  width: "20px",
                                  height: "20px",
                                }
                          }
                          src={photoPopupLink}
                        />
                      </div>
                    )}
                  </div>
                )}

                {photoPopupType === "storage" && (
                  <div
                    className="dropzone add-listings-box mb-4"
                    {...getRootPropsPopup()}
                  >
                    <input name="modalPhotoInput" {...getInputPropsPopup()} />

                    {!photoPopupPhoto && !photoPopupLink && (
                      <div className="gallery-flex form-group">
                        <div className="add-more-image bg-gray-100 border rounded-lg shadow-md">
                          Click to select{" "}
                          {isMobile
                            ? "Click to select files"
                            : "Click or drag and drop to select files"}
                        </div>
                      </div>
                    )}

                    {!photoPopupPhoto && photoPopupLink && (
                      <div className="invoice-btn-box gallery-flex form-group bg-gray-100 border rounded-lg shadow-md cursor-pointer">
                        <img
                          src={getListingImageByType(photoPopupLink, "storage")}
                        />
                      </div>
                    )}

                    {photoPopupPhoto && (
                      <div className="invoice-btn-box gallery-flex form-group bg-gray-100 border rounded-lg shadow-md cursor-pointer">
                        <img src={photoPopupPhoto.preview} />
                      </div>
                    )}

                    <ErrorSpan error={photoPopupError} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                type="button"
                onClick={handlePhotoAddByPopup}
                className="btn bg-teal-500 hover:bg-teal-600 text-white"
              >
                {photoPopupLocalFileId ? "Update" : "Append"}
              </button>
            </div>
          </div>
        </div>
      </ModalBlank>
    </>
  );
};

export default EditPhotosSection;
