import { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../../contexts";
import BaseModal from "../_App/BaseModal";
import ErrorSpan from "../ErrorSpan";
import {
  cardFormat,
  isPayedUsedPaypal,
  validateCardNumber,
  validateSmallText,
} from "../../utils";
import STATIC from "../../static";

const PayedCancelModal = ({
  modalActive,
  handleClose,
  disabled,
  setDisabled,
  handleCancel,
}) => {
  const { error, sessionUser } = useContext(IndiceContext);
  const [type, setType] = useState(STATIC.PAYMENT_TYPES.PAYPAL);

  const [paypalId, setPaypalId] = useState("");
  const [paypalIdError, setPaypalIdError] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberError, setCardNumberError] = useState(null);

  useEffect(() => {
    setPaypalId(sessionUser?.paypalId ?? "");
  }, [sessionUser?.paypalId]);

  const handleAcceptCancelOrder = async () => {
    if (disabled) {
      return;
    }

    let hasError = false;

    if (isPayedUsedPaypal(type)) {
      if (!paypalId) {
        setPaypalIdError("Required field!");
        hasError = true;
      }

      if (validateSmallText(paypalId) !== true) {
        setPaypalIdError(validateSmallText(paypalId));
        hasError = true;
      }
    } else {
      if (!cardNumber) {
        setCardNumberError("Required field!");
        hasError = true;
      }

      if (validateCardNumber(cardNumber) !== true) {
        setCardNumberError(validateCardNumber(cardNumber));
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    try {
      await handleCancel({
        type: type.trim(),
        paypalId: paypalId.trim(),
        cardNumber: cardNumber.trim(),
      });
      setDisabled(true);
      handleClose();
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  const handleInputCardNumber = (e) => {
    const newValue = e.target.value.replaceAll(" ", "");

    if (newValue.length > 16) {
      return;
    }

    setCardNumber(newValue);
    setCardNumberError(null);
  };

  const handleInputPaypal = (e) => {
    setPaypalId(e.target.value);
    setPaypalIdError(null);
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
      <span className="sub-title mb-2" style={{ fontSize: "18px" }}>
        <span>Where do you want a refund?</span>
      </span>

      <form method="get" onSubmit={(e) => e.preventDefault()}>
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
                onChange={() => handleChangeType(STATIC.PAYMENT_TYPES.PAYPAL)}
                checked={type === STATIC.PAYMENT_TYPES.PAYPAL}
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
                onChange={() =>
                  handleChangeType(STATIC.PAYMENT_TYPES.BANK_TRANSFER)
                }
                checked={type === STATIC.PAYMENT_TYPES.BANK_TRANSFER}
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
          </div>
        </div>

        {type == STATIC.PAYMENT_TYPES.PAYPAL && (
          <div className={`form-group`}>
            <label>Paypal ID</label>
            <input
              name="paypal-id"
              value={paypalId}
              onInput={handleInputPaypal}
              type="text"
              placeholder="Paypal ID"
              className={`form-control ${paypalIdError ? "is-invalid" : ""}`}
            />
            <ErrorSpan error={paypalIdError} />
          </div>
        )}

        {type == STATIC.PAYMENT_TYPES.BANK_TRANSFER && (
          <div className={`form-group`}>
            <label>Bank Transfer</label>
            <input
              name="card-number"
              value={cardFormat(cardNumber)}
              onInput={handleInputCardNumber}
              type="text"
              placeholder="Card Number"
              className={`form-control ${cardNumberError ? "is-invalid" : ""}`}
            />
            <ErrorSpan error={cardNumberError} />
          </div>
        )}

        <div className="d-flex gap-2">
          <button type="button" className="button-danger" onClick={handleClose}>
            Close
          </button>
          <button type="button" onClick={handleAcceptCancelOrder}>
            Cancel booking
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default PayedCancelModal;
