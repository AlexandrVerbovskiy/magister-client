import STATIC from "../../static";
import { separateDate } from "../../utils";

const StatusBlock = ({
  status,
  statusCancelled,
  disputeStatus,
  ownerId,
  tenantId,
  userId,
  endDate,
  payedId,
  dopClass = "",
  adminApproved,
  waitingApproved,
}) => {
  let orderStatus =
    status ?? STATIC.ORDER_STATUSES[Object.keys(STATIC.ORDER_STATUSES)[0]];
  let text = "Waiting Approval";
  let color = "status-background-base";

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_OWNER) {
    color = "status-background-base";

    if (ownerId == userId) {
      text = "Request received";
    } else {
      text = "Waiting for confirmation";
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_TENANT) {
    color = "status-background-base";

    if (tenantId == userId) {
      text = "Waiting for confirmation";
    } else {
      text = "Request received";
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT) {
    color = "status-background-green";
    text = "Waiting for payment";

    if (payedId) {
      if (waitingApproved) {
        color = "status-background-base";
        text = "Waiting for payment confirmation";
      }

      if (!adminApproved && !waitingApproved) {
        color = "status-background-red";
        text = "Payment rejected";
      }
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT) {
    color = "status-background-green";
    text = "Approved";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
    if (separateDate(new Date()) < endDate) {
      color = "status-background-orange";
      text = "Rental in progress";
    } else {
      color = "status-background-base";
      text = "Rental in progress";
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.FINISHED) {
    color = "status-background-green";
    text = "Finished";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.REJECTED) {
    color = "status-background-red";
    text = "Denied";
  }

  if (statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.CANCELLED) {
    color = "status-background-red";
    text = "Cancelled";
  }

  if (
    statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE
  ) {
    color = "status-background-red";
    text = "In dispute";
  }

  if (
    statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE
  ) {
    color = "status-background-red";
    text = "In dispute";
  }

  if (
    statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.WAITING_ADMIN_APPROVE
  ) {
    color = "status-background-red";
    text = "In dispute";
  }

  if (
    disputeStatus == STATIC.DISPUTE_STATUSES.OPEN ||
    disputeStatus == STATIC.DISPUTE_STATUSES.UNSOLVED
  ) {
    color = "status-background-orange";
    text = "In dispute";
  }

  if (disputeStatus == STATIC.DISPUTE_STATUSES.SOLVED) {
    color = "status-background-green";
    text = "Dispute solved";
  }

  return <div className={`${dopClass} ${color}`}>{text}</div>;
};
export default StatusBlock;
