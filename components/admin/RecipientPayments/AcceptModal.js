import { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../../../contexts";
import ModalBlank from "../../../components/admin/ModalBlank";
import STATIC from "../../../static";
import Input from "../Form/Input";
import {
  cardFormat,
  isPayedUsedPaypal,
  validateCardNumber,
  validateSmallText,
} from "../../../utils";

const AcceptModal = ({
  active,
  close,
  onAcceptClick,
  defaultPaypalId = "",
}) => {
  const { error, success } = useContext(IndiceContext);
  const [disabled, setDisabled] = useState(false);
  const [type, setType] = useState(STATIC.PAYMENT_TYPES.PAYPAL);
  const [paypalId, setPaypalId] = useState("");
  const [paypalIdError, setPaypalIdError] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberError, setCardNumberError] = useState(null);

  useEffect(() => {
    setPaypalId(defaultPaypalId);
  }, [defaultPaypalId]);

  const handleAccept = async () => {
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
      setDisabled(true);

      await onAcceptClick({
        type: type.trim(),
        paypalId: paypalId.trim(),
        cardNumber: cardNumber.trim(),
      });

      success.set("Marking as completed finished successfully");
      close();
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  const handleInputCardNumber = (value) => {
    const newValue = value.replaceAll(" ", "");

    if (newValue.length > 16) {
      return;
    }

    setCardNumber(newValue);
  };

  const handleChangeType = (type) => {
    if (disabled) {
      return;
    }

    setType(type);
  };

  return (
    <ModalBlank id="danger-modal" modalOpen={active} setModalOpen={close}>
      <div className="p-5 flex space-x-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-green-100 dark:bg-green-500/30">
          <svg
            className="w-4 h-4 shrink-0 fill-current text-green-500"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
          </svg>
        </div>

        <div className="w-full">
          <div>
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Accept action{" "}
            </div>
          </div>
          <div className="text-sm mb-2">
            <div className="space-y-2">
              <p>Are you sure you want to mark the payment as completed?</p>
            </div>
          </div>

          <div
            className="text-sm my-4 border-y border-slate-200 pt-2 pb-4"
            style={{ marginLeft: "calc(-40px - 1rem)" }}
          >
            <div
              className="payment-box"
              style={{
                backgroundColor: "transparent",
                boxShadow: "none",
                marginTop: 0,
                padding: 0,
              }}
            >
              <div className="payment-method">
                <label className="block text-sm font-medium mb-1">
                  Transfer Type
                </label>
                <ul>
                  {[
                    { value: STATIC.PAYMENT_TYPES.PAYPAL, label: "PayPal" },
                    {
                      value: STATIC.PAYMENT_TYPES.BANK_TRANSFER,
                      label: "Bank Card",
                    },
                  ].map((option) => (
                    <li className="mb-1" key={option.value}>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="accept-type"
                          className="form-radio cursor-pointer"
                          value={option.value}
                          checked={type == option.value}
                          onChange={() => handleChangeType(option.value)}
                        />
                        <span className="text-sm font-medium ml-2">
                          {option.label}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {type == STATIC.PAYMENT_TYPES.PAYPAL && (
              <Input
                name="paypal-id"
                label={`Paypal ID`}
                placeholder="Paypal ID"
                labelClassName="block text-sm font-medium mb-1 mt-0-important"
                value={paypalId}
                setValue={setPaypalId}
                error={paypalIdError}
                setError={setPaypalIdError}
                inputClassName="form-input w-full"
              />
            )}

            {type == STATIC.PAYMENT_TYPES.BANK_TRANSFER && (
              <Input
                name="card-number"
                label={`Bank Transfer`}
                placeholder="Card Number"
                labelClassName="block text-sm font-medium mb-1 mt-0-important"
                value={cardFormat(cardNumber)}
                setValue={handleInputCardNumber}
                error={cardNumberError}
                setError={setCardNumberError}
                inputClassName="form-input w-full"
              />
            )}
          </div>

          <div style={{ marginLeft: "calc(-40px - 1rem)" }}>
            <b>WARNING!</b> This operation does not transfer funds. You are only
            confirming that the money has been transferred to the user!
          </div>

          <div className="flex flex-wrap justify-end space-x-2">
            <button
              disabled={disabled}
              className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            >
              Cancel
            </button>
            <button
              className="btn bg-green-500 hover:bg-green-600 text-white"
              disabled={disabled}
              onClick={handleAccept}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
};

export default AcceptModal;
