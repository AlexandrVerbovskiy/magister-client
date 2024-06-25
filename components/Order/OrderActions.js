import Link from "next/link";
import STATIC from "../../static";
import { useOrderDateError } from "../../hooks";

const OrderActions = ({
  currentActionButtons,
  order,
  actionClass = "d-flex align-items-center",
  needIcon = true,
  link = "/dashboard/orders",
  popupsData,
}) => {
  const { checkErrorData } = useOrderDateError({
    order,
  });

  return (
    <>
      <Link className={actionClass} href={link + "/" + order.id}>
        {needIcon && <i className="bx bx-detail"></i>} View details
      </Link>

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
      ) && (
        <>
          {!checkErrorData(
            order.requestId ? order.newStartDate : order.offerStartDate
          ).blocked && (
            <button
              type="button"
              className={actionClass}
              onClick={() => popupsData.setAcceptOrderModalActive(true)}
              disabled={popupsData.bookingActionsDisabled}
            >
              {needIcon && <i className="bx bx-check-circle"></i>} Accept
            </button>
          )}
          <button
            type="button"
            className={actionClass}
            onClick={() => popupsData.setUpdateRequestModalActive(true)}
            disabled={popupsData.bookingActionsDisabled}
          >
            {needIcon && <i className="bx bx-pencil"></i>} Edit
          </button>
          <button
            type="button"
            className={actionClass}
            onClick={() => popupsData.setRejectOrderModalActive(true)}
            disabled={popupsData.bookingActionsDisabled}
          >
            {needIcon && <i className="bx bx-x-circle"></i>} Reject
          </button>
        </>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.PAY_BUTTON
      ) && (
        <button
          type="button"
          className={actionClass}
          onClick={() => popupsData.setPaypalModalActive(true)}
        >
          {needIcon && <i className="bx bx-wallet"></i>} Pay
        </button>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.PAY_UPDATE_BUTTON
      ) && (
        <Link
          className={actionClass}
          href={`/dashboard/pay-by-credit-card/` + order.id}
        >
          {needIcon && <i className="bx bx-wallet"></i>} Update payment
        </Link>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.FOR_TENANT_QRCODE
      ) && (
        <Link
          className={actionClass}
          href={link + "/" + order.id + "?scroll-to=tenant-qr-code"}
        >
          {needIcon && <i className="bx bx-comment-detail"></i>} Start the
          rental
        </Link>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.FOR_OWNER_QRCODE
      ) && (
        <Link
          className={actionClass}
          href={link + "/" + order.id + "?scroll-to=owner-qr-code"}
        >
          {needIcon && <i className="bx bx-comment-detail"></i>} Finish the
          rental
        </Link>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.TENANT_REVIEW
      ) && (
        <Link
          className={actionClass}
          href={`/dashboard/creating-renter-review/` + order.id}
        >
          {needIcon && <i className="bx bx-comment-detail"></i>} Leave a review
        </Link>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.OWNER_REVIEW
      ) && (
        <Link
          className={actionClass}
          href={`/dashboard/creating-owner-review/` + order.id}
        >
          {needIcon && <i className="bx bx-comment-detail"></i>} Leave a review
        </Link>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.OPEN_DISPUTE
      ) && (
        <button
          type="button"
          className={actionClass}
          onClick={() => popupsData.setActiveDisputeWindow(true)}
        >
          {needIcon && <i className="bx bx-transfer-alt"></i>}
          Open dispute
        </button>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.EXTEND_BUTTON
      ) && (
        <button
          type="button"
          className={actionClass}
          onClick={() => popupsData.setExtendPopupActive(true)}
        >
          {needIcon && <i className="bx bx-calendar"></i>} Extend Offer
        </button>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.FAST_CANCEL_BUTTON
      ) && (
        <button
          type="button"
          className={actionClass}
          onClick={() => popupsData.setPayedCancelModalActive(true)}
        >
          {needIcon && <i className="bx bx-x-circle"></i>} Cancel
        </button>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.CANCEL_BUTTON
      ) && (
        <button
          type="button"
          className={actionClass}
          onClick={() => popupsData.setCancelModalActive(true)}
        >
          {needIcon && <i className="bx bx-x-circle"></i>} Cancel
        </button>
      )}
    </>
  );
};

export default OrderActions;
