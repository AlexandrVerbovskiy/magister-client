import { useOrderActions } from "../../hooks";
import OrderActions from "../Order/OrderActions";
import STATIC from "../../static";

const OrderMessageActions = ({ content, order, popupsData, type = null }) => {
  let canActions = false;
  const currentActionButtons = useOrderActions({ order });

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
        STATIC.ORDER_CANCELATION_STATUSES.WAITING_WORKER_APPROVE
      ) {
        canActions = true;
      }
    } else {
      if (
        type == STATIC.MESSAGE_TYPES.NEW_ORDER &&
        !order.actualUpdateRequest &&
        (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
          order.status == STATIC.ORDER_STATUSES.PENDING_WORKER)
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.UPDATE_ORDER &&
        order.actualUpdateRequest &&
        order.actualUpdateRequest.id == content.requestId &&
        (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
          order.status == STATIC.ORDER_STATUSES.PENDING_WORKER)
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.OWNER_PAYED &&
        order.status == STATIC.ORDER_STATUSES.IN_PROCESS
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.IN_PROCESS &&
        order.status == STATIC.ORDER_STATUSES.IN_PROCESS
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.FINISHED &&
        order.status == STATIC.ORDER_STATUSES.FINISHED
      ) {
        canActions = true;
      }

      if (
        type == STATIC.MESSAGE_TYPES.WAITING_FINISHED_APPROVE &&
        order.status == STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED
      ) {
        canActions = true;
      }

      if (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER_PAYMENT) {
        if (order?.paymentInfo?.id) {
          if (type == STATIC.MESSAGE_TYPES.OWNER_PAYED_WAITING) {
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
