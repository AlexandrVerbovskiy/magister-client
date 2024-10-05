import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { useOrderActions } from "../../hooks";
import OrderPopups from "../Order/OrderPopups";

const OrderModals = ({
  workerBaseCommission,
  order,
  orderPopupsData,
  bankInfo,
  onWorkerPayed = null,
}) => {
  const { sessionUser } = useContext(IndiceContext);

  const currentActionButtons = useOrderActions({
    order,
  });

  if (!order) {
    return;
  }

  const currentFee =
    sessionUser?.id == order.ownerId ? order.ownerFee : order.workerFee;

  return (
    <OrderPopups
      {...orderPopupsData}
      order={order}
      actualUpdateRequest={order?.actualUpdateRequest}
      workerBaseCommission={workerBaseCommission}
      currentFee={currentFee}
      actionButtons={currentActionButtons}
      onWorkerPayed={onWorkerPayed}
      bankInfo={bankInfo}
    />
  );
};

export default OrderModals;
