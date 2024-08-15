import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import STATIC from "../static";

const PaypalButton = ({ createOrder, onApprove, amount, orderId }) => {

  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: STATIC.CURRENCY_NAME,
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
        onError={() => {}}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
