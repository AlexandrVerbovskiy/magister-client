import { useOrderActions } from "../../hooks";
import OrderActions from "../Order/OrderActions";
import STATIC from "../../static";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";

const OrderMessageActions = ({ content, order, popupsData, type = null }) => {
  const { sessionUser } = useContext(IndiceContext);
  const currentActionButtons = useOrderActions({ order });

  let canActions = false;

  const isOwner = sessionUser.id == order.ownerId;
  const isTenant = sessionUser.id == order.tenantId;

  if (!order.disputeStatus) {
    if (order.cancelStatus) {
      if (
        isOwner &&
        order.cancelStatus ==
          STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE
      ) {
        canActions = true;
      }

      if (
        isTenant &&
        order.cancelStatus ==
          STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE
      ) {
        canActions = true;
      }
    } else {
      if (
        type == STATIC.MESSAGE_TYPES.NEW_ORDER &&
        !order.actualUpdateRequest &&
        ((isOwner && order.status == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
          (isTenant && order.status == STATIC.ORDER_STATUSES.PENDING_TENANT))
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.UPDATE_ORDER &&
        order.actualUpdateRequest.id == content.requestId &&
        ((isOwner && order.status == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
          (isTenant && order.status == STATIC.ORDER_STATUSES.PENDING_TENANT))
      ) {
        canActions = true;
      }
    }
  }

  return (
    <OrderActions
      currentActionButtons={currentActionButtons}
      order={order}
      actionClass="message-content-action"
      needIcon={false}
      popupsData={popupsData}
      canActions={canActions}
    />
  );
};

export default OrderMessageActions;
