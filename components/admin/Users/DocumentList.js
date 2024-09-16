import React, { useState } from "react";

import { getFilePath } from "../../../utils";
import ImageView from "../Form/ImageView";
import STATIC from "../../../static";

const DocumentView = ({ label, url }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const imgSrc = url ? getFilePath(url) : STATIC.DEFAULTS.PHOTO_LINK;

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="w-full lg:w-1/4 md:w-1/3 p-3 flex flex-col justify-end document-view items-center md:items-start">
      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
        {label}
      </h2>

      <div className="form-group profile-box mt-2">
        <div className="image-box cursor-zoom-in" onClick={openPopup}>
          <img src={imgSrc} alt="image" width="300px" height="300px" />
        </div>

        <ImageView open={isPopupOpen} imgSrc={imgSrc} close={closePopup} />
      </div>
    </div>
  );
};

const DocumentList = (documents) => {
  return (
    <div className="flex flex-row flex-wrap p-6 space-y-6 pt-0">
      <DocumentView url={documents.userPhoto} label="User Photo" />
      <DocumentView url={documents.documentFront} label="Document Front" />
      <DocumentView url={documents.documentBack} label="Document Back" />
    </div>
  );
};

export default DocumentList;
