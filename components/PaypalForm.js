import React, { useContext, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import env from "../env";
import { IndiceContext } from "../contexts";

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
        const startIndex = message.indexOf('{"name":');
        const endIndex = message.lastIndexOf("}");

        if (endIndex != -1 && startIndex != -1) {
          const extractedData = message
            .substring(startIndex, endIndex + 1)
            .trim();
          const obj = JSON.parse(extractedData);
          const description = obj?.details[0]?.description ?? obj.message;

          if (description) {
            info = description;
          }
        }

        if (info.toLowerCase() == "INVALID_NUMBER") {
          info = "Invalid card number";
        }
      }

      error.set(info);
    } finally {
      setDisabled(false);
    }
  }

  return (
    <button
      type="button"
      className="pay-by-credit-card-paypal-form"
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
      padding: "2px 15px 2px 15px",
    },
    "input:focus": {},
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": env.PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
        locale: "en_US",
        components: "card-fields",
      }}
    >
      <PayPalCardFieldsProvider createOrder={createOrder} onApprove={onApprove}>
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
