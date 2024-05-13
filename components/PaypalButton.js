import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import env from "../env";

const PaypalButton = ({ createOrder, onApprove, amount }) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": env.PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
        locale: "en_US",
        "disable-funding": "credit,card",
      }}
    >
      <PayPalButtons
        className="paypal-payment-buttons"
        createOrder={(data) => createOrder(data)}
        forceReRender={[amount]}
        onApprove={onApprove}
        style={{ color: "blue", disableMaxWidth: true }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
