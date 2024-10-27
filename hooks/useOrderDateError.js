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

const BaseDateSpan = ({ finishTime, className = "", tooltipText = null }) => {
  return (
    <Parent tooltipText={tooltipText}>
      Finish by:{" "}
      <span className={className}>{fullDateConverter(finishTime)}</span>
    </Parent>
  );
};

const useOrderDateError = ({ order }) => {
  const checkErrorData = (finishTime) => {
    let tooltipErrorMessage = "";
    let blocked = false;

    if (
      (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
        order.status == STATIC.ORDER_STATUSES.PENDING_TENANT) &&
      order.cancelStatus == null
    ) {
      if (checkStringDateLowerOrEqualCurrentDate(finishTime)) {
        tooltipErrorMessage = "Order start date is overdue";
        blocked = true;
      }
    }

    return { tooltipErrorMessage, blocked };
  };

  const CanBeErrorBaseDateSpan = ({ finishTime }) => {
    const { tooltipErrorMessage, blocked } = checkErrorData(finishTime);

    return (
      <BaseDateSpan
        finishTime={finishTime}
        className={blocked ? "error-span" : ""}
        tooltipText={tooltipErrorMessage}
      />
    );
  };

  return { CanBeErrorBaseDateSpan, checkErrorData, BaseDateSpan };
};

export default useOrderDateError;
