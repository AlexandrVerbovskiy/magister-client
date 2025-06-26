import {
  checkStringDateLowerOrEqualCurrentDate,
  fullDateConverter,
} from "../utils";
import STATIC from "../static";

const Parent = ({ children, tooltipText }) => {
  if (tooltipText) {
    return (
      <div data-bs-toggle="tooltip" data-bs-placement="top" title={tooltipText}>
        {children}
      </div>
    );
  }

  return <div>{children}</div>;
};

const BaseDateSpan = ({
  startTime,
  finishTime,
  className = "",
  tooltipText = null,
}) => {
  return (
    <Parent tooltipText={tooltipText}>
      Rental duration:{" "}
      <span className={className}>
        {fullDateConverter(startTime)} - {fullDateConverter(finishTime)}
      </span>
    </Parent>
  );
};

const useOrderDateError = ({ order }) => {
  const checkErrorData = (startTime, finishTime) => {
    let tooltipErrorMessage = "";
    let blocked = false;

    if (
      (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
        order.status == STATIC.ORDER_STATUSES.PENDING_RENTER) &&
      order.cancelStatus == null
    ) {
      if (checkStringDateLowerOrEqualCurrentDate(finishTime)) {
        tooltipErrorMessage = "Order finish date is overdue";
        blocked = true;
      }

      if (checkStringDateLowerOrEqualCurrentDate(startTime)) {
        tooltipErrorMessage = "Order start date is overdue";
        blocked = true;
      }
    }

    return { tooltipErrorMessage, blocked };
  };

  const CanBeErrorBaseDateSpan = ({ finishTime, startTime }) => {
    const { tooltipErrorMessage, blocked } = checkErrorData(
      startTime,
      finishTime
    );

    return (
      <BaseDateSpan
        startTime={startTime}
        finishTime={finishTime}
        className={blocked ? "error-span" : ""}
        tooltipText={tooltipErrorMessage}
      />
    );
  };

  return { CanBeErrorBaseDateSpan, checkErrorData, BaseDateSpan };
};

export default useOrderDateError;
