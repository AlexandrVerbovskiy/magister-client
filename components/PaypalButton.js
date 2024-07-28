import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import env from "../env";
import STATIC from "../static";

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
        createOrder={(data) => createOrder(data, STATIC.PAYMENT_TYPES.PAYPAL)}
        forceReRender={[amount, orderId]}
        onApprove={onApprove}
        style={{ color: "blue", disableMaxWidth: true }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
