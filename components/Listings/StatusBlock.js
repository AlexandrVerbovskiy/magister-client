import STATIC from "../../static";
import { separateDate } from "../../utils";

const StatusBlock = ({
  status,
  statusCancelled,
  ownerId,
  tenantId,
  userId,
  endDate,
  dopClass = "",
}) => {
  let orderStatus =
    status ?? STATIC.ORDER_STATUSES[Object.keys(STATIC.ORDER_STATUSES)[0]];
  let text = "Waiting Approval";
  let color = "status-background-base";

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_OWNER) {
    color = "status-background-base";

    if (ownerId == userId) {
      text = "Pending Your Approval";
    } else {
      text = "Pending Owner Approval";
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_TENANT) {
    color = "status-background-base";

    if (tenantId == userId) {
      text = "Pending Your Approval";
    } else {
      text = "Pending Renter Approval";
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT) {
    color = "status-background-green";
    text = "Pending Payment";

    if (tenantId == userId) {
      text = "Pending Payment";
    } else {
      text = "Pending Payment";
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT) {
    color = "status-background-green";
    text = "Pending Handover";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
    if (separateDate(new Date()) < endDate) {
      color = "status-background-orange";
      text = "In Process";
    } else {
      color = "status-background-base";
      text = "Pending Item Back";
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.FINISHED) {
    color = "status-background-green";
    text = "Finished";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.REJECTED) {
    color = "status-background-red";
    text = "Declined";
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
