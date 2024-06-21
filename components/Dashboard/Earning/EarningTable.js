import React, { useContext, useState } from "react";

import Link from "next/link";
import { IndiceContext } from "../../../contexts";
import InputView from "../../FormComponents/InputView";
import {
  calculateTotalPriceByDaysCount,
  getDaysDifference,
  moneyFormat,
  ownerGetsCalculate,
  tenantPaymentCalculate,
  dateConverter,
} from "../../../utils";
import PayedCancelModal from "../../Order/PayedCancelModal";
import SuccessIconPopup from "../../../components/IconPopups/SuccessIconPopup";
import { useRouter } from "next/router";
import {
  orderFullCancelPayed,
  updateRecipientPaymentData,
} from "../../../services";

const Status = ({ status, receivedType }) => {
  let statusName = "Unknown";
  let className = "status-background-gray";

  if (status === "completed") {
    statusName = "Completed";
    className = "status-background-green";
  }

  if (status === "failed" && receivedType == "refund") {
    statusName = "Failed";
    className = "status-background-red";
  }

  if (
    status === "waiting" ||
    (status === "failed" && receivedType != "refund")
  ) {
    statusName = "Waiting";
    className = "status-background-orange";
  }

  if (status === "cancelled") {
    statusName = "Cancelled";
    className = "status-background-gray";
  }

  return (
    <div className={`bookings-status order-item-status ${className}`}>
      {statusName}
    </div>
  );
};

const EarningTable = ({
  failedDescription,
  receivedType,
  status,
  refundCommission,
  type,
  data,
  offerStartDate,
  offerEndDate,
  offerPricePerDay,
  tenantFee,
  ownerFee,
  orderId,
  id,
}) => {
  const router = useRouter();
  const { authToken, error } = useContext(IndiceContext);
  const [disabled, setDisabled] = useState(false);
  const [updatePopupActive, setUpdatePopupActive] = useState(false);

  const [successIconPopupState, setSuccessIconPopupState] = useState({});

  const activateSuccessOrderPopup = () => {
    const handleClose = () => {
      router.push("/dashboard/wallet");
      setSuccessIconPopupState({});
    };

    setSuccessIconPopupState({
      active: true,
      text: "Refund details successfully updated. The retry was sent successfully",
      closeButtonText: "Move to Wallet",
      onClose: handleClose,
      textWeight: 600,
    });
  };

  let typeText = "Unknown";
  let recipientNumber = "-";

  if (data) {
    if (type == "paypal") {
      recipientNumber = data.paypalId;
      typeText = "Paypal";
    }

    if (type == "card") {
      recipientNumber = data.cardNumber;
      typeText = "Card";
    }
  }

  const onPayedFastCancel = async ({ type, paypalId, cardNumber }) => {
    try {
      await updateRecipientPaymentData({id, type, paypalId, cardNumber}, authToken);

      setUpdatePopupActive(false);
      activateSuccessOrderPopup();
    } catch (e) {
      error.set(e.message);
    }
  };

  return (
    <>
      <div className="add-listings-box">
        <h3
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Basic Informations
          <Status status={status} receivedType={receivedType} />
        </h3>

        <div className="row">
          <div className="col-lg-6 col-md-6">
            <InputView
              label="Offer Start Date"
              placeholder="Offer Start Date"
              value={dateConverter(offerStartDate)}
              icon="bx bx-calendar"
            />
          </div>

          <div className="col-lg-6 col-md-6">
            <InputView
              label="Offer End Date"
              placeholder="Offer End Date"
              value={dateConverter(offerEndDate)}
              icon="bx bx-calendar"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-6">
            <InputView
              label="Offer Price Per Day"
              placeholder="Offer Price Per Day"
              icon="bx bx-dollar-circle"
              value={`${moneyFormat(offerPricePerDay)}`}
            />
          </div>

          <div className="col-lg-6 col-md-6">
            <InputView
              label="Subtotal Price"
              placeholder="Subtotal Price"
              icon="bx bx-dollar-circle"
              value={`${calculateTotalPriceByDaysCount(
                getDaysDifference(offerStartDate, offerEndDate),
                offerPricePerDay
              )}`}
            />
          </div>
        </div>

        {receivedType == "refund" ? (
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <InputView
                label="Renter Fee"
                placeholder="Renter Fee"
                icon="bx bx-tag"
                value={`${tenantFee}`}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Total Paid"
                placeholder="Total Paid"
                icon="bx bx-dollar-circle"
                value={`${tenantPaymentCalculate(
                  offerStartDate,
                  offerEndDate,
                  tenantFee,
                  offerPricePerDay
                )}`}
              />
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <InputView
                label="Listing Owner Fee"
                placeholder="Listing Owner Fee"
                icon="bx bx-tag"
                value={`${ownerFee}`}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Total Get"
                placeholder="Total Get"
                icon="bx bx-dollar-circle"
                value={`${ownerGetsCalculate(
                  offerStartDate,
                  offerEndDate,
                  ownerFee,
                  offerPricePerDay
                )}`}
              />
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-lg-6 col-md-6">
            <InputView
              label="Payment Type"
              icon="bx bx-money"
              placeholder="Payment Type"
              value={typeText}
            />
          </div>

          <div className="col-lg-6 col-md-6">
            <InputView
              label="Payment Number"
              icon="bx bx-dollar-circle"
              placeholder="Payment Number"
              value={recipientNumber}
            />
          </div>
        </div>

        {receivedType == "refund" && (
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <InputView
                label="Cancelation Fee"
                placeholder="Cancelation Fee"
                icon="bx bx-tag"
                value={`${refundCommission}`}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Total Paid"
                placeholder="Total To Refund"
                icon="bx bx-dollar-circle"
                value={`${moneyFormat(
                  (tenantPaymentCalculate(
                    offerStartDate,
                    offerEndDate,
                    tenantFee,
                    offerPricePerDay
                  ) *
                    (100 - refundCommission)) /
                    100
                )}`}
              />
            </div>
          </div>
        )}

        {receivedType == "refund" && status == "failed" && (
          <>
            <div
              className="alert-dismissible fade show alert alert-danger"
              role="alert"
            >
              {failedDescription}
            </div>

            <div className="add-listings-box footer-section">
              <div className="d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  className="default-btn d-flex align-items-center"
                  disabled={disabled}
                  style={{ width: "fit-content" }}
                  onClick={() => setUpdatePopupActive(true)}
                >
                  <i
                    className="bx bx-credit-card me-1"
                    style={{ fontSize: "16px" }}
                  ></i>{" "}
                  Update payment info
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {receivedType == "refund" && status == "failed" && (
        <>
          <PayedCancelModal
            modalActive={updatePopupActive}
            handleClose={() => setUpdatePopupActive(false)}
            disabled={disabled}
            setDisabled={setDisabled}
            onCancel={onPayedFastCancel}
          />
          <SuccessIconPopup
            modalActive={successIconPopupState.active}
            closeModal={successIconPopupState.onClose}
            textWeight={successIconPopupState.textWeight}
            text={successIconPopupState.text}
            mainCloseButtonText={successIconPopupState.closeButtonText}
          />
        </>
      )}
    </>
  );
};

export default EarningTable;
