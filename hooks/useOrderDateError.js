import {
  checkStringDateLowerOrEqualCurrentDate,
  dateConverter,
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
  startDate,
  finishDate,
  className = "",
  tooltipText = null,
}) => {
  return (
    <Parent tooltipText={tooltipText}>
      Rental duration:{" "}
      <span className={className}>
        {dateConverter(startDate)} - {dateConverter(finishDate)}
      </span>
    </Parent>
  );
};

const useOrderDateError = ({ order }) => {
  const checkErrorData = (startDate, finishDate) => {
    let tooltipErrorMessage = "";
    let blocked = false;

    if (
      (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
        order.status == STATIC.ORDER_STATUSES.PENDING_RENTER) &&
      order.cancelStatus == null
    ) {
      if (checkStringDateLowerOrEqualCurrentDate(finishDate)) {
        tooltipErrorMessage = "Order finish date is overdue";
        blocked = true;
      }

      if (checkStringDateLowerOrEqualCurrentDate(startDate)) {
        tooltipErrorMessage = "Order start date is overdue";
        blocked = true;
      }
    }

    return { tooltipErrorMessage, blocked };
  };

  const CanBeErrorBaseDateSpan = ({ finishDate, startDate }) => {
    const { tooltipErrorMessage, blocked } = checkErrorData(
      startDate,
      finishDate
    );

    return (
      <BaseDateSpan
        startDate={startDate}
        finishDate={finishDate}
        className={blocked ? "error-span" : ""}
        tooltipText={tooltipErrorMessage}
      />
    );
  };

  return { CanBeErrorBaseDateSpan, checkErrorData, BaseDateSpan };
};

export default useOrderDateError;
