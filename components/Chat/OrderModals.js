import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { useOrderActions } from "../../hooks";
import OrderPopups from "../Order/OrderPopups";

const OrderModals = ({
  tenantBaseCommission,
  order,
  setOrder,
  orderPopupsData,
  bankInfo,
}) => {
  const { sessionUser } = useContext(IndiceContext);

  const currentFee =
    sessionUser.id == order.ownerId ? order.ownerFee : order.tenantFee;

  const currentActionButtons = useOrderActions({
    order,
  });

  const onMakeExtend = ({ price, fromDate, toDate }) => {
    orderPopupsData.setExtendPopupActive(false);
    orderPopupsData.setExtendApproveData({
      price,
      fromDate,
      toDate,
    });
  };

  const onTenantPayed = () => {
    setTimeout(() => {
      setOrder({
        status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
      });
    }, 100);
  };

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
