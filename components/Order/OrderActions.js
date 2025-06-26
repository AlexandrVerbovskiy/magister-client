import Link from "next/link";
import STATIC from "../../static";
import { useRouter } from "next/router";

const OrderActions = ({
  currentActionButtons,
  order,
  actionClass = "d-flex align-items-center",
  needIcon = true,
  link = "/dashboard/orders",
  popupsData,
  canActions = true,
}) => {
  const router = useRouter();

  if (!order) {
    return;
  }

  const handleDisputeChatClick = (e) => {
    e.preventDefault();
    router.push(`/dashboard/chats/${order.disputeChatId}/`);
  };

  return (
    <>
      <Link className={actionClass} href={`${link}/${order.id}/`}>
        {needIcon && <i className="bx bx-detail"></i>} View details
      </Link>

      {canActions && (
        <>
          {currentActionButtons.includes(
            STATIC.ORDER_ACTION_BUTTONS.PAY_UPDATE_BUTTON
          ) && (
            <Link
              className={actionClass}
              href={`/dashboard/pay-by-bank-transfer/${order.id}/`}
            >
              {needIcon && <i className="bx bx-wallet"></i>} Update payment
            </Link>
          )}

          {currentActionButtons.includes(
            STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
          ) && (
            <>
              <button
                type="button"
                className={actionClass}
                onClick={() => popupsData.setAcceptOrderModalActive(true)}
                disabled={popupsData.bookingActionsDisabled}
              >
                {needIcon && <i className="bx bx-check-circle"></i>} Accept
              </button>

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
            <Link
              className={actionClass}
              href={`/dashboard/orders/checkout/${order.id}`}
            >
              {needIcon && <i className="bx bx-wallet"></i>} Pay
            </Link>
          )}

          {currentActionButtons.includes(
            STATIC.ORDER_ACTION_BUTTONS.RENTER_REVIEW
          ) && (
            <Link
              className={actionClass}
              href={`/dashboard/creating-renter-review/${order.id}/`}
            >
              {needIcon && <i className="bx bx-comment-detail"></i>} Leave a
              review
            </Link>
          )}

          {currentActionButtons.includes(
            STATIC.ORDER_ACTION_BUTTONS.OWNER_REVIEW
          ) && (
            <Link
              className={actionClass}
              href={`/dashboard/creating-owner-review/${order.id}`}
            >
              {needIcon && <i className="bx bx-comment-detail"></i>} Leave a
              review
            </Link>
          )}

          {currentActionButtons.includes(
            STATIC.ORDER_ACTION_BUTTONS.VIEW_DISPUTE_CHAT
          ) && (
            <button
              className={actionClass}
              type="button"
              onClick={handleDisputeChatClick}
            >
              {needIcon && <i className="bx bx-chat"></i>} Dispute Chat
            </button>
          )}

          {currentActionButtons.includes(
            STATIC.ORDER_ACTION_BUTTONS.OPEN_DISPUTE
          ) && (
            <Link
              className={actionClass}
              href={`/dashboard/orders/create-dispute/${order.id}`}
            >
              {needIcon && <i className="bx bx-transfer-alt"></i>}
              Open dispute
            </Link>
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
            STATIC.ORDER_ACTION_BUTTONS.FINISH_BUTTON
          ) && (
            <button
              type="button"
              onClick={() => popupsData.setFinishModalActive(true)}
              className={actionClass}
            >
              <i className="bx bx-check-circle"></i> Send Finish Request
            </button>
          )}

          {currentActionButtons.includes(
            STATIC.ORDER_ACTION_BUTTONS.ACCEPT_OWNER_FINISH_BUTTON
          ) && (
            <button
              type="button"
              className={actionClass}
              onClick={() => popupsData.setAcceptFinishModalActive(true)}
            >
              {needIcon && <i className="bx bx-check-circle"></i>} Accept Finish
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
      )}
    </>
  );
};

export default OrderActions;
