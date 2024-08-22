import { useOrderActions } from "../../hooks";
import OrderActions from "../Order/OrderActions";
import STATIC from "../../static";

const OrderMessageActions = ({
  content,
  order,
  popupsData,
  type = null,
  extensionPopupsData = null,
  isExtensionActions = false,
}) => {
  let canActions = false;
  const currentActionButtons = useOrderActions({ order });

  const extension = isExtensionActions
    ? order.extendOrders.find(
        (extension) => extension.id == content.extensionId
      )
    : null;

  const extensionActionButtons = useOrderActions({ order: extension });

  if (isExtensionActions && !extension) {
    return;
  }

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
      const checkingOrder = isExtensionActions ? extension : order;

      if (
        type == STATIC.MESSAGE_TYPES.NEW_ORDER &&
        !checkingOrder.actualUpdateRequest &&
        (checkingOrder.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
          checkingOrder.status == STATIC.ORDER_STATUSES.PENDING_TENANT)
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.NEW_EXTENSION &&
        !checkingOrder.actualUpdateRequest &&
        (checkingOrder.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
          checkingOrder.status == STATIC.ORDER_STATUSES.PENDING_TENANT)
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.UPDATE_EXTENSION &&
        checkingOrder.actualUpdateRequest &&
        checkingOrder.actualUpdateRequest.id == content.requestId &&
        (checkingOrder.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
          checkingOrder.status == STATIC.ORDER_STATUSES.PENDING_TENANT)
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.ACCEPTED_EXTENSION &&
        checkingOrder.status == STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.UPDATE_ORDER &&
        checkingOrder.actualUpdateRequest &&
        checkingOrder.actualUpdateRequest.id == content.requestId &&
        (checkingOrder.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
          checkingOrder.status == STATIC.ORDER_STATUSES.PENDING_TENANT)
      ) {
        canActions = true;
      }

      if (
        (type == STATIC.MESSAGE_TYPES.TENANT_PAYED &&
          checkingOrder.status ==
            STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT) ||
        (checkingOrder.orderParentId &&
          type == STATIC.MESSAGE_TYPES.TENANT_PAYED &&
          checkingOrder.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER)
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.PENDED_TO_TENANT &&
        checkingOrder.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.FINISHED &&
        checkingOrder.status == STATIC.ORDER_STATUSES.FINISHED
      ) {
        canActions = true;
      }

      if (
        checkingOrder.status == STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT
      ) {
        if (checkingOrder?.paymentInfo?.id) {
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

  let Actions = () => (
    <OrderActions
      currentActionButtons={currentActionButtons}
      order={order}
      actionClass="message-content-action"
      needIcon={false}
      popupsData={popupsData}
      canActions={canActions}
    />
  );

  if (isExtensionActions) {
    Actions = () => (
      <OrderActions
        currentActionButtons={extensionActionButtons}
        order={extension}
        actionClass="message-content-action"
        needIcon={false}
        popupsData={extensionPopupsData}
        canActions={canActions}
      />
    );
  }

  return (
    <div
      className="d-flex flex-column"
      style={{ gap: "10px", marginTop: "10px" }}
    >
      <Actions />
    </div>
  );
};

export default OrderMessageActions;
