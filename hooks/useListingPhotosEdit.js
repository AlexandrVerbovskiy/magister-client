import React, { useState } from "react";
import { uniqueId } from "../utils";

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

  const handleClosePhotoPopup = () => {
    setPhotoPopupLink("");
    setPhotoPopupType("storage");
    setPhotoPopupPhoto(null);
    setPhotoPopupActive(null);
    setPhotoPopupLocalFileId(null);
  };

  const adaptLinkPropsToLocal = (list) =>
    list.map((info) => ({
      link: info.link,
      localId: uniqueId(),
      type: info.type,
      date: Date.now(),
    }));

  const handlePhotoAddByPopup = () => {
    setFileError(null);

    if (photoPopupType === "storage") {
      let found = null;
      let date = Date.now();

      if (photoPopupLocalFileId) {
        const newFiles = files.map((file) => {
          if (file.localId != photoPopupLocalFileId) return file;

          found = { ...file, preview: URL.createObjectURL(photoPopupPhoto) };
          return found;
        });

        setFiles(newFiles);
      }

      if (photoPopupLocalFileId && !found) {
        const file = linkFiles.filter(
          (file) => file.localId == photoPopupLocalFileId
        )[0];

        if (file) {
          date = file.date;
        }

        const newLinkFiles = linkFiles.filter(
          (file) => file.localId != photoPopupLocalFileId
        );
        setLinkFiles(newLinkFiles);
      }

      if (!photoPopupLocalFileId || !found) {
        setFiles((prev) => [
          ...prev,
          Object.assign(photoPopupPhoto, {
            preview: URL.createObjectURL(photoPopupPhoto),
            localId: uniqueId(),
            date,
          }),
        ]);
      }
    } else {
      let found = null;
      let date = Date.now();

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
            localId: uniqueId(),
            type: "url",
            date,
          },
        ]);
      }
    }

    handleClosePhotoPopup();
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
  };
};

export default useListingPhotoEdit;
