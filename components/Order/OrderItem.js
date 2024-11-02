import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import StatusBlock from "../Listings/StatusBlock";
import {
  fullDateConverter,
  generateProfileFilePath,
  getDisputeTitle,
  getFactOrderDays,
  getPaymentNameByType,
  moneyFormatVisual,
} from "../../utils";
import STATIC from "../../static";
import { useOrderActions, useOrderDateError } from "../../hooks";
import ErrorBlockMessage from "../_App/ErrorBlockMessage";
import Link from "next/link";

const OrderInfo = ({
  order,
  link,
  handleClickCancel,
  handleClickPayedFastCancel,
  handleClickUpdateRequest,
  handleClickReject,
  handleClickAccept,
}) => {
  const { checkErrorData } = useOrderDateError({
    order,
  });

  const { sessionUser } = useContext(IndiceContext);

  const currentActionButtons = useOrderActions({
    order,
  });

  const paymentType = order.paymentInfo?.type;

  return (
    <>
      <div className="td details">
        <h4 className="order-item-title-row">
          <div>
            <Link href={"/listings/" + order.listingId}>
              {order.listingName}
            </Link>
          </div>
          <StatusBlock
            status={order.status}
            disputeStatus={order.disputeStatus}
            ownerId={order.ownerId}
            workerId={order.workerId}
            userId={sessionUser?.id}
            dopClass="bookings-status order-item-status"
            endDate={order.offerEndDate}
            statusCancelled={order.cancelStatus}
            payedId={order.paymentInfo?.id}
            adminApproved={order.paymentInfo?.adminApproved}
            waitingApproved={order.paymentInfo?.waitingApproved}
          />
        </h4>

        <ul>
          <li className="row-dots-end">
            <i className="bx bx-map"></i>
            <span>Address: </span>
            <span>{order.listingCity}</span>
          </li>
          <li className="row-dots-end" style={{ color: "black" }}>
            <i className="bx bx-purchase-tag"></i>
            <span>Price: </span>
            <span>
              {order.requestId
                ? moneyFormatVisual(order.newPrice)
                : moneyFormatVisual(order.offerPrice)}
            </span>
          </li>

          <li className="row-dots-end" style={{ color: "black" }}>
            <i className="bx bx-purchase-tag"></i>
            <span>Finish Time: </span>
            <span>
              {fullDateConverter(
                order.requestId ? order.newFinishTime : order.offerFinishTime
              )}
            </span>
          </li>

          <li>
            <i className="bx bx-credit-card-front"></i>
            <span>Payment: </span>
            <span className="row-dots-end">
              {[
                STATIC.ORDER_STATUSES.PENDING_WORKER_PAYMENT,
                STATIC.ORDER_STATUSES.IN_PROCESS,
                STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED,
                STATIC.ORDER_STATUSES.FINISHED,
              ].includes(order.status) && paymentType ? (
                <>
                  <strong className="paid">Paid</strong> using{" "}
                  {getPaymentNameByType(paymentType)}
                </>
              ) : (
                <strong className="unpaid">Unpaid</strong>
              )}
            </span>
          </li>

          {order.disputeId && (
            <li className="order-list-item-error">
              <ErrorBlockMessage>
                <b>Dispute type:</b> {getDisputeTitle(order.disputeType)}
                <br />
                <b>Dispute description:</b> {order.disputeDescription}
              </ErrorBlockMessage>
            </li>
          )}
          {currentActionButtons.includes(
            STATIC.ORDER_ACTION_BUTTONS.PAY_UPDATE_BUTTON
          ) &&
            order.paymentInfo && (
              <li className="order-list-item-error">
                <ErrorBlockMessage>
                  <b>Payment failed description:</b>{" "}
                  {order.paymentInfo.failedDescription}
                </ErrorBlockMessage>
              </li>
            )}
        </ul>
      </div>

      <div className="td action">
        <Link href={`${link}/${order.id}/`} className="default-btn">
          <i className="bx bx-detail"></i> View details
        </Link>

        {(currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
        ) ||
          currentActionButtons.includes(
            STATIC.ORDER_ACTION_BUTTONS.BOOKING_UPDATING_SECTION
          )) && (
          <>
            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
            ) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickAccept(order.id);
                }}
                className="default-btn"
              >
                <i className="bx bx-check-circle"></i> Accept
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClickUpdateRequest(order.id);
              }}
              className="default-btn"
            >
              <i className="bx bx-pencil"></i> Edit
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClickReject(order.id);
              }}
              className="default-btn danger"
            >
              <i className="bx bx-x-circle"></i> Reject
            </button>
          </>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.PAY_BUTTON
        ) && (
          <Link
            href={`/dashboard/orders/checkout/${order.id}`}
            className="default-btn"
          >
            <i className="bx bx-wallet"></i> Pay
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.PAY_UPDATE_BUTTON
        ) && (
          <Link
            className="default-btn"
            href={`/dashboard/pay-by-bank-transfer/${order.id}`}
          >
            <i className="bx bx-wallet"></i> Update payment
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.WORKER_REVIEW
        ) && (
          <Link
            className="default-btn"
            href={`/dashboard/creating-worker-review/${order.id}/`}
          >
            <i className="bx bx-comment-detail"></i> Leave a review
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.OWNER_REVIEW
        ) && (
          <Link
            className="default-btn"
            href={`/dashboard/creating-owner-review/${order.id}/`}
          >
            <i className="bx bx-comment-detail"></i> Leave a review
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.OPEN_DISPUTE
        ) && (
          <Link
            className="default-btn"
            href={`/dashboard/orders/create-dispute/${order.id}/`}
          >
            <i className="bx bx-transfer-alt"></i>
            Open dispute
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.FAST_CANCEL_BUTTON
        ) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClickPayedFastCancel(order.id);
            }}
            className="default-btn danger"
          >
            <i className="bx bx-x-circle"></i> Cancel
          </button>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.CANCEL_BUTTON
        ) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClickCancel(order.id);
            }}
            className="default-btn danger"
          >
            <i className="bx bx-x-circle"></i> Cancel
          </button>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.ORDER_CHAT
        ) && (
          <Link
            className="default-btn"
            href={`/dashboard/chats/${order.chatId}/`}
          >
            <i className="bx bx-chat"></i> Chat
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.VIEW_DISPUTE_CHAT
        ) && (
          <Link
            className="default-btn"
            href={`/dashboard/chats/${order.disputeChatId}/`}
          >
            <i className="bx bx-chat"></i> Dispute Chat
          </Link>
        )}
      </div>
    </>
  );
};

const OrderItem = ({
  order,
  link,
  filterType,
  handleClickCancel,
  handleClickPayedFastCancel,
  handleClickUpdateRequest,
  handleClickReject,
  handleClickAccept,
}) => {
  const userName = filterType == "worker" ? order.ownerName : order.workerName;
  const userEmail =
    filterType == "worker" ? order.ownerEmail : order.workerEmail;
  const userPhoto =
    filterType == "worker" ? order.ownerPhoto : order.workerPhoto;

  return (
    <div className="tr">
      <div className="td name">
        <img src={generateProfileFilePath(userPhoto)} alt="image" />
        <div className="info">
          <span className="row-dots-end">{userName}</span>
          <ul>
            <li>
              <Link className="row-dots-end" href={`mailto:${userEmail}`}>
                {userEmail}
              </Link>
            </li>
          </ul>
          {order.chatId && (
            <Link
              href={`/dashboard/chats/${order.chatId}/`}
              className="default-btn"
            >
              <i className="bx bx-envelope"></i> Send Message
            </Link>
          )}
        </div>
      </div>

      <OrderInfo
        order={order}
        handleClickCancel={handleClickCancel}
        handleClickPayedFastCancel={handleClickPayedFastCancel}
        handleClickUpdateRequest={handleClickUpdateRequest}
        handleClickReject={handleClickReject}
        handleClickAccept={handleClickAccept}
        link={link}
      />
    </div>
  );
};

export default OrderItem;
