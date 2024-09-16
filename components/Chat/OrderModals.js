import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { useOrderActions } from "../../hooks";
import OrderPopups from "../Order/OrderPopups";

const OrderModals = ({
  tenantBaseCommission,
  order,
  orderPopupsData,
  bankInfo,
  onTenantPayed = null,
}) => {
  const { sessionUser } = useContext(IndiceContext);

  const currentActionButtons = useOrderActions({
    order,
  });

  if (!order) {
    return;
  }

  const currentFee =
    sessionUser?.id == order.ownerId ? order.ownerFee : order.tenantFee;

  return (
    <OrderPopups
      {...orderPopupsData}
      order={order}
      actualUpdateRequest={order?.actualUpdateRequest}
      tenantBaseCommission={tenantBaseCommission}
      currentFee={currentFee}
      actionButtons={currentActionButtons}
      onTenantPayed={onTenantPayed}
      bankInfo={bankInfo}
    />
  );
};

export default OrderModals;
