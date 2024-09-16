import React, { useEffect, useState } from "react";
import { uniqueImageId, validateBigText } from "../utils";

const useListingPhotosEdit = () => {
  const [files, setFiles] = useState([]);
  const [linkFiles, setLinkFiles] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [linkSuccessPhoto, setLinkSuccessPhoto] = useState(false);

  useEffect(() => setLinkSuccessPhoto(false), [linkFiles]);

  const removeFile = (localIdToRemove) => {
    const newFiles = files.filter((file) => file.localId !== localIdToRemove);
    setFiles(newFiles);

    const newLinkFiles = linkFiles.filter(
      (file) => file.localId !== localIdToRemove
    );

    setLinkFiles(newLinkFiles);
  };

  const [photoPopupActive, setPhotoPopupActive] = useState(false);
  const [photoPopupPhoto, setPhotoPopupPhoto] = useState(null);
  const [photoPopupLink, setPhotoPopupLink] = useState("");
  const [photoPopupType, setPhotoPopupType] = useState("storage");
  const [photoPopupLocalFileId, setPhotoPopupLocalFileId] = useState(null);
  const [photoPopupError, setPhotoPopupError] = useState(null);

  const handleClosePhotoPopup = () => {
    setPhotoPopupLink("");
    setPhotoPopupType("storage");
    setPhotoPopupPhoto(null);
    setPhotoPopupActive(null);
    setPhotoPopupLocalFileId(null);
    setPhotoPopupError(null);
  };

  const handleChangeLink = (value) => {
    setPhotoPopupLink(value);
    setLinkSuccessPhoto(false);
  };

  const adaptLinkPropsToLocal = (list) =>
    list.map((info) => ({
      link: info.link,
      localId: uniqueImageId(),
      type: info.type,
      date: Date.now(),
    }));

  const handlePhotoAddByPopup = () => {
    setFileError(null);

    let success = true;

    if (photoPopupType === "storage") {
      let found = null;
      let date = Date.now();
      let localId = uniqueImageId();
      let id = null;

      if (photoPopupLocalFileId) {
        const newFiles = files.map((file) => {
          if (file.localId != photoPopupLocalFileId) return file;

          if (!photoPopupPhoto) {
            setPhotoPopupError("No file selected");
            success = false;
            return file;
          } else {
            found = Object.assign(photoPopupPhoto, {
              preview: URL.createObjectURL(photoPopupPhoto),
              id: file.id,
              localId: file.localId,
              date: file.date,
            });

            return found;
          }
        });

        setFiles(newFiles);
      }

      if (photoPopupLocalFileId && !found) {
        if (photoPopupPhoto) {
          const file = linkFiles.filter(
            (file) => file.localId == photoPopupLocalFileId
          )[0];

          if (file) {
            date = file.date;
            localId = file.localId;
            id = file.id;
          }

          const newLinkFiles = linkFiles.filter(
            (file) => file.localId != photoPopupLocalFileId
          );
          setLinkFiles(newLinkFiles);
        } else {
          if (photoPopupLink) {
            const newLinkFiles = linkFiles.map((file) => {
              if (file.localId != photoPopupLocalFileId) return file;

              found = { ...file, link: photoPopupLink, type: "storage" };
              return found;
            });

            setLinkFiles(newLinkFiles);
          } else {
            setPhotoPopupError("No file selected");
            return;
          }
        }
      }

      if (!photoPopupLocalFileId || !found) {
        if (photoPopupPhoto) {
          setFiles((prev) => [
            ...prev,
            Object.assign(photoPopupPhoto, {
              preview: URL.createObjectURL(photoPopupPhoto),
              localId: localId,
              date,
              id,
            }),
          ]);
        } else {
          success = false;
          setPhotoPopupError("No file selected");
        }
      }
    } else {
      if (!linkSuccessPhoto) {
        setPhotoPopupError("Image wasn't found");
        return;
      }

      if (!photoPopupLink) {
        setPhotoPopupError("Link is required");
        return;
      }

      let found = null;
      let date = Date.now();
      let localId = uniqueImageId();
      let id = null;

      if (validateBigText(photoPopupLink) !== true) {
        setPhotoPopupError(validateBigText(photoPopupLink));
        success = false;
        return;
      }

      if (photoPopupLocalFileId) {
        const newLinkFiles = linkFiles.map((file) => {
          if (file.localId != photoPopupLocalFileId) return file;

          found = { ...file, link: photoPopupLink, type: "url" };
          return found;
        });

        setLinkFiles(newLinkFiles);
      }

      if (photoPopupLocalFileId && !found) {
        const file = files.filter(
          (file) => file.localId == photoPopupLocalFileId
        )[0];

        if (file) {
          date = file.date;
          localId = file.localId;
          id = file.id;
        }

        const newFiles = files.filter(
          (file) => file.localId != photoPopupLocalFileId
        );

        setFiles(newFiles);
      }

      if (!photoPopupLocalFileId || !found) {
        setLinkFiles((prev) => [
          ...prev,
          {
            link: photoPopupLink,
            localId,
            type: "url",
            date,
            id,
          },
        ]);
      }
    }

    if (success) {
      handleClosePhotoPopup();
    }
  };

  return {
    adaptLinkPropsToLocal,
    files,
    linkFiles,
    removeFile,
    photoPopupLink,
    photoPopupActive,
    setPhotoPopupActive,
    setPhotoPopupLink: handleChangeLink,
    setPhotoPopupPhoto,
    handlePhotoAddByPopup,
    photoPopupType,
    setPhotoPopupType,
    photoPopupLocalFileId,
    setPhotoPopupLocalFileId,
    handleClosePhotoPopup,
    photoPopupPhoto,
    setFiles,
    setLinkFiles,
    fileError,
    setFileError,
    photoPopupError,
    setPhotoPopupError,
    linkSuccessPhoto,
    successLoadLinkPhoto: () => setLinkSuccessPhoto(true),
  };
};

export default useListingPhotosEdit;
