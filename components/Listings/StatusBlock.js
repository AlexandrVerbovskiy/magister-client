import STATIC from "../../static";

const StatusBlock = ({
  status,
  statusCancelled,
  ownerId,
  tenantId,
  userId,
  dopClass = "",
}) => {
  let orderStatus =
    status ?? STATIC.ORDER_STATUSES[Object.keys(STATIC.ORDER_STATUSES)[0]];
  let text = "Waiting confirmation";
  let color = "status-background-base";

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_OWNER) {
    color = "status-background-base";

    if (ownerId == userId) {
      text = "Waiting your confirmation";
    } else {
      text = "Waiting owner confirmation";
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_TENANT) {
    color = "status-background-base";

    if (tenantId == userId) {
      text = "Waiting your confirmation";
    } else {
      text = "Waiting tenant confirmation";
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT) {
    color = "status-background-green";
    text = "Waiting payment";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT) {
    color = "status-background-green";
    text = "Waiting for delivery";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
    color = "status-background-base";
    text = "Waiting for return";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.FINISHED) {
    color = "status-background-green";
    text = "Finished";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.REJECTED) {
    color = "status-background-red";
    text = "Rejected";
  }

  if (statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.CANCELED) {
    color = "status-background-red";
    text = "Cancelled";
  }

  if (
    statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE
  ) {
    color = "status-background-red";
    text = "Waiting Cancelled";
  }

  if (
    statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE
  ) {
    color = "status-background-red";
    text = "Waiting Cancelled";
  }

  if (
    statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.WAITING_ADMIN_APPROVE
  ) {
    color = "status-background-red";
    text = "Waiting Cancelled";
  }

  return <div className={`${dopClass} ${color}`}>{text}</div>;
};
export default StatusBlock;
