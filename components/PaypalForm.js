import React, { useContext } from "react";
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

const SubmitPayment = () => {
  const data = usePayPalCardFields();
  const { cardFieldsForm, fields } = data;
  const { error } = useContext(IndiceContext);

  async function submitHandler() {
    try {
      if (!cardFieldsForm || typeof cardFieldsForm.submit !== "function")
        return;
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
      }

      error.set(info);
    }
  }

  return (
    <button type="button" onClick={submitHandler}>
      Pay
    </button>
  );
};

const PaypalForm = ({ createOrder, onApprove }) => {
  const paypalFieldStyle = {
    input: { fontSize: "14px", padding: "2px 15px 2px 15px" },
    "input:focus": {},
  };

  const onError = (err) => {
    const newIngp = JSON.parse(err);
    console.log("PayPal Error:", newIngp);
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
      <PayPalCardFieldsProvider
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
      >
        <PayPalNumberField style={paypalFieldStyle} />

        <div className="paypal-payment-card">
          <PayPalExpiryField style={paypalFieldStyle} />
          <PayPalCVVField style={paypalFieldStyle} />
        </div>

        <SubmitPayment />
      </PayPalCardFieldsProvider>
    </PayPalScriptProvider>
  );
};

export default PaypalForm;
