import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IndiceContext } from "../../contexts";
import NavbarThree from "../../components/_App/NavbarThree";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";

const defaultPhotoLink = "/images/admin/applications-image-23.jpg";

const DocumentsVerification = () => {
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const { user } = useContext(IndiceContext);
  const { success, setLoading } = useContext(IndiceContext);

  const [newProofOfAddress, setNewProofOfAddress] = useState(null);
  const [proofOfAddressLink, setProofOfAddressLink] = useState(null);

  const handleProofOfAddressChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewProofOfAddress(img);
    setProofOfAddressLink(url);
  };

  const [newReputableBankId, setNewReputableBankId] = useState(null);
  const [reputableBankIdLink, setReputableBankIdLink] = useState(null);

  const handleReputableBankIdChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewReputableBankId(img);
    setReputableBankIdLink(url);
  };

  const [newUtility, setNewUtility] = useState(null);
  const [utilityLink, setUtilityLink] = useState(null);

  const handleUtilityChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewUtility(img);
    setUtilityLink(url);
  };

  const [newHmrc, setNewHmrc] = useState(null);
  const [hmrcLink, setHmrcLink] = useState(null);

  const handleHmrcChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewHmrc(img);
    setHmrcLink(url);
  };

  const [newCouncilTaxBill, setNewCouncilTaxBill] = useState(null);
  const [councilTaxBillLink, setCouncilTaxBillLink] = useState(null);

  const handleCouncilTaxBillChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewCouncilTaxBill(img);
    setCouncilTaxBillLink(url);
  };

  const [newPassportOrDrivingId, setNewPassportOrDrivingId] = useState(null);
  const [passportOrDrivingIdLink, setPassportOrDrivingIdLink] = useState(null);

  const handlePassportOrDrivingIdChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewPassportOrDrivingId(img);
    setPassportOrDrivingIdLink(url);
  };

  const [
    newConfirmMoneyLaunderingChecksAndCompliance,
    setNewConfirmMoneyLaunderingChecksAndCompliance,
  ] = useState(null);
  const [
    confirmMoneyLaunderingChecksAndComplianceLink,
    setConfirmMoneyLaunderingChecksAndComplianceLink,
  ] = useState(null);

  const handleConfirmMoneyLaunderingChecksAndComplianceChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewConfirmMoneyLaunderingChecksAndCompliance(img);
    setConfirmMoneyLaunderingChecksAndComplianceLink(url);
  };

  const initDocuments = async () => {
    const docs = {};

    if (docs.proofOfAddressLink) {
      setProofOfAddressLink(
        ENV.SERVER_STORAGE_URL + "/" + docs.proofOfAddressLink
      );
    } else {
      setProofOfAddressLink(null);
    }

    if (docs.reputableBankIdLink) {
      setReputableBankIdLink(
        ENV.SERVER_STORAGE_URL + "/" + docs.reputableBankIdLink
      );
    } else {
      setReputableBankIdLink(null);
    }

    if (docs.utilityLink) {
      setUtilityLink(ENV.SERVER_STORAGE_URL + "/" + docs.utilityLink);
    } else {
      setUtilityLink(null);
    }

    if (docs.hmrcLink) {
      setHmrcLink(ENV.SERVER_STORAGE_URL + "/" + docs.hmrcLink);
    } else {
      setHmrcLink(null);
    }

    if (docs.councilTaxBillLink) {
      setCouncilTaxBillLink(
        ENV.SERVER_STORAGE_URL + "/" + docs.councilTaxBillLink
      );
    } else {
      setCouncilTaxBillLink(null);
    }

    if (docs.passportOrDrivingIdLink) {
      setPassportOrDrivingIdLink(
        ENV.SERVER_STORAGE_URL + "/" + docs.passportOrDrivingIdLink
      );
    } else {
      setPassportOrDrivingIdLink(null);
    }

    if (docs.confirmMoneyLaunderingChecksAndComplianceLink) {
      setConfirmMoneyLaunderingChecksAndComplianceLink(
        ENV.SERVER_STORAGE_URL +
          "/" +
          docs.confirmMoneyLaunderingChecksAndComplianceLink
      );
    } else {
      setConfirmMoneyLaunderingChecksAndComplianceLink(null);
    }
  };

  const handleSaveClick = async () => {
    setFormError(null);
    success.set("Profile updated successfully");
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="breadcrumb-area">
          <h1>Documents Verification</h1>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="my-profile-box">
              <h3>Documents</h3>

              <form method="get">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group profile-box">
                      <label>Proof of Address</label>
                      <img
                        src={proofOfAddressLink ?? defaultPhotoLink}
                        alt="image"
                      />
                      <div className="file-upload">
                        <input
                          type="file"
                          name="file"
                          id="file"
                          accept="image/*"
                          className="inputfile"
                          onChange={handleProofOfAddressChange}
                        />
                        <label htmlFor="file">
                          <i className="bx bx-upload"></i> Upload Photo
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group profile-box">
                      <label>Reputable Bank Id</label>
                      <img
                        src={reputableBankIdLink ?? defaultPhotoLink}
                        alt="image"
                      />
                      <div className="file-upload">
                        <input
                          type="file"
                          name="file"
                          id="file"
                          accept="image/*"
                          className="inputfile"
                          onChange={handleReputableBankIdChange}
                        />
                        <label htmlFor="file">
                          <i className="bx bx-upload"></i> Upload Photo
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group profile-box">
                      <label>Utility</label>
                      <img src={utilityLink ?? defaultPhotoLink} alt="image" />
                      <div className="file-upload">
                        <input
                          type="file"
                          name="file"
                          id="file"
                          accept="image/*"
                          className="inputfile"
                          onChange={handleUtilityChange}
                        />
                        <label htmlFor="file">
                          <i className="bx bx-upload"></i> Upload Photo
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group profile-box">
                      <label>HMRC</label>
                      <img src={hmrcLink ?? defaultPhotoLink} alt="image" />
                      <div className="file-upload">
                        <input
                          type="file"
                          name="file"
                          id="file"
                          accept="image/*"
                          className="inputfile"
                          onChange={handleHmrcChange}
                        />
                        <label htmlFor="file">
                          <i className="bx bx-upload"></i> Upload Photo
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group profile-box">
                      <label>Council Tax Bill</label>
                      <img
                        src={councilTaxBillLink ?? defaultPhotoLink}
                        alt="image"
                      />
                      <div className="file-upload">
                        <input
                          type="file"
                          name="file"
                          id="file"
                          accept="image/*"
                          className="inputfile"
                          onChange={handleCouncilTaxBillChange}
                        />
                        <label htmlFor="file">
                          <i className="bx bx-upload"></i> Upload Photo
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group profile-box">
                      <label>Passport Or Driving Id</label>
                      <img
                        src={passportOrDrivingIdLink ?? defaultPhotoLink}
                        alt="image"
                      />
                      <div className="file-upload">
                        <input
                          type="file"
                          name="file"
                          id="file"
                          accept="image/*"
                          className="inputfile"
                          onChange={handlePassportOrDrivingIdChange}
                        />
                        <label htmlFor="file">
                          <i className="bx bx-upload"></i> Upload Photo
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group profile-box">
                      <label>
                        Confirm Money Laundering Check And Compliance
                      </label>
                      <img
                        src={
                          confirmMoneyLaunderingChecksAndComplianceLink ??
                          defaultPhotoLink
                        }
                        alt="image"
                      />
                      <div className="file-upload">
                        <input
                          type="file"
                          name="file"
                          id="file"
                          accept="image/*"
                          className="inputfile"
                          onChange={
                            handleConfirmMoneyLaunderingChecksAndComplianceChange
                          }
                        />
                        <label htmlFor="file">
                          <i className="bx bx-upload"></i> Upload Photo
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

DocumentsVerification.getInitialProps = async () => ({
  access: "auth",
});

export default DocumentsVerification;
