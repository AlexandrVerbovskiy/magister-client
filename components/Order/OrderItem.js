import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import StatusBlock from "../Listings/StatusBlock";
import {
  generateProfileFilePath,
  getDisputeTitle,
  getFactOrderDays,
  getPaymentNameByType,
  isOrderCanBeAccepted,
  moneyFormatVisual,
} from "../../utils";
import STATIC from "../../static";
import { useOrderActions, useOrderDateError } from "../../hooks";
import ErrorBlockMessage from "../_App/ErrorBlockMessage";
import Link from "next/link";

const baseShowedExtendsCount = 5;

const OrderInfo = ({
  order,
  link,
  handleClickCancel,
  handleClickPayedFastCancel,
  handleClickUpdateRequest,
  handleClickReject,
  handleClickAccept,
  handleClickExtend,
  extension = false,
}) => {
  const { sessionUser } = useContext(IndiceContext);

  const { CanBeErrorBaseDateSpan, checkErrorData } = useOrderDateError({
    order,
  });

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
              {extension ? "Extension" : order.listingName}
            </Link>
          </div>
          <StatusBlock
            status={order.status}
            disputeStatus={order.disputeStatus}
            ownerId={order.ownerId}
            tenantId={order.tenantId}
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
          {!extension && (
            <li className="row-dots-end">
              <i className="bx bx-map"></i>
              <span>Address: </span>
              <span>{order.listingCity}</span>
            </li>
          )}
          <li className="order-list-item-date">
            <i className="bx bx-calendar"></i>
            <CanBeErrorBaseDateSpan
              startDate={
                order.requestId ? order.newStartDate : order.offerStartDate
              }
              endDate={order.requestId ? order.newEndDate : order.offerEndDate}
            />
          </li>
          <li className="row-dots-end" style={{ color: "black" }}>
            <i className="bx bx-purchase-tag"></i>
            <span>Price: </span>
            <span>
              {order.requestId
                ? moneyFormatVisual(
                    order.newPricePerDay *
                      getFactOrderDays(order.newStartDate, order.newEndDate)
                  )
                : moneyFormatVisual(
                    order.offerPricePerDay *
                      getFactOrderDays(order.offerStartDate, order.offerEndDate)
                  )}
            </span>
          </li>
          <li>
            <i className="bx bx-credit-card-front"></i>
            <span>Payment: </span>
            <span className="row-dots-end">
              {[
                STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
                STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT,
                STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
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
          {checkErrorData(
            order.requestId ? order.newStartDate : order.offerStartDate
          ).blocked && (
            <li className="order-list-item-error">
              <ErrorBlockMessage>
                {
                  checkErrorData(
                    order.requestId ? order.newStartDate : order.offerStartDate
                  ).tooltipErrorMessage
                }
              </ErrorBlockMessage>
            </li>
          )}

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

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
        ) && (
          <>
            {isOrderCanBeAccepted(order) && (
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
          STATIC.ORDER_ACTION_BUTTONS.FOR_TENANT_QRCODE
        ) && (
          <Link
            className="default-btn"
            href={`${link}/${order.id}/?scroll-to=tenant-qr-code`}
          >
            <i className="bx bx-comment-detail"></i> Start the rental
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.FOR_OWNER_QRCODE
        ) && (
          <Link
            className="default-btn"
            href={`${link}/${order.id}/?scroll-to=owner-qr-code`}
          >
            <i className="bx bx-comment-detail"></i> Finish the rental
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.TENANT_REVIEW
        ) && (
          <Link
            className="default-btn"
            href={`/dashboard/creating-renter-review/${order.id}/`}
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
          STATIC.ORDER_ACTION_BUTTONS.EXTEND_BUTTON
        ) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClickExtend(order.id);
            }}
            className="default-btn"
          >
            <i className="bx bx-calendar"></i> Extend Offer
          </button>
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
          STATIC.ORDER_ACTION_BUTTONS.EXTENSION_CHAT
        ) && (
          <Link
            className="default-btn"
            href={`/dashboard/chats/${order.parentChatId}`}
          >
            <i className="bx bx-chat"></i> Parent Chat
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
  handleClickExtend,
}) => {
  const [showedAllExtends, setShowedAllExtends] = useState(false);
  const userName = filterType == "tenant" ? order.ownerName : order.tenantName;
  const userEmail =
    filterType == "tenant" ? order.ownerEmail : order.tenantEmail;
  const userPhoto =
    filterType == "tenant" ? order.ownerPhoto : order.tenantPhoto;

  let extendOrders = order.extendOrders.sort((a, b) => a.id - b.id);

  extendOrders = extendOrders.reverse();

  if (!showedAllExtends) {
    extendOrders = extendOrders.slice(0, baseShowedExtendsCount);
  }

  return (
    <>
      <div className="tr">
        <div
          className="td name"
          style={order.extendOrders.length > 0 ? { borderBottom: 0 } : {}}
        >
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
          handleClickExtend={handleClickExtend}
          link={link}
        />
      </div>

      {extendOrders.map((extendOrder, index) => {
        extendOrder["extendOrders"] = order.extendOrders;

        return (
          <div className="tr extension-tr" key={extendOrder.id}>
            <div
              className="td name"
              style={
                order.extendOrders.length != index + 1
                  ? { borderBottom: 0, borderTop: 0 }
                  : { borderTop: 0 }
              }
            ></div>

            <OrderInfo
              order={extendOrder}
              handleClickCancel={handleClickCancel}
              handleClickPayedFastCancel={handleClickPayedFastCancel}
              handleClickUpdateRequest={handleClickUpdateRequest}
              handleClickReject={handleClickReject}
              handleClickAccept={handleClickAccept}
              handleClickExtend={handleClickExtend}
              link={link}
              extension={true}
            />
          </div>
        );
      })}

      {order.extendOrders.length > baseShowedExtendsCount && (
        <div className="tr extension-tr">
          <div colSpan={3} className="td show-more-table-rows">
            <button
              onClick={() => setShowedAllExtends(!showedAllExtends)}
              type="button"
              className="default-btn"
            >
              {showedAllExtends ? "Show Less" : "Show More"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderItem;
