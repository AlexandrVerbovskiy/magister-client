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
  needBackground = true,
}) => {
  let orderStatus =
    status ?? STATIC.ORDER_STATUSES[Object.keys(STATIC.ORDER_STATUSES)[0]];
  let text = "Waiting Approval";
  let color = "status-background-base";

  if (
    [
      STATIC.ORDER_STATUSES.PENDING_TENANT,
      STATIC.ORDER_STATUSES.PENDING_OWNER,
    ].includes(orderStatus)
  ) {
    color = "status-background-base";
    text = "Waiting for Confirmation";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_OWNER_PAYMENT) {
    color = "status-background-green";
    text = "Waiting for Payment";

    if (payedId) {
      if (waitingApproved) {
        color = "status-background-base";
        text = "Waiting for Payment Confirmation";
      }

      if (!adminApproved && !waitingApproved) {
        color = "status-background-red";
        text = "Payment Rejected";
      }
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT) {
    color = "status-background-green";
    text = "Approved";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
    if (separateDate(new Date()) < endDate) {
      color = "status-background-orange";
      text = "Rental in Progress";
    } else {
      color = "status-background-orange";
      text = "Rental in Progress";
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
    text = "In Dispute";
  }

  if (
    statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE
  ) {
    color = "status-background-red";
    text = "In Dispute";
  }

  if (
    statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.WAITING_ADMIN_APPROVE
  ) {
    color = "status-background-red";
    text = "In Dispute";
  }

  if (
    disputeStatus == STATIC.DISPUTE_STATUSES.OPEN ||
    disputeStatus == STATIC.DISPUTE_STATUSES.UNSOLVED
  ) {
    color = "status-background-orange";
    text = "In Dispute";
  }

  if (disputeStatus == STATIC.DISPUTE_STATUSES.SOLVED) {
    color = "status-background-green";
    text = "Dispute Solved";
  }

  return (
    <div className={`${dopClass}${needBackground ? ` ${color}` : ""}`}>
      {text}
    </div>
  );
};
export default StatusBlock;
