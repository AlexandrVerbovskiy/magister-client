import {
  checkStartEndHasConflict,
  getOrderBlockedDatesToUpdate,
} from "./dateHelpers";
import STATIC from "../static";

const isOrderCanBeAccepted = (order) => {
  if (
    order.status != STATIC.ORDER_STATUSES.PENDING_OWNER ||
    order.disputeId ||
    order.cancelStatus
  ) {
    return true;
  }

  const orderStartDate = order.requestId
    ? order.newStartDate
    : order.offerStartDate;

  const orderEndDate = order.requestId ? order.newEndDate : order.offerEndDate;
  const blockedDates = getOrderBlockedDatesToUpdate(order);

  return !checkStartEndHasConflict(orderStartDate, orderEndDate, blockedDates);
};

export default isOrderCanBeAccepted;
