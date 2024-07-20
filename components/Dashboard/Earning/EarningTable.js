import React from "react";
import InputView from "../../FormComponents/InputView";
import {
  calculateTotalPriceByDaysCount,
  getFactOrderDays,
  moneyFormat,
  ownerGetsCalculate,
  tenantPaymentCalculate,
  dateConverter,
  getPaymentNameByType,
  isPayedUsedPaypal,
} from "../../../utils";

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
                getFactOrderDays(offerStartDate, offerEndDate),
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
          </>
        )}
      </div>
    </>
  );
};

export default EarningTable;
