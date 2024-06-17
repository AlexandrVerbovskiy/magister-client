import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import StatusBlock from "../Listings/StatusBlock";
import {
  getDaysDifference,
  getFilePath,
  moneyFormat,
  objDateSort,
} from "../../utils";
import STATIC from "../../static";
import { useOrderActions, useOrderDateError } from "../../hooks";
import ErrorBlockMessage from "../_App/ErrorBlockMessage";
import Link from "next/link";
import { useRouter } from "next/router";

const OrderInfo = ({
  order,
  link,
  handleClickCancel,
  handleClickPayedFastCancel,
  handleClickUpdateRequest,
  handleClickReject,
  handleClickAccept,
  handleClickPay,
  handleClickExtend,
  extension = false,
  handleDisputeCreate,
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
      <td className="details">
        <h4 className="order-item-title-row">
          <div>{extension ? "Extension" : order.listingName}</div>
          <StatusBlock
            status={order.status}
            disputeStatus={order.disputeStatus}
            ownerId={order.ownerId}
            tenantId={order.tenantId}
            userId={sessionUser?.id}
            dopClass="bookings-status order-item-status"
            endDate={order.offerEndDate}
            statusCancelled={order.cancelStatus}
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
          <li className="order-list-item-date">
            <i className="bx bx-calendar"></i>
            <CanBeErrorBaseDateSpan
              startDate={
                order.requestId ? order.newStartDate : order.offerStartDate
              }
              endDate={order.requestId ? order.newEndDate : order.offerEndDate}
            />
          </li>
          <li className="row-dots-end">
            <i className="bx bx-purchase-tag"></i>
            <span>Price: </span>$
            <span>
              {order.requestId
                ? moneyFormat(
                    order.newPricePerDay *
                      getDaysDifference(order.newStartDate, order.newEndDate)
                  )
                : moneyFormat(
                    order.offerPricePerDay *
                      getDaysDifference(
                        order.offerStartDate,
                        order.offerEndDate
                      )
                  )}
            </span>
          </li>
          <li>
            <i className="bx bx-credit-card-front"></i>
            <span>Payment: </span>
            <span className="row-dots-end">
              {[
                STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
                STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
                STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
                STATIC.ORDER_STATUSES.FINISHED,
              ].includes(order.status) && paymentType ? (
                <>
                  <strong className="paid">Paid</strong> using{" "}
                  {paymentType == "credit-card" ? "Bank Transfer" : "Paypal"}
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
                <b>Dispute type:</b>{" "}
                {STATIC.DISPUTE_TYPE_TITLE[order.disputeType]}
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
      </td>

      <td className="action d-flex">
        <Link href={link + "/" + order.id} className="default-btn">
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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClickPay(order.id);
            }}
            className="default-btn"
          >
            <i className="bx bx-wallet"></i> Pay
          </button>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.PAY_UPDATE_BUTTON
        ) && (
          <Link
            className="default-btn"
            href={`/dashboard/pay-by-credit-card/` + order.id}
          >
            <i className="bx bx-wallet"></i> Update payment
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.FOR_TENANT_QRCODE
        ) && (
          <Link
            className="default-btn"
            href={link + "/" + order.id + "?scroll-to=tenant-qr-code"}
          >
            <i className="bx bx-comment-detail"></i> Start the rental
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.FOR_OWNER_QRCODE
        ) && (
          <Link
            className="default-btn"
            href={link + "/" + order.id + "?scroll-to=owner-qr-code"}
          >
            <i className="bx bx-comment-detail"></i> Finish the rental
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.TENANT_REVIEW
        ) && (
          <Link
            className="default-btn"
            href={`/dashboard/creating-renter-review/` + order.id}
          >
            <i className="bx bx-comment-detail"></i> Leave a review
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.OWNER_REVIEW
        ) && (
          <Link
            className="default-btn"
            href={`/dashboard/creating-owner-review/` + order.id}
          >
            <i className="bx bx-comment-detail"></i> Leave a review
          </Link>
        )}

        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.OPEN_DISPUTE
        ) && (
          <button
            className="default-btn"
            onClick={() => handleDisputeCreate(order.id)}
            type="button"
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
      </td>
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
  handleClickPay,
  handleClickExtend,
  handleDisputeCreate,
}) => {
  const router = useRouter();
  const userId = filterType == "tenant" ? order.ownerId : order.tenantId;
  const userName = filterType == "tenant" ? order.ownerName : order.tenantName;
  const userEmail =
    filterType == "tenant" ? order.ownerEmail : order.tenantEmail;
  const userPhoto =
    filterType == "tenant" ? order.ownerPhoto : order.tenantPhoto;
  const userPhone =
    filterType == "tenant" ? order.ownerPhone : order.tenantPhone;

  return (
    <>
      <tr>
        <td
          className="name"
          style={order.extendOrders.length > 0 ? { borderBottom: 0 } : {}}
        >
          <img
            src={userPhoto ? getFilePath(userPhoto) : STATIC.DEFAULT_PHOTO_LINK}
            alt="image"
          />
          <div className="info">
            <span className="row-dots-end">{userName}</span>
            <ul>
              {userPhone && (
                <li>
                  <Link className="row-dots-end" href={`tel:${userPhone}`}>
                    {userPhone}
                  </Link>
                </li>
              )}
              <li>
                <Link className="row-dots-end" href={`mailto:${userEmail}`}>
                  {userEmail}
                </Link>
              </li>
            </ul>
            <Link href={`/chat/${userId}`} className="default-btn">
              <i className="bx bx-envelope"></i> Send Message
            </Link>
          </div>
        </td>

        <OrderInfo
          order={order}
          handleClickCancel={handleClickCancel}
          handleClickPayedFastCancel={handleClickPayedFastCancel}
          handleClickUpdateRequest={handleClickUpdateRequest}
          handleClickReject={handleClickReject}
          handleClickAccept={handleClickAccept}
          handleClickPay={handleClickPay}
          handleClickExtend={handleClickExtend}
          link={link}
          handleDisputeCreate={handleDisputeCreate}
        />
      </tr>

      {objDateSort(order.extendOrders, "offerStartDate").map(
        (extendOrder, index) => (
          <tr key={extendOrder.id}>
            <td
              className="name"
              style={
                order.extendOrders.length != index + 1
                  ? { borderBottom: 0, borderTop: 0 }
                  : { borderTop: 0 }
              }
            ></td>

            <OrderInfo
              order={extendOrder}
              handleClickCancel={handleClickCancel}
              handleClickPayedFastCancel={handleClickPayedFastCancel}
              handleClickUpdateRequest={handleClickUpdateRequest}
              handleClickReject={handleClickReject}
              handleClickAccept={handleClickAccept}
              handleClickPay={handleClickPay}
              handleClickExtend={handleClickExtend}
              link={link}
              extension={true}
            />
          </tr>
        )
      )}
    </>
  );
};

export default OrderItem;
