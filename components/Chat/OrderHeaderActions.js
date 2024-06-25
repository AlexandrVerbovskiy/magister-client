import { useOrderActions } from "../../hooks";
import OrderActions from "../Order/OrderActions";

const OrderHeaderActions = ({ order }) => {
  const currentActionButtons = useOrderActions({ order });

  return (
    <OrderActions
      currentActionButtons={currentActionButtons}
      order={order}
      actionClass="dropdown-item d-flex align-items-center"
    />
  );
};

export default OrderHeaderActions;
