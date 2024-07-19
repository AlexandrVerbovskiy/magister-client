import { useContext } from "react";
import { useOrderActions } from "../../hooks";
import OrderActions from "../Order/OrderActions";
import { IndiceContext } from "../../contexts";
import STATIC from "../../static";

const OrderMessageActions = ({
  content,
  order,
  popupsData,
  senderId,
  type = null,
}) => {
  let canActions = false;
  const { sessionUser } = useContext(IndiceContext);
  const currentActionButtons = useOrderActions({ order });

  const isOwner = sessionUser.id == order.ownerId;
  const isTenant = sessionUser.id == order.tenantId;

  if (order.disputeStatus) {
    if (
      [
        STATIC.MESSAGE_TYPES.STARTED_DISPUTE,
        STATIC.MESSAGE_TYPES.RESOLVED_DISPUTE,
      ].includes(type) &&
      order.disputeChatId
    ) {
      canActions = true;
    }
  } else {
    if (order.cancelStatus) {
      if (
        order.cancelStatus ==
        STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE
      ) {
        canActions = true;
      }

      if (
        order.cancelStatus ==
        STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE
      ) {
        canActions = true;
      }
    } else {
      if (
        type == STATIC.MESSAGE_TYPES.NEW_ORDER &&
        !order.actualUpdateRequest &&
        (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
          order.status == STATIC.ORDER_STATUSES.PENDING_TENANT)
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.UPDATE_ORDER &&
        order.actualUpdateRequest &&
        order.actualUpdateRequest.id == content.requestId &&
        (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
          order.status == STATIC.ORDER_STATUSES.PENDING_TENANT)
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.TENANT_PAYED &&
        order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.PENDED_TO_TENANT &&
        order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.FINISHED &&
        order.status == STATIC.ORDER_STATUSES.FINISHED
      ) {
        canActions = true;
      }

      if (order.status == STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT) {
        if (order?.paymentInfo?.id) {
          if (type == STATIC.MESSAGE_TYPES.TENANT_PAYED_WAITING) {
            canActions = true;
          }
        } else {
          if (type == STATIC.MESSAGE_TYPES.ACCEPTED_ORDER) {
            canActions = true;
          }
        }
      }
    }
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
        canActions={canActions}
      />
    </div>
  );
};

export default OrderMessageActions;
