import { useContext } from "react";
import { useOrderActions } from "../../hooks";
import OrderActions from "../Order/OrderActions";
import { IndiceContext } from "../../contexts";

const OrderMessageActions = ({ order, popupsData, senderId }) => {
  const currentActionButtons = useOrderActions({ order });
  const { sessionUser } = useContext(IndiceContext);

  if (sessionUser?.id !== senderId) {
    return <></>;
  }

  return (
    <div
      className="d-flex flex-column"
      style={{ gap: "10px", marginTop: "10px" }}
    >
      <OrderActions
        currentActionButtons={currentActionButtons}
        order={order}
        actionClass="message-content-action"
        needIcon={false}
        popupsData={popupsData}
      />
    </div>
  );
};

export default OrderMessageActions;
