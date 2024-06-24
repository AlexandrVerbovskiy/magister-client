import { useOrderActions } from "../../hooks";
import OrderActions from "../Order/OrderActions";

const OrderMessageActions = ({ order }) => {
  const currentActionButtons = useOrderActions({ order });

  return (
    <OrderActions
      currentActionButtons={currentActionButtons}
      order={order}
      actionClass="message-content-action"
      needIcon={false}
    />
  );
};

export default OrderMessageActions;
