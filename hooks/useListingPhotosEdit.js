import React, { useState } from "react";
import { uniqueImageId, validateSmallText } from "../utils";

const useListingPhotoEdit = () => {
  const [files, setFiles] = useState([]);
  const [linkFiles, setLinkFiles] = useState([]);
  const [fileError, setFileError] = useState(null);

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
            found = { ...file, preview: URL.createObjectURL(photoPopupPhoto) };
            return found;
          }
        });

        setFiles(newFiles);
      }

      if (photoPopupLocalFileId && !found) {
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
      let found = null;
      let date = Date.now();
      let localId = uniqueImageId();
      let id = null;

      if (validateSmallText(photoPopupLink) !== true) {
        setPhotoPopupError(validateSmallText(photoPopupLink));
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
    setPhotoPopupLink,
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
  };
};

export default useListingPhotoEdit;
