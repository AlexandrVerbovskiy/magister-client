import { dateConverter, getDaysDifference, separateDate } from "./dateHelpers";

export default ({
  status,
  plannedTime,
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
    return plannedTime != separateDate(new Date())
      ? "The operation will be executed on the scheduled day: " +
          dateConverter(plannedTime)
      : "The operation will be performed during the day";
  }
};
