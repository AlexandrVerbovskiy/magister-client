import React, { useState } from 'react';

import { getFilePath } from "../../../utils";

const defaultLink = "/images/admin/user-avatar-80.png";

const DocumentView = ({ label, url }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const imgSrc = url ? getFilePath(url) : defaultLink;

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="w-full lg:w-1/4 md:w-1/3 p-3 flex flex-col justify-end document-view">
      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
        {label}
      </h2>

      <div className="form-group profile-box mt-2">
        <div className="image-box cursor-zoom-in" onClick={openPopup}>
          <img src={imgSrc} alt="image" width="300px" height="300px" />
        </div>
        {isPopupOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <div
              className="absolute w-full h-full bg-gray-900 opacity-50"
              onClick={closePopup}
            ></div>
            <div className="modal-container bg-white w-11/12 md:max-w-2xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
              <div className="modal-content text-left">
                <div>
                  <img src={imgSrc} alt="image" className='w-full h-full'/>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DocumentList = (documents) => {
  return (
    <div className="flex flex-row flex-wrap p-6 space-y-6 pt-0">
      <DocumentView
        url={documents.proofOfAddressLink}
        label="Proof of Address"
      />

      <DocumentView
        url={documents.reputableBankIdLink}
        label="Reputable Bank Id"
      />

      <DocumentView url={documents.utilityLink} label="Utility" />

      <DocumentView url={documents.hmrcLink} label="HMRC" />

      <DocumentView
        url={documents.councilTaxBillLink}
        label="Council Tax Bill"
      />

      <DocumentView
        url={documents.passportOrDrivingIdLink}
        label="Passport Or Driving Id"
      />

      <DocumentView
        url={documents.confirmMoneyLaunderingChecksAndComplianceLink}
        label="Confirm Money Laundering Check And Compliance"
      />
    </div>
  );
};

export default DocumentList;
