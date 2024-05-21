import { IndiceContext } from "../contexts";
import { useContext, useState } from "react";
import BaseModal from "./_App/BaseModal";
import { getDaysDifference, moneyFormat, timeNormalConverter } from "../utils";
import PaypalButton from "./PaypalButton";
import PaypalForm from "./PaypalForm";
import { paypalCreateOrder, paypalOrderPayed } from "../services";
import Link from "next/link";

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
  needAutoClose = true,
}) => {
  const { error } = useContext(IndiceContext);
  const [type, setType] = useState("paypal");
  const [disabled, setDisabled] = useState(false);

  const onApprove = async (data) => {
    try {
      await paypalOrderPayed(data.orderID, authToken);
      onTenantPayed();

      if (needAutoClose) {
        setTimeout(closeModal(), 100);
      }
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
      className="modal-padding-bottom-20"
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
            <b>
              Total to pay: ${moneyFormat((subtotal * (100 + offerFee)) / 100)}
            </b>
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
                  onChange={() => handleChangeType("paypal")}
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
                  onChange={() => handleChangeType("card")}
                  checked={type === "card"}
                />
                <label
                  style={{
                    marginBottom: 0,
                    display: "inline",
                  }}
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
                  onChange={() => handleChangeType("bank-transfer")}
                  checked={type === "bank-transfer"}
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

          <div
            style={
              type == "card"
                ? { height: "120px", overflow: "hidden" }
                : { height: "50px" }
            }
          >
            {type == "paypal" && amount && orderId && authToken && (
              <PaypalButton
                createOrder={createOrder}
                onApprove={onApprove}
                amount={amount}
                orderId={orderId}
              />
            )}

            {type == "card" && amount && orderId && authToken && (
              <PaypalForm
                disabled={disabled}
                setDisabled={setDisabled}
                createOrder={createOrder}
                onApprove={onApprove}
              />
            )}

            {type == "bank-transfer" && (
              <div className="payment-form">
                <Link
                  className="pay-by-credit-card-link"
                  href={"/dashboard/pay-by-credit-card/" + orderId}
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
