import { useContext } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IndiceContext } from "../../contexts";
import StatusBlock from "./StatusBlock";
import {
  getDaysDifference,
  getFilePath,
  getListingImageByType,
  moneyFormat,
  timeNormalConverter,
} from "../../utils";
import STATIC from "../../static";

const OrderItem = ({ order, link, filterType }) => {
  const { sessionUser } = useContext(IndiceContext);
  const userId = filterType == "tenant" ? order.ownerId : order.tenantId;
  const userName = filterType == "tenant" ? order.ownerName : order.tenantName;
  const userEmail =
    filterType == "tenant" ? order.ownerEmail : order.tenantEmail;
  const userPhoto =
    filterType == "tenant" ? order.ownerPhoto : order.tenantPhoto;
  const userPhone =
    filterType == "tenant" ? order.ownerPhone : order.tenantPhone;

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
          <li>
            <i className="bx bx-calendar"></i>
            <span>Date: </span>
            {order.requestId ? (
              <>
                {order.newStartDate == order.newEndDate
                  ? timeNormalConverter(order.newStartDate)
                  : `${timeNormalConverter(
                      order.newStartDate
                    )} - ${timeNormalConverter(order.newEndDate)}`}
              </>
            ) : (
              <>
                {order.offerStartDate == order.offerEndDate
                  ? timeNormalConverter(order.offerStartDate)
                  : `${timeNormalConverter(
                      order.offerStartDate
                    )} - ${timeNormalConverter(order.offerEndDate)}`}
              </>
            )}
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
        </ul>
      </td>

      <td className="action">
        <a href={link} className="default-btn">
          <i className="bx bx-detail"></i> View details
        </a>
      </td>
    </tr>
  );
};

export default OrderItem;
