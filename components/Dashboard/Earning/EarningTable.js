import React from "react";
import InputView from "../../FormComponents/InputView";
import {
  moneyFormat,
  ownerEarnCalculate,
  renterPaysCalculate,
  dateConverter,
  getPaymentNameByType,
  isPayedUsedPaypal,
  recipientStatuses,
  getPriceByDays,
} from "../../../utils";
import STATIC from "../../../static";

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
  offerFinishDate,
  offerPrice,
  renterFee,
  ownerFee,
  orderId,
  id,
  plannedTime,
  orderStatus,
}) => {
  let typeText = "Unknown";
  let recipientNumber = "-";

  if (data) {
    typeText = getPaymentNameByType(type);

    if (isPayedUsedPaypal(type)) {
      recipientNumber = data.paypalId;
    } else {
      recipientNumber = data.cardNumber;
    }
  }

  let operationMessageClasses = "status-background-orange";
  let operationMessage = "Operation waiting admin approve";

  if (status == "failed") {
    operationMessageClasses = "status-background-red";
    operationMessage = "Operation mark as failed";
  }

  if (status == "completed") {
    operationMessageClasses = "status-background-green";
    operationMessage = "Operation mark as finished";
  }

  if (status == "cancelled") {
    operationMessageClasses = "status-background-gray";
    operationMessage = "Operation mark as cancelled";
  }

  if (receivedType === STATIC.RECIPIENT_PAYMENT_TYPES.RECIPIENT) {
    operationMessage = recipientStatuses({
      status: status,
      plannedTime: plannedTime,
      admin: true,
      failedDescription: failedDescription,
      orderStatus: orderStatus,
    });
  }

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
              value={dateConverter(offerFinishDate)}
              icon="bx bx-calendar"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-6">
            <InputView
              label="Offer Price"
              placeholder="Offer Price"
              icon="bx bx-dollar-circle"
              value={`${moneyFormat(offerPrice)}`}
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
                value={`${renterFee}`}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Total Paid"
                placeholder="Total Paid"
                icon="bx bx-dollar-circle"
                value={`${renterPaysCalculate(
                  getPriceByDays(offerPrice, offerStartDate, offerFinishDate),
                  renterFee
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
                value={`${ownerEarnCalculate(
                  getPriceByDays(offerPrice, offerStartDate, offerFinishDate),
                  ownerFee
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
                  (renterPaysCalculate(offerPrice, renterFee) *
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
          </>
        )}

        <div className="row">
          <div className="col-12">
            <div
              style={{ paddingRight: "15px", paddingLeft: "15px" }}
              className={`d-flex align-items-center form-control bookings-status order-item-status mb-4 ${operationMessageClasses}`}
            >
              {operationMessage}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EarningTable;
