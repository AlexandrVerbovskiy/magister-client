import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import env from "../env";

const SubmitPayment = () => {
  const data = usePayPalCardFields();
  const { cardFieldsForm, fields } = data;

  function submitHandler() {
    if (!cardFieldsForm || typeof cardFieldsForm.submit !== "function") return;
    cardFieldsForm.submit();
  }

  return (
    <button type="button" onClick={submitHandler}>
      Pay
    </button>
  );
};

const PaypalForm = ({ createOrder, onApprove, amount }) => {
  const paypalFieldStyle = {
    input: { fontSize: "14px", padding: "2px 15px 2px 15px" },
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

        <SubmitPayment />
      </PayPalCardFieldsProvider>
    </PayPalScriptProvider>
  );
};

export default PaypalForm;
