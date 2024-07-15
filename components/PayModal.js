import { IndiceContext } from "../contexts";
import { useContext, useEffect, useState } from "react";
import BaseModal from "./_App/BaseModal";
import { getFactOrderDays, moneyFormat, dateConverter } from "../utils";
import PaypalButton from "./PaypalButton";
import PaypalForm from "./PaypalForm";
import { paypalCreateOrder, paypalOrderPayed } from "../services";
import Link from "next/link";
import STATIC from "../static";

const getPaymentFormStyles = (type) => {
  switch (type) {
    case STATIC.PAYMENT_TYPES.CREDIT_CARD:
      return { height: "140px", overflow: "hidden" };
    case STATIC.PAYMENT_TYPES.PAYPAL:
      return { height: "50px" };
    default: {
    }
  }
};

const PayModal = ({
  amount,
  orderId,
  listingName,
  onTenantPayed,
  pricePerDay,
  offerStartDate,
  offerEndDate,
  offerFee,
  modalActive,
  closeModal,
  authToken,
  bankInfo,
}) => {
  const { error } = useContext(IndiceContext);
  const [type, setType] = useState(STATIC.PAYMENT_TYPES.PAYPAL);
  const [disabled, setDisabled] = useState(false);

  const onApprove = async (data) => {
    try {
      const result = await paypalOrderPayed(
        { orderId: data.orderID, type },
        authToken
      );

      setTimeout(() => {
        onTenantPayed(result);
        closeModal();
      }, 100);
    } catch (e) {
      error.set(e.message);
    }
  };

  const createOrder = async (data) => {
    try {
      return await paypalCreateOrder(amount, orderId, authToken);
    } catch (e) {
      error.set(e.message);
    }
  };

  const durationInfo =
    dateConverter(offerStartDate) === dateConverter(offerEndDate)
      ? dateConverter(offerStartDate)
      : `${dateConverter(offerStartDate)} - ${dateConverter(offerEndDate)}`;

  const subtotal = pricePerDay * getFactOrderDays(offerStartDate, offerEndDate);

  const total = (subtotal * (100 + offerFee)) / 100;

  const handleClose = () => {
    if (disabled) {
      return;
    }

    closeModal();
  };

  const handleChangeType = (type) => {
    if (disabled) {
      return;
    }

    setType(type);
  };

  return (
    <BaseModal
      active={modalActive}
      closeModal={handleClose}
      needCloseBtn={true}
      className="modal-padding-bottom-20 modal-margin-bottom-20"
    >
      <div className="card card-shadow">
        <div className="card-body">
          <span className="sub-title mb-2" style={{ fontSize: "18px" }}>
            <span>Rental payment</span>
          </span>
          <div className="form-group">Listing: {listingName}</div>
          <div className="form-group">
            Price per day: ${moneyFormat(pricePerDay)}
          </div>
          <div className="form-group">Duration: {durationInfo}</div>
          <div className="form-group">Subtotal: ${moneyFormat(subtotal)}</div>
          <div className="form-group">Fee: {offerFee}% </div>
          <div className="form-group">
            <b>Total to pay: ${moneyFormat(total)}</b>
          </div>
        </div>
      </div>

      <div className="card mt-4 card-shadow">
        <div className="card-body">
          <div
            className="payment-box"
            style={{
              marginBottom: "15px",
              backgroundColor: "transparent",
              boxShadow: "none",
              marginTop: 0,
              padding: 0,
            }}
          >
            <div className="payment-method">
              <p
                style={{
                  marginBottom: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="radio"
                  id="paypal-radio"
                  name="radio-group"
                  checked={type === STATIC.PAYMENT_TYPES.PAYPAL}
                  readOnly={true}
                />
                <label
                  style={{
                    marginBottom: 0,
                    display: "inline",
                  }}
                  onClick={() => handleChangeType(STATIC.PAYMENT_TYPES.PAYPAL)}
                  htmlFor="paypal-radio"
                >
                  PayPal
                </label>
              </p>

              <p
                style={{
                  marginBottom: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="radio"
                  id="bank-card-radio"
                  name="radio-group"
                  checked={type === STATIC.PAYMENT_TYPES.CREDIT_CARD}
                  readOnly={true}
                />
                <label
                  style={{
                    marginBottom: 0,
                    display: "inline",
                  }}
                  onClick={() =>
                    handleChangeType(STATIC.PAYMENT_TYPES.CREDIT_CARD)
                  }
                  htmlFor="bank-card-radio"
                >
                  Bank Card
                </label>
              </p>

              <p
                style={{
                  marginBottom: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="radio"
                  id="direct-bank-transfer-radio"
                  name="radio-group"
                  checked={type === STATIC.PAYMENT_TYPES.BANK_TRANSFER}
                  readOnly={true}
                />
                <label
                  style={{
                    marginBottom: 0,
                    display: "inline",
                  }}
                  onClick={() =>
                    handleChangeType(STATIC.PAYMENT_TYPES.BANK_TRANSFER)
                  }
                  htmlFor="direct-bank-transfer-radio"
                >
                  Direct Bank Transfer
                </label>
              </p>
            </div>
          </div>

          <div
            className="paypal-payment-form"
            style={getPaymentFormStyles(type)}
          >
            {type == STATIC.PAYMENT_TYPES.PAYPAL &&
              amount &&
              orderId &&
              authToken && (
                <PaypalButton
                  createOrder={createOrder}
                  onApprove={onApprove}
                  amount={amount}
                  orderId={orderId}
                />
              )}

            {type == STATIC.PAYMENT_TYPES.CREDIT_CARD &&
              amount &&
              orderId &&
              authToken && (
                <PaypalForm
                  disabled={disabled}
                  setDisabled={setDisabled}
                  createOrder={createOrder}
                  onApprove={onApprove}
                />
              )}

            {type == STATIC.PAYMENT_TYPES.BANK_TRANSFER && (
              <div className="payment-form">
                <div className="earnings-box" style={{ marginBottom: "0" }}>
                  <h3
                    className="d-flex align-items-center justify-content-between"
                    style={{
                      padding: "0 0 20px",
                      marginLeft: "0",
                      marginRight: "0",
                      marginBottom: "0",
                      marginTop: "0",
                    }}
                  >
                    Bank Details{" "}
                  </h3>
                  <ul>
                    <li
                      style={{
                        padding: "10px 0",
                        background: "white",
                        borderBottom: "0",
                        color: "black",
                        borderTop: "1px solid rgb(204, 204, 204)",
                      }}
                    >
                      <b>Booking:</b> #{orderId}
                    </li>

                    <li
                      style={{
                        padding: "10px 0",
                        background: "white",
                        borderBottom: "0",
                        color: "black",
                      }}
                    >
                      <b>Sort Code: </b>
                      {bankInfo?.bankAccountReferenceConceptCode ?? ""}
                    </li>

                    <li
                      style={{
                        padding: "10px 0",
                        background: "white",
                        borderBottom: "0",
                        color: "black",
                      }}
                    >
                      <b>Account No: </b>
                      {bankInfo?.bankAccountBeneficiary ?? ""}
                    </li>

                    <li
                      style={{
                        padding: "10px 0",
                        background: "white",
                        borderBottom: "0",
                        color: "black",
                      }}
                    >
                      <b>IBAN: </b>
                      {bankInfo?.bankAccountIban ?? ""}
                      {}
                    </li>
                    <li
                      style={{
                        padding: "10px 0",
                        background: "white",
                        borderBottom: "0",
                        color: "black",
                      }}
                    >
                      <b>BIC: </b>
                      {bankInfo?.bankAccountSwiftBic ?? ""}
                      {}
                    </li>

                    <li
                      style={{
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
                      <span className="pay-by-card-price">${total}</span>
                    </li>
                  </ul>
                </div>

                <Link
                  className="pay-by-bank-transfer-link"
                  href={"/dashboard/pay-by-bank-transfer/" + orderId}
                  type="button"
                >
                  Attach Confirmation
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default PayModal;
