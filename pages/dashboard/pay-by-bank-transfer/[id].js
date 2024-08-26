import React, { useContext, useState } from "react";
import Link from "next/link";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../../components/_App/NavbarThree";
import {
  unpaidOrderTransactionByCreditCard,
  getOrderInfoForPayByCreditCardOptions,
  generateOrderInvoicePdf,
} from "../../../services";
import { authSideProps } from "../../../middlewares";
import {
  calculateFullTotalByDaysCount,
  downloadFileUrl,
  getFactOrderDays,
  moneyFormatVisual,
} from "../../../utils";
import { useDropzone } from "react-dropzone";
import STATIC from "../../../static";
import { IndiceContext } from "../../../contexts";
import ErrorSpan from "../../../components/ErrorSpan";
import OrderIconPopup from "../../../components/IconPopups/OrderIconPopup";
import { useRouter } from "next/router";

function PayByCreditCard({ orderId, order, bankAccount }) {
  const [proof, setProof] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [proofError, setProofError] = useState(null);
  const { authToken, error, success } = useContext(IndiceContext);
  const [orderIconPopupState, setOrderIconPopupState] = useState({});
  const router = useRouter();

  const { getRootProps: getRootPropsPopup, getInputProps: getInputPropsPopup } =
    useDropzone({
      accept: STATIC.ACCEPT_IMAGE_FORMAT,
      maxSize: STATIC.LIMITS.FILE_SIZE,
      multiple: false,
      onDrop: (acceptedFiles, fileRejections) => {
        const newFiles = acceptedFiles.slice(0, 1);

        if (newFiles.length > 0) {
          setProof(
            Object.assign(newFiles[0], {
              preview: URL.createObjectURL(newFiles[0]),
              date: Date.now(),
            })
          );
        } else {
          setProof(null);
        }

        if (fileRejections.length > 0) {
          setProofError(fileRejections[0]["errors"][0].message);
        } else {
          setProofError(null);
        }
      },
    });

  const totalPrice = calculateFullTotalByDaysCount(
    getFactOrderDays(order.offerStartDate, order.offerEndDate),
    order.offerPricePerDay,
    order.tenantFee,
    "sum"
  );

  const handlePdfDownload = async (e) => {
    e.preventDefault();

    try {
      if (disabled) {
        return;
      }

      setDisabled(true);
      const fileUrl = await generateOrderInvoicePdf(orderId, authToken);
      downloadFileUrl(fileUrl, orderId);
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  const handleSubmit = async () => {
    if (disabled) {
      return;
    }

    let hasError = false;
    if (!proof) {
      setProofError("Required field");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const formData = new FormData();

    formData.append("proof", proof);
    formData.append("orderId", orderId);

    try {
      setDisabled(true);
      await unpaidOrderTransactionByCreditCard(formData, authToken);

      setOrderIconPopupState({
        active: true,
        text: "Request sent successfully",
        closeButtonText: "Go to bookings page",
        onClose: () => {
          router.push(`/dashboard/orders/${orderId}/`);
        },
        textWeight: 600,
      });
    } catch (e) {
      error.set(e.message);
      setDisabled(false);
    }
  };

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="miran-grid-sorting row align-items-center d-none d-xl-block">
          <div className="col-12 result-count">
            <div className="breadcrumb-area">
              <h1>Bookings</h1>
              <ol className="breadcrumb">
                <li className="item">
                  <Link href="/">Home</Link>
                </li>
                <li className="item">
                  <Link href="/dashboard/">Dashboard</Link>
                </li>
                <li className="item">
                  <Link href={"/dashboard/orders/" + orderId}>Bookings</Link>
                </li>
                <li className="item">#{orderId}</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-12">
            <div className="earnings-box">
              <h3 className="d-flex align-items-center justify-content-between">
                Bank Details{" "}
                <div>
                  <button
                    disabled={disabled}
                    className="pay-download-invoice small-text"
                    type="button"
                    onClick={handlePdfDownload}
                  >
                    Download Invoice
                  </button>
                </div>
              </h3>
              <ul>
                <li
                  style={{
                    padding: "10px 25px",
                    background: "white",
                    borderBottom: "0",
                    color: "black",
                  }}
                >
                  <b>Booking:</b> #{orderId}
                </li>

                <li
                  style={{
                    padding: "10px 25px",
                    background: "white",
                    borderBottom: "0",
                    color: "black",
                  }}
                >
                  <b>Sort Code: </b>
                  {bankAccount?.bankAccountReferenceConceptCode ?? ""}
                </li>

                <li
                  style={{
                    padding: "10px 25px",
                    background: "white",
                    borderBottom: "0",
                    color: "black",
                  }}
                >
                  <b>Account No: </b>
                  {bankAccount?.bankAccountBeneficiary ?? ""}
                </li>

                <li
                  style={{
                    padding: "10px 25px",
                    background: "white",
                    borderBottom: "0",
                    color: "black",
                  }}
                >
                  <b>IBAN: </b>
                  {bankAccount?.bankAccountIban ?? ""}
                  {}
                </li>
                <li
                  style={{
                    padding: "10px 25px",
                    background: "white",
                    borderBottom: "0",
                    color: "black",
                  }}
                >
                  <b>BIC: </b>
                  {bankAccount?.bankAccountSwiftBic ?? ""}
                  {}
                </li>

                <li
                  style={{
                    margin: "0 25px",
                    background: "white",
                    borderBottom: "0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    color: "black",
                    borderTop: "1px solid #CCCCCC",
                  }}
                >
                  <b>Total Amount to Transfer: </b>
                  <span className="pay-by-card-price">
                    {moneyFormatVisual(totalPrice)}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="earnings-box">
              <h3>Payment Details</h3>
              <ul>
                <li
                  style={{
                    padding: "10px 25px",
                    background: "white",
                    borderBottom: "0",
                    color: "black",
                  }}
                >
                  <div className="form-group" style={{ marginTop: "5px" }}>
                    <div className="gallery-flex-parent">
                      <div
                        className="dropzone add-listings-box"
                        style={{
                          marginBottom: "0",
                          width: "100%",
                          padding: "0",
                        }}
                        {...getRootPropsPopup()}
                      >
                        <input name="modalImage" {...getInputPropsPopup()} />

                        {proof ? (
                          <div
                            className="invoice-btn-box gallery-flex form-group"
                            style={{ marginBottom: "0" }}
                          >
                            <img
                              src={proof.preview}
                              style={{ maxHeight: "200px", marginBottom: "0" }}
                            />
                          </div>
                        ) : (
                          <div
                            className="gallery-flex form-group"
                            style={{ marginBottom: "0" }}
                          >
                            <div
                              className="add-more-image"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around",
                              }}
                            >
                              <svg
                                width="54"
                                height="53"
                                viewBox="0 0 54 53"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M25.8962 34.399V15.297L20.7507 20.4424L19.1872 18.8568L27.0003 11.0415L34.8156 18.8568L33.2521 20.4446L28.1045 15.297V34.399H25.8962ZM15.1107 41.9582C14.0934 41.9582 13.2446 41.6181 12.5645 40.9379C11.8843 40.2578 11.5435 39.4083 11.542 38.3895V33.0387H13.7503V38.3895C13.7503 38.7296 13.8917 39.0417 14.1743 39.3258C14.457 39.61 14.7684 39.7513 15.1085 39.7498H38.8922C39.2308 39.7498 39.5422 39.6085 39.8263 39.3258C40.1105 39.0432 40.2518 38.7311 40.2503 38.3895V33.0387H42.4587V38.3895C42.4587 39.4068 42.1186 40.2555 41.4384 40.9357C40.7582 41.6159 39.9088 41.9567 38.89 41.9582H15.1107Z"
                                  fill="#666666"
                                />
                              </svg>
                              Upload your payment receipt here. Click to select
                              files
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {proofError && (
                      <div
                        className="w-full form-group"
                        style={{ margin: "-8px 0px -20px" }}
                      >
                        <div className="is-invalid">
                          <ErrorSpan error={proofError} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      disabled={disabled}
                      className="pay-by-card-btn"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Submit payment
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <OrderIconPopup
            modalActive={orderIconPopupState.active}
            closeModal={orderIconPopupState.onClose}
            textWeight={orderIconPopupState.textWeight}
            text={orderIconPopupState.text}
            mainCloseButtonText={orderIconPopupState.closeButtonText}
          />
        </div>
      </div>
    </>
  );
}

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getOrderInfoForPayByCreditCardOptions(
    id,
    baseSideProps.authToken
  );
  return { ...options, orderId: id };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Pay by bank transfer" },
  });

export default PayByCreditCard;
