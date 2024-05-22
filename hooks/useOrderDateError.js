import { useContext } from "react";
import { IndiceContext } from "../contexts";
import {
  checkStringDateLowerOrEqualCurrentDate,
  timeConverter,
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
  endDate,
  className = "",
  tooltipText = null,
}) => {
  if (timeConverter(startDate) === timeConverter(endDate)) {
    return (
      <Parent tooltipText={tooltipText}>
        Rental date:{" "}
        <span className={className}>{timeConverter(startDate)}</span>
      </Parent>
    );
  }

  return (
    <Parent tooltipText={tooltipText}>
      Rental duration:{" "}
      <span className={className}>{timeConverter(startDate)}</span> -{" "}
      <span className={className}>{timeConverter(endDate)}</span>
    </Parent>
  );
};

const useOrderDateError = ({ order }) => {
  const { sessionUser } = useContext(IndiceContext);

  const checkErrorData = (startDate) => {
    let tooltipErrorMessage = "";
    let blocked = false;

    if (
      (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
        order.status == STATIC.ORDER_STATUSES.PENDING_TENANT) &&
      order.cancelStatus == null
    ) {
      if (checkStringDateLowerOrEqualCurrentDate(startDate)) {
        tooltipErrorMessage = "Order start date is overdue";
        blocked = true;
      }

      if (
        order.conflictOrders &&
        order.conflictOrders.length > 0 &&
        order.ownerId == sessionUser?.id
      ) {
        tooltipErrorMessage =
          "There are more priority bookings or orders for these dates";
        blocked = true;
      }
    }

    return { tooltipErrorMessage, blocked };
  };

  const CanBeErrorBaseDateSpan = ({ startDate, endDate }) => {
    const { tooltipErrorMessage, blocked } = checkErrorData(startDate);

    return (
      <BaseDateSpan
        startDate={startDate}
        endDate={endDate}
        className={blocked ? "error-span" : ""}
        tooltipText={tooltipErrorMessage}
      />
    );
  };

  return { CanBeErrorBaseDateSpan, checkErrorData, BaseDateSpan };
};

export default useOrderDateError;
