import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { IndiceContext } from "../contexts";
import { useContext } from "react";
import env from "../env";

const PaypalModal = ({
  amount,
  createOrderRequest,
  approveOrderRequest,
  authToken,
}) => {
  const { success, error } = useContext(IndiceContext);

  const onApprove = async (data) => {
    console.log("authToken: ", authToken);

    await approveOrderRequest(data.orderID, authToken);
    success.set("Operation successful");
    //onComplete();
  };

  const createOrder = async (data, authToken) => {
    return await createOrderRequest(amount, authToken);
  };

  return (
    <div className="row stripe-payment-form mb-3">
      <div className="col-12">
        <PayPalScriptProvider
          options={{
            "client-id": env.PAYPAL_CLIENT_ID,
            currency: "USD",
            intent: "capture",
            locale: "en_US",
          }}
        >
          <PayPalButtons
            className="paypal-payment-buttons"
            createOrder={(data) => createOrder(data, authToken)}
            forceReRender={[amount]}
            onApprove={onApprove}
            style={{ color: "blue", disableMaxWidth: true }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default PaypalModal;
