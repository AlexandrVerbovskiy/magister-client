import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { useOrderActions } from "../../hooks";
import OrderPopups from "../Order/OrderPopups";

const OrderModals = ({
  tenantBaseCommission,
  order,
  orderPopupsData,
  bankInfo,
  onTenantPayed,
  onMakeExtend,
}) => {
  const { sessionUser } = useContext(IndiceContext);

  const currentFee =
    sessionUser.id == order.ownerId ? order.ownerFee : order.tenantFee;

  const currentActionButtons = useOrderActions({
    order,
  });

  return (
    <OrderPopups
      {...orderPopupsData}
      order={order}
      actualUpdateRequest={order.actualUpdateRequest}
      tenantBaseCommission={tenantBaseCommission}
      currentFee={currentFee}
      actionButtons={currentActionButtons}
      onTenantPayed={onTenantPayed}
      onMakeExtend={onMakeExtend}
      bankInfo={bankInfo}
    />
  );
};

export default OrderModals;
