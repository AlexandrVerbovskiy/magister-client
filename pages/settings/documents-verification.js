import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { IndiceContext } from "../../contexts";
import NavbarThree from "../../components/_App/NavbarThree";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import ImageInput from "../../components/DashboardComponents/ImageInput";
import {
  saveMyDocuments,
  getMyDocuments,
  userVerifyRequestCreate,
  canSendVerifyRequest,
} from "../../services";
import { authSideProps } from "../../middlewares";
import { getFilePath } from "../../utils";
import env from "../../env";

const DocumentsVerification = ({ docs, canSend, lastAnswerDescription }) => {
  const [formError, setFormError] = useState(null);
  const { success, setLoading, user, authToken } = useContext(IndiceContext);
  const [activeSendRequestBtn, setActiveSendRequestBtn] = useState(canSend);
  const [lastDeclineDescription, setLastDeclineDescription] = useState(
    lastAnswerDescription
  );

  const [saveDocumentsDisabled, setSaveDocumentsDisabled] = useState(false);
  const [sendRequestDisabled, setSendRequestDisabled] = useState(false);

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
    if (docs.proofOfAddressLink) {
      setProofOfAddressLink(getFilePath(docs.proofOfAddressLink));
    } else {
      setProofOfAddressLink(null);
    }

    if (docs.reputableBankIdLink) {
      setReputableBankIdLink(getFilePath(docs.reputableBankIdLink));
    } else {
      setReputableBankIdLink(null);
    }

    if (docs.utilityLink) {
      setUtilityLink(getFilePath(docs.utilityLink));
    } else {
      setUtilityLink(null);
    }

    if (docs.hmrcLink) {
      setHmrcLink(getFilePath(docs.hmrcLink));
    } else {
      setHmrcLink(null);
    }

    if (docs.councilTaxBillLink) {
      setCouncilTaxBillLink(getFilePath(docs.councilTaxBillLink));
    } else {
      setCouncilTaxBillLink(null);
    }

    if (docs.passportOrDrivingIdLink) {
      setPassportOrDrivingIdLink(getFilePath(docs.passportOrDrivingIdLink));
    } else {
      setPassportOrDrivingIdLink(null);
    }

    if (docs.confirmMoneyLaunderingChecksAndComplianceLink) {
      setConfirmMoneyLaunderingChecksAndComplianceLink(
        getFilePath(docs.confirmMoneyLaunderingChecksAndComplianceLink)
      );
    } else {
      setConfirmMoneyLaunderingChecksAndComplianceLink(null);
    }
  };

  const dataToSave = () => {
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

    return hasUpdates ? formData : null;
  };

  const handleSaveClick = async () => {
    if (saveDocumentsDisabled) return;

    setSaveDocumentsDisabled(true);
    setFormError(null);

    const formData = dataToSave();

    if (formData) {
      try {
        await saveMyDocuments(formData, authToken);
      } catch (e) {
        setFormError(e);
      } finally {
        setSaveDocumentsDisabled(false);
      }
    }

    success.set("Documents updated successfully");
  };

  const handleSendRequestToVerify = async () => {
    if (saveDocumentsDisabled || sendRequestDisabled) return;

    setSaveDocumentsDisabled(true);
    setSendRequestDisabled(true);
    setFormError(null);

    try {
      const formData = dataToSave();

      if (formData) {
        await saveMyDocuments(formData, authToken);
      }

      const message = await userVerifyRequestCreate(authToken);
      success.set(message);
      setActiveSendRequestBtn(false);
    } catch (e) {
      setFormError(e);
    } finally {
      setSaveDocumentsDisabled(false);
      setSendRequestDisabled(false);
    }
  };

  useEffect(() => {
    initDocuments();
  }, [docs]);

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="breadcrumb-area">
          <h1>Settings</h1>
          <ol className="breadcrumb">
            <li className="item">
              <Link href="/settings/">Home</Link>
            </li>
            <li className="item">
              <Link href="/settings/documents-verification">
                Documents Verification
              </Link>
            </li>
          </ol>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="my-profile-box document-verification">
              <h3>Documents</h3>

              {lastDeclineDescription && (
                <div className="row" style={{ padding: "0 25px" }}>
                  <div className="col-lg-12 col-md-12">
                    <div
                      className="alert-dismissible fade show alert alert-danger"
                      role="alert"
                    >
                      {lastDeclineDescription}
                    </div>
                  </div>
                </div>
              )}

              <form method="get">
                <div className="row" style={{ alignItems: "flex-end" }}>
                  <div className="col-12 col-lg-3 col-md-4">
                    <ImageInput
                      label="Proof of Address"
                      photoUrl={proofOfAddressLink}
                      onChange={handleProofOfAddressChange}
                      name="proofOfAddressLink"
                      disabled={user.verified}
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-md-4">
                    <ImageInput
                      label="Reputable Bank Id"
                      photoUrl={reputableBankIdLink}
                      onChange={handleReputableBankIdChange}
                      name="reputableBankIdLink"
                      disabled={user.verified}
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-md-4">
                    <ImageInput
                      label="Utility"
                      photoUrl={utilityLink}
                      onChange={handleUtilityChange}
                      name="utilityLink"
                      disabled={user.verified}
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-md-4">
                    <ImageInput
                      label="HMRC"
                      photoUrl={hmrcLink}
                      onChange={handleHmrcChange}
                      name="hmrcLink"
                      disabled={user.verified}
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-md-4">
                    <ImageInput
                      label="Council Tax Bill"
                      photoUrl={councilTaxBillLink}
                      onChange={handleCouncilTaxBillChange}
                      name="councilTaxBillLink"
                      disabled={user.verified}
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-md-4">
                    <ImageInput
                      label="Passport Or Driving Id"
                      photoUrl={passportOrDrivingIdLink}
                      onChange={handlePassportOrDrivingIdChange}
                      name="passportOrDrivingIdLink"
                      disabled={user.verified}
                    />
                  </div>

                  <div className="col-12 col-lg-3 col-md-4">
                    <ImageInput
                      label="Confirm Money Laundering Check And Compliance"
                      photoUrl={confirmMoneyLaunderingChecksAndComplianceLink}
                      onChange={
                        handleConfirmMoneyLaunderingChecksAndComplianceChange
                      }
                      name="confirmMoneyLaunderingChecksAndComplianceLink"
                      disabled={user.verified}
                    />
                  </div>

                  {formError && (
                    <div className="col-lg-12 col-md-12">
                      <div
                        className="alert-dismissible fade show alert alert-danger"
                        role="alert"
                      >
                        {formError}
                      </div>
                    </div>
                  )}

                  {!user.verified && (
                    <div className="col-12">
                      <div className="form-group d-flex gap-2 justify-content-between mt-2">
                        <button
                          type="button"
                          style={{ width: "300px" }}
                          onClick={handleSaveClick}
                          disabled={saveDocumentsDisabled}
                        >
                          Save Changes
                        </button>

                        {activeSendRequestBtn && (
                          <button
                            type="button"
                            style={{ width: "300px" }}
                            onClick={handleSendRequestToVerify}
                            disabled={sendRequestDisabled}
                          >
                            Send Request To Verify
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const baseSideProps = await authSideProps(context);
  if (baseSideProps.notFound) return baseSideProps;

  try {
    const docs = await getMyDocuments(baseSideProps.props.authToken);
    let { canSend, lastAnswerDescription } = await canSendVerifyRequest(
      baseSideProps.props.authToken
    );

    return {
      props: { ...baseSideProps.props, canSend, lastAnswerDescription, docs },
    };
  } catch (e) {
    console.log(e);
    return {
      notFound: true,
    };
  }
};

export default DocumentsVerification;
