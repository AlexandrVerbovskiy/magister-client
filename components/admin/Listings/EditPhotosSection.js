import { useDropzone } from "react-dropzone";
import ModalBlank from "../ModalBlank";
import { getListingImageByType, uniqueId } from "../../../utils";
import DropdownClassic from "../DropdownClassic";
import Input from "../../../components/admin/Form/Input";
import ErrorSpan from "../ErrorSpan";
import env from "../../../env";

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
    <div className="xl:w-1/4 lg:w-1/3 md:w-1/2 gallery-flex-parent">
      <div
        className="bg-gray-100 border shadow-md flex flex-col form-group"
        onClick={handleImageClick}
      >
        <img src={path} className="object-cover w-full h-auto" />
        <input name="image[]" {...inputProps} className="mt-2" />
        <button
          type="button"
          className="remove-file-btn bg-indigo-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-indigo-600"
          onClick={handleRemoveClick}
        >
          +
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
  photoPopupError,
  setPhotoPopupError,
}) => {
  const { getRootProps: getRootPropsBase, getInputProps: getInputPropsBase } =
    useDropzone({
      maxFiles: env.MAX_FILE_SIZE,
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
        setFileError(null);
      },
    });

  const { getRootProps: getRootPropsPopup, getInputProps: getInputPropsPopup } =
    useDropzone({
      accept: acceptImageOptions,
      onDrop: (acceptedFiles) => {
        const newFiles = acceptedFiles.slice(0, 1);

        if (newFiles.length > 0) {
          setPhotoPopupError(null);

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

  const handleChangePhotoPopupType = (value) => {
    setPhotoPopupLink("");
    setPhotoPopupPhoto(null);
    setPhotoPopupType(value);
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
      <section {...getRootPropsBase()} className="dropzone add-listings-box">
        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
          Photos
        </h2>

        <div className="text-sm">You can add maximum 5 files</div>

        <div
          className="flex flex-wrap mt-5"
          style={{ width: "100%", gridGap: "0.5rem" }}
        >
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
            <div className="xl:w-1/4 lg:w-1/3 md:w-1/2 gallery-flex-parent">
              <div className="bg-gray-100 border rounded-lg shadow-md flex flex-col form-group">
                <div
                  className="add-more-image p-4 cursor-pointer"
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
                <DropdownClassic
                  options={linkTypeOptions}
                  selected={photoPopupType}
                  setSelected={handleChangePhotoPopupType}
                  needSearch={false}
                />

                {photoPopupType !== "storage" && (
                  <div className="mb-4">
                    <Input
                      name="photoPopupLink"
                      placeholder="https://storage.google.com"
                      labelClassName="block text-sm font-medium mb-1"
                      value={photoPopupLink}
                      setValue={setPhotoPopupLink}
                      inputClassName="form-input w-full"
                    />

                    {photoPopupLink.length > 0 && (
                      <div className="bg-gray-100 invoice-btn-box gallery-flex form-group mt-2">
                        <img src={photoPopupLink} />
                      </div>
                    )}
                  </div>
                )}

                {photoPopupType === "storage" && (
                  <div
                    className="dropzone add-listings-box mb-4"
                    {...getRootPropsPopup()}
                  >
                    {!photoPopupPhoto && !photoPopupLink && (
                      <div className="gallery-flex form-group">
                        <div className="add-more-image bg-gray-100 border rounded-lg shadow-md">
                          Drag 'n' drop some file here, or click to select file
                        </div>
                      </div>
                    )}

                    {!photoPopupPhoto && photoPopupLink && (
                      <div className="invoice-btn-box gallery-flex form-group bg-gray-100 cursor-pointer">
                        <img
                          src={getListingImageByType(photoPopupLink, "storage")}
                        />
                        <input
                          name="modalPhotoInput"
                          {...getInputPropsPopup()}
                        />
                      </div>
                    )}

                    {photoPopupPhoto && (
                      <div className="invoice-btn-box gallery-flex form-group bg-gray-100 cursor-pointer">
                        <img src={photoPopupPhoto.preview} />
                        <input
                          name="modalPhotoInput"
                          {...getInputPropsPopup()}
                        />
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
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
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
