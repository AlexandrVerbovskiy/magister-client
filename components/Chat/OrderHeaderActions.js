import { useOrderActions } from "../../hooks";
import OrderActions from "../Order/OrderActions";

const OrderHeaderActions = ({ order, popupsData }) => {
  const currentActionButtons = useOrderActions({ order });

  return (
    <OrderActions
      currentActionButtons={currentActionButtons}
      order={order}
      actionClass="dropdown-item d-flex align-items-center"
      popupsData={popupsData}
    />
  );
};

export default OrderHeaderActions;
