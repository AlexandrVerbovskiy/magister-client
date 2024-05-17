import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import env from "../env";

const PaypalButton = ({ createOrder, onApprove, amount, orderId }) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": env.PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
        locale: "en_US",
        "disable-funding": "credit,card",
        components: "buttons",
      }}
    >
      <PayPalButtons
        className="paypal-payment-buttons"
        createOrder={(data) => createOrder(data)}
        forceReRender={[amount, orderId]}
        onApprove={onApprove}
        style={{ color: "blue", disableMaxWidth: true }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
