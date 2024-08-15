import React, { useContext, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import { IndiceContext } from "../contexts";
import STATIC from "../static";
import { extractDataBetweenBraces } from "../utils";

const SubmitPayment = ({ disabled, setDisabled }) => {
  const data = usePayPalCardFields();
  const { cardFieldsForm, fields } = data;
  const { error } = useContext(IndiceContext);

  async function submitHandler() {
    try {
      if (!cardFieldsForm || typeof cardFieldsForm.submit !== "function") {
        return;
      }
      setDisabled(true);
      await cardFieldsForm.submit();
    } catch (e) {
      const message = e.message;
      let info = message;

      if (message.includes(`{"name":`)) {
        let description = "Unpredictable error";
        const errorBodyStr = extractDataBetweenBraces(message);
        const errorBody = JSON.parse(errorBodyStr);

        if (errorBody) {
          description = errorBody.message;

          if (errorBody.name.toLowerCase() == "unpredictable_entity") {
            if (
              errorBody.details &&
              errorBody.details[0] &&
              errorBody.details[0].description
            ) {
              description = errorBody.details[0].description;
            }
          }
        }

        info = description;
      }

      if (message.toLowerCase() == "invalid_number") {
        info = "Invalid card number";
      }

      error.set(info);
    } finally {
      setDisabled(false);
    }
  }

  return (
    <button
      type="button"
      className="pay-by-bank-transfer-paypal-form"
      onClick={submitHandler}
      disabled={disabled}
    >
      Pay
    </button>
  );
};

const PaypalForm = ({ createOrder, onApprove, disabled, setDisabled }) => {
  const paypalFieldStyle = {
    input: {
      fontSize: "14px",
      padding: "6px 15px 6px 15px",
    },
    "input:focus": {},
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: STATIC.CURRENCY_NAME,
        intent: "capture",
        locale: "en_US",
        components: "card-fields",
      }}
    >
      <PayPalCardFieldsProvider
        createOrder={(data) =>
          createOrder(data, STATIC.PAYMENT_TYPES.CREDIT_CARD)
        }
        onApprove={onApprove}
        onError={() => {}}
      >
        <PayPalNumberField style={paypalFieldStyle} />

        <div className="paypal-payment-card">
          <PayPalExpiryField style={paypalFieldStyle} />
          <PayPalCVVField style={paypalFieldStyle} />
        </div>

        <SubmitPayment disabled={disabled} setDisabled={setDisabled} />
      </PayPalCardFieldsProvider>
    </PayPalScriptProvider>
  );
};

export default PaypalForm;
