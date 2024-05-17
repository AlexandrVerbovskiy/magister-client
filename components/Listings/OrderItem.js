import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import StatusBlock from "./StatusBlock";
import { getDaysDifference, getFilePath, moneyFormat } from "../../utils";
import STATIC from "../../static";
import { useOrderActions, useOrderDateError } from "../../hooks";
import ErrorBlockMessage from "../_App/ErrorBlockMessage";
import Link from "next/link";
import { useRouter } from "next/router";

const OrderItem = ({
  order,
  link,
  filterType,
  handleClickCancel,
  handleClickPayedFastCancel,
  handleClickCreateDispute,
  handleOrderClickAcceptCancelByTenant,
  handleOrderClickAcceptCancelByOwner,
  handleClickUpdateRequest,
  handleClickReject,
  handleClickAccept,
  handleClickPay,
}) => {
  const { sessionUser } = useContext(IndiceContext);
  const router = useRouter();

  const userId = filterType == "tenant" ? order.ownerId : order.tenantId;
  const userName = filterType == "tenant" ? order.ownerName : order.tenantName;
  const userEmail =
    filterType == "tenant" ? order.ownerEmail : order.tenantEmail;
  const userPhoto =
    filterType == "tenant" ? order.ownerPhoto : order.tenantPhoto;
  const userPhone =
    filterType == "tenant" ? order.ownerPhone : order.tenantPhone;

  const { CanBeErrorBaseDateSpan, checkErrorData } = useOrderDateError({
    order,
  });

  const currentActionButtons = useOrderActions({
    order,
  });

  const goToOrderPage = () => {
    router.push(link);
  };

  return (
    <tr>
      <td className="name">
        <img
          src={userPhoto ? getFilePath(userPhoto) : STATIC.DEFAULT_PHOTO_LINK}
          alt="image"
        />
        <div className="info">
          <span>{userName}</span>
          <ul>
            {userPhone && (
              <li>
                <a href={`tel:${userPhone}`}>{userPhone}</a>
              </li>
            )}
            <li>
              <a href={`mailto:${userEmail}`}>{userEmail}</a>
            </li>
          </ul>
          <a href={`/chat/${userId}`} className="default-btn">
            <i className="bx bx-envelope"></i> Send Message
          </a>
        </div>
      </td>

      <td className="details">
        <h4 className="order-item-title-row">
          <div>{order.listingName}</div>
          <StatusBlock
            status={order.status}
            statusCancelled={order.cancelStatus}
            ownerId={order.ownerId}
            tenantId={order.tenantId}
            userId={sessionUser?.id}
            dopClass="bookings-status order-item-status"
            endDate={order.offerEndDate}
          />
        </h4>

        <ul>
          <li>
            <i className="bx bx-map"></i>
            <span>Address: </span>
            {order.listingCity}
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
          <li>
            <i className="bx bx-purchase-tag"></i>
            <span>Price: </span>$
            {order.requestId
              ? moneyFormat(
                  order.newPricePerDay *
                    getDaysDifference(order.newStartDate, order.newEndDate)
                )
              : moneyFormat(
                  order.offerPricePerDay *
                    getDaysDifference(order.offerStartDate, order.offerEndDate)
                )}
          </li>
          <li>
            <i className="bx bx-credit-card-front"></i>
            <span>Payment: </span>
            {[
              STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
              STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
              STATIC.ORDER_STATUSES.FINISHED,
            ].includes(order.status) ? (
              <>
                <strong className="paid">Paid</strong> using Paypal
              </>
            ) : (
              <strong className="unpaid">Unpaid</strong>
            )}
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
        </ul>
      </td>

      <td className="action d-flex">
        <Link href={link} className="default-btn">
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
          STATIC.ORDER_ACTION_BUTTONS.CREATE_DISPUTE_BUTTON
        ) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClickCreateDispute(order.id);
            }}
            className="default-btn danger"
          >
            <i className="bx bx-x-circle"></i> Create Dispute
          </button>
        )}
        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.ACCEPT_TENANT_CANCEL_BUTTON
        ) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOrderClickAcceptCancelByTenant(order.id);
            }}
            className="default-btn danger"
          >
            <i className="bx bx-x-circle"></i> Accept Cancel
          </button>
        )}
        {currentActionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.ACCEPT_OWNER_CANCEL_BUTTON
        ) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOrderClickAcceptCancelByOwner(order.id);
            }}
            className="default-btn danger"
          >
            <i className="bx bx-x-circle"></i> Accept Cancel
          </button>
        )}
      </td>
    </tr>
  );
};

export default OrderItem;
