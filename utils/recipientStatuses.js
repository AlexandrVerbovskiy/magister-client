import { dateConverter, separateDate } from "./dateHelpers";
import STATIC from "../static";

export default ({
  status,
  plannedTime,
  orderStatus,
  admin = false,
  failedDescription = null,
}) => {
  if (status == "failed") {
    return admin
      ? "An error occurred during the operation. Please contact the administrator to resolve the issue if you haven't already done so"
      : "An error occurred during the operation. Error details: " +
          failedDescription;
  } else if (status == "completed") {
    return "The operation was successfully completed";
  } else if (status == "cancelled") {
    return "The operation was canceled by the customer before it started";
  } else {
    if (new Date(plannedTime) > new Date(separateDate(new Date()))) {
      return (
        "The operation will be executed on the scheduled day: " +
        dateConverter(plannedTime)
      );
    }

    if (orderStatus != STATIC.ORDER_STATUSES.FINISHED) {
      return "The operation will be carried out once the order is completed.";
    }

    return "The operation will be performed during the day";
  }
};
