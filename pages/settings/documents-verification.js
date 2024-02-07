import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IndiceContext } from "../../contexts";
import NavbarThree from "../../components/_App/NavbarThree";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import ImageInput from "../../components/DashboardComponents/ImageInput";
import { saveMyDocuments, getMyDocuments } from "../../services";
import ENV from "../../env";

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
    const docs = await getMyDocuments();

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

    const formData = new FormData();

    let hasUpdates = false;

    if (newProofOfAddress) {
      formData.append("proofOfAddress", newProofOfAddress);
      hasUpdates = true;
    }

    if (newReputableBankId) {
      formData.append("reputableBankId", newReputableBankId);
      hasUpdates = true;
    }

    if (newUtility) {
      formData.append("utility", newUtility);
      hasUpdates = true;
    }

    if (newHmrc) {
      formData.append("hmrc", newHmrc);
      hasUpdates = true;
    }

    if (newCouncilTaxBill) {
      formData.append("councilTaxBill", newCouncilTaxBill);
      hasUpdates = true;
    }

    if (newPassportOrDrivingId) {
      formData.append("passportOrDrivingId", newPassportOrDrivingId);
      hasUpdates = true;
    }

    if (newConfirmMoneyLaunderingChecksAndCompliance) {
      formData.append(
        "confirmMoneyLaunderingChecksAndCompliance",
        newConfirmMoneyLaunderingChecksAndCompliance
      );
      hasUpdates = true;
    }

    console.log(hasUpdates);

    if (hasUpdates) {
      try {
        await saveMyDocuments(formData);
      } catch (e) {
        console.log(e);
      }
    }

    success.set("Profile updated successfully");
  };

  useEffect(() => {
    initDocuments();
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
                    <ImageInput
                      label="Proof of Address"
                      photoUrl={proofOfAddressLink}
                      onChange={handleProofOfAddressChange}
                      name="proofOfAddressLink"
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <ImageInput
                      label="Reputable Bank Id"
                      photoUrl={reputableBankIdLink}
                      onChange={handleReputableBankIdChange}
                      name="reputableBankIdLink"
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <ImageInput
                      label="Utility"
                      photoUrl={utilityLink}
                      onChange={handleUtilityChange}
                      name="utilityLink"
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <ImageInput
                      label="HMRC"
                      photoUrl={hmrcLink}
                      onChange={handleHmrcChange}
                      name="hmrcLink"
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <ImageInput
                      label="Council Tax Bill"
                      photoUrl={councilTaxBillLink}
                      onChange={handleCouncilTaxBillChange}
                      name="councilTaxBillLink"
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <ImageInput
                      label="Passport Or Driving Id"
                      photoUrl={passportOrDrivingIdLink}
                      onChange={handlePassportOrDrivingIdChange}
                      name="passportOrDrivingIdLink"
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <ImageInput
                      label="Confirm Money Laundering Check And Compliance"
                      photoUrl={confirmMoneyLaunderingChecksAndComplianceLink}
                      onChange={
                        handleConfirmMoneyLaunderingChecksAndComplianceChange
                      }
                      name="confirmMoneyLaunderingChecksAndComplianceLink"
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <button type="button" onClick={handleSaveClick}>
                        Save Change
                      </button>
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
