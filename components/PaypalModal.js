import { IndiceContext } from "../contexts";
import { useContext, useState } from "react";
import BaseModal from "./_App/BaseModal";
import { getDaysDifference, moneyFormat, timeNormalConverter } from "../utils";
import PaypalButton from "./PaypalButton";
import PaypalForm from "./PaypalForm";
import { paypalCreateOrder, paypalOrderPayed } from "../services";

const PaypalModal = ({
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
}) => {
  const { error } = useContext(IndiceContext);
  const [type, setType] = useState("paypal");

  const onApprove = async (data) => {
    try {
      await paypalOrderPayed(data.orderID, authToken);
      closeModal();
      onTenantPayed();
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
    timeNormalConverter(offerStartDate) === timeNormalConverter(offerEndDate)
      ? timeNormalConverter(offerStartDate)
      : `${timeNormalConverter(offerStartDate)} - ${timeNormalConverter(
          offerEndDate
        )}`;

  const subtotal =
    pricePerDay * getDaysDifference(offerStartDate, offerEndDate);

  const handleChangeType = (type) => {
    setType(type);
  };

  return (
    <BaseModal
      active={modalActive}
      closeModal={closeModal}
      needCloseBtn={true}
      className="modal-padding-bottom-20"
    >
      <span className="sub-title mb-2" style={{ fontSize: "18px" }}>
        <span>Rental payment</span>
      </span>
      <form method="get" onSubmit={(e) => e.preventDefault}>
        <div className="form-group">Listing: {listingName}</div>
        <div className="form-group">
          Price per day: ${moneyFormat(pricePerDay)}
        </div>
        <div className="form-group">Duration: {durationInfo}</div>
        <div className="form-group">Subtotal: ${moneyFormat(subtotal)}</div>
        <div className="form-group">Fee: {offerFee}% </div>
        <div className="form-group">
          <b>
            Total to pay: ${moneyFormat((subtotal * (100 + offerFee)) / 100)}
          </b>
        </div>

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
              style={{ marginBottom: 0, display: "flex", alignItems: "center" }}
            >
              <input
                type="radio"
                id="paypal-radio"
                name="radio-group"
                onChange={() => setType("paypal")}
                checked={type === "paypal"}
              />
              <label
                style={{
                  marginBottom: 0,
                  display: "inline",
                }}
                htmlFor="paypal-radio"
              >
                PayPal
              </label>
            </p>

            <p
              style={{ marginBottom: 0, display: "flex", alignItems: "center" }}
            >
              <input
                type="radio"
                id="direct-bank-transfer-radio"
                name="radio-group"
                onChange={() => setType("card")}
                checked={type === "card"}
              />
              <label
                style={{
                  marginBottom: 0,
                  display: "inline",
                }}
                htmlFor="direct-bank-transfer-radio"
              >
                Direct Bank Transfer
              </label>
            </p>
          </div>
        </div>

        {type == "paypal" && amount && orderId && authToken && (
          <PaypalButton
            createOrder={createOrder}
            onApprove={onApprove}
            amount={amount}
            orderId={orderId}
          />
        )}

        {type == "card" && (
          <div className="payment-form">
            {amount && orderId && authToken && (
              <PaypalForm
                createOrder={createOrder}
                onApprove={onApprove}
                amount={amount}
                orderId={orderId}
              />
            )}
          </div>
        )}
      </form>
    </BaseModal>
  );
};

export default PaypalModal;
