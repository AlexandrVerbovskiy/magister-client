import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { useOrderActions } from "../../hooks";
import OrderPopups from "../Order/OrderPopups";

const OrderModals = ({
  renterBaseCommission,
  order,
  orderPopupsData,
  bankInfo,
  onRenterPayed = null,
}) => {
  const { sessionUser } = useContext(IndiceContext);

  const currentActionButtons = useOrderActions({
    order,
  });

  if (!order) {
    return;
  }

  const currentFee =
    sessionUser?.id == order.ownerId ? order.ownerFee : order.renterFee;

  return (
    <OrderPopups
      {...orderPopupsData}
      order={order}
      actualUpdateRequest={order?.actualUpdateRequest}
      renterBaseCommission={renterBaseCommission}
      currentFee={currentFee}
      actionButtons={currentActionButtons}
      onRenterPayed={onRenterPayed}
      bankInfo={bankInfo}
    />
  );
};

export default OrderModals;
