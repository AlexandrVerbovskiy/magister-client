import { getFilePath } from "../../../utils";

const defaultLink = "/images/admin/user-avatar-80.png";

const DocumentView = ({ label, url }) => {
  const imgSrc = url ? getFilePath(url) : defaultLink;

  return (
    <div className="w-full lg:w-1/4 md:w-1/3" style={{ padding: "0.75rem" }}>
      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
        {label}
      </h2>

      <div
        className="form-group profile-box mt-2"
        style={{ maxWidth: "300px" }}
      >
        <img
          src={imgSrc}
          alt="image"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
};

const DocumentList = (documents) => {
  return (
    <div className="flex flex-row flex-wrap items-end p-6 space-y-6">
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
        url={documents.councilTaxBillLinkF}
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
