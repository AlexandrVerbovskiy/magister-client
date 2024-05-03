import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { IndiceContext } from "../contexts";
import { useContext, useState } from "react";
import env from "../env";
import BaseModal from "./_App/BaseModal";

const PaypalTriggerModal = ({
  amount,
  createOrderRequest,
  approveOrderRequest,
  authToken,
  orderId,
  listingName,
  onTenantPayed,
}) => {
  const { error } = useContext(IndiceContext);
  const [modalActive, setModalActive] = useState(false);

  const onApprove = async (data) => {
    try {
      await approveOrderRequest(data.orderID, authToken);
      setModalActive(false);
      onTenantPayed();
    } catch (e) {
      error.set(e.message);
    }
  };

  const createOrder = async (data) => {
    return await createOrderRequest(amount, orderId, authToken);
  };

  return (
    <>
      <BaseModal
        active={modalActive}
        toggleActive={() => setModalActive(false)}
        needCloseBtn={true}
      >
        <span className="sub-title mb-2">
          <span>{listingName} rental payment</span>
        </span>
        <form method="get" onSubmit={(e) => e.preventDefault}>
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
              createOrder={(data) => createOrder(data)}
              forceReRender={[amount]}
              onApprove={onApprove}
              style={{ color: "blue", disableMaxWidth: true }}
            />
          </PayPalScriptProvider>
        </form>
      </BaseModal>

      <button
        className="default-btn"
        type="button"
        onClick={() => setModalActive(true)}
      >
        Pay by Paypal
      </button>
    </>
  );
};

export default PaypalTriggerModal;
