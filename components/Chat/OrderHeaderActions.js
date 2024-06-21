import Link from "next/link";
import STATIC from "../../static";
import { useOrderActions } from "../../hooks";

const OrderHeaderActions = ({ order }) => {
  const link = "/dashboard/orders";
  const currentActionButtons = useOrderActions({ order });

  return (
    <>
      <Link
        className="dropdown-item d-flex align-items-center"
        href={link + "/" + order.id}
      >
        <i className="bx bx-detail"></i> View details
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
              className="dropdown-item d-flex align-items-center"
            >
              <i className="bx bx-check-circle"></i> Accept
            </button>
          )}
          <button
            type="button"
            className="dropdown-item d-flex align-items-center"
          >
            <i className="bx bx-pencil"></i> Edit
          </button>
          <button
            type="button"
            className="dropdown-item d-flex align-items-center"
          >
            <i className="bx bx-x-circle"></i> Reject
          </button>
        </>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.PAY_BUTTON
      ) && (
        <button
          type="button"
          className="dropdown-item d-flex align-items-center"
        >
          <i className="bx bx-wallet"></i> Pay
        </button>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.PAY_UPDATE_BUTTON
      ) && (
        <Link
          className="dropdown-item d-flex align-items-center"
          href={`/dashboard/pay-by-credit-card/` + order.id}
        >
          <i className="bx bx-wallet"></i> Update payment
        </Link>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.FOR_TENANT_QRCODE
      ) && (
        <Link
          className="dropdown-item d-flex align-items-center"
          href={link + "/" + order.id + "?scroll-to=tenant-qr-code"}
        >
          <i className="bx bx-comment-detail"></i> Start the rental
        </Link>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.FOR_OWNER_QRCODE
      ) && (
        <Link
          className="dropdown-item d-flex align-items-center"
          href={link + "/" + order.id + "?scroll-to=owner-qr-code"}
        >
          <i className="bx bx-comment-detail"></i> Finish the rental
        </Link>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.TENANT_REVIEW
      ) && (
        <Link
          className="dropdown-item d-flex align-items-center"
          href={`/dashboard/creating-renter-review/` + order.id}
        >
          <i className="bx bx-comment-detail"></i> Leave a review
        </Link>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.OWNER_REVIEW
      ) && (
        <Link
          className="dropdown-item d-flex align-items-center"
          href={`/dashboard/creating-owner-review/` + order.id}
        >
          <i className="bx bx-comment-detail"></i> Leave a review
        </Link>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.OPEN_DISPUTE
      ) && (
        <button
          type="button"
          className="dropdown-item d-flex align-items-center"
        >
          <i className="bx bx-transfer-alt"></i>
          Open dispute
        </button>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.EXTEND_BUTTON
      ) && (
        <button
          type="button"
          className="dropdown-item d-flex align-items-center"
        >
          <i className="bx bx-calendar"></i> Extend Offer
        </button>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.FAST_CANCEL_BUTTON
      ) && (
        <button
          type="button"
          className="dropdown-item d-flex align-items-center"
        >
          <i className="bx bx-x-circle"></i> Cancel
        </button>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.CANCEL_BUTTON
      ) && (
        <button
          type="button"
          className="dropdown-item d-flex align-items-center"
        >
          <i className="bx bx-x-circle"></i> Cancel
        </button>
      )}
    </>
  );
};

export default OrderHeaderActions;
