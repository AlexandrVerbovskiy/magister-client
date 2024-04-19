import Link from "next/link";
import { getListingImageByType } from "../../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import STATIC from "../../static";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";

const StatusBlock = ({
  status,
  statusCancelled,
  ownerId,
  tenantId,
  userId,
}) => {
  let orderStatus =
    status ?? STATIC.ORDER_STATUSES[Object.keys(STATIC.ORDER_STATUSES)[0]];
  let text = "Waiting confirmation";
  let color = "status-background-gray";

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_OWNER) {
    color = "status-background-gray";

    if (ownerId == userId) {
      text = "Waiting your confirmation";
    } else {
      text = "Waiting owner confirmation";
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_TENANT) {
    color = "status-background-gray";

    if (tenantId == userId) {
      text = "Waiting your confirmation";
    } else {
      text = "Waiting tenant confirmation";
    }
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT) {
    color = "status-background-orange";
    text = "Waiting payment";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT) {
    color = "status-background-green";
    text = "Waiting for delivery";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
    color = "status-background-orange";
    text = "Waiting for return";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.FINISHED) {
    color = "status-background-green";
    text = "Finished";
  }

  if (orderStatus == STATIC.ORDER_STATUSES.REJECTED) {
    color = "status-background-green";
    text = "Rejected";
  }

  if (statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.CANCELED) {
    color = "status-background-red";
    text = "Cancelled";
  }

  if (
    statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE
  ) {
    color = "status-background-red";
    text = "Waiting Cancelled";
  }

  if (
    statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE
  ) {
    color = "status-background-red";
    text = "Waiting Cancelled";
  }

  if (
    statusCancelled == STATIC.ORDER_CANCELATION_STATUSES.WAITING_ADMIN_APPROVE
  ) {
    color = "status-background-red";
    text = "Waiting Cancelled";
  }

  return <div className={`${color}`}>{text}</div>;
};

const OrderItem = (order) => {
  const images = order.images ?? [];
  const { sessionUser } = useContext(IndiceContext);

  return (
    <div
      key={order.id}
      className="col-xl-4 col-lg-6 col-md-6 listing-list-elem-parent"
    >
      <div className="single-listings-box">
        <div className="listings-image">
          {images.length < 1 && (
            <Link
              href={`/listing/${order.listingId}`}
              className="link-btn"
            ></Link>
          )}

          {images.length == 1 && (
            <>
              <img
                src={getListingImageByType(images[0].link, images[0].type)}
                alt={order.listingName}
              />
              <Link
                href={`/listing/${order.listingId}`}
                className="link-btn"
              ></Link>
            </>
          )}

          {images.length > 1 && (
            <Swiper
              loop={true}
              navigation={true}
              modules={[Navigation]}
              className="listings-image-slides"
            >
              {images.map((imageInfo) => (
                <SwiperSlide key={imageInfo.link}>
                  <div className="single-image">
                    <img
                      src={getListingImageByType(
                        imageInfo.link,
                        imageInfo.type
                      )}
                      alt={order.name}
                    />
                    <Link
                      href={`/listing/${order.listingId}`}
                      className="link-btn"
                    ></Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <StatusBlock
          status={order.status}
          statusCancelled={order.cancelStatus}
          userId={sessionUser.userId}
          ownerId={order.ownerId}
          tenantId={order.tenantId}
        />

        <div className="listings-content">
          <ul className="listings-meta">
            <li>
              <Link
                href={`/listing-list/?categories=${order.listingCategoryName}`}
              >
                <i className="flaticon-furniture-and-household"></i>
                <span>{order.listingCategoryName}</span>
              </Link>
            </li>
            <li>
              <Link href={`/listing-list/?city=${order.listingCity}`}>
                <i className="flaticon-pin"></i>
                <span>{order.listingCity}</span>
              </Link>
            </li>
          </ul>
          <h3>
            <Link href={`/listing/${order.listingId}`}>
              {order.listingName}
            </Link>
          </h3>
        </div>

        <div className="listings-footer">
          <div className="d-flex justify-content-between align-items-center">
            <Link href={`/settings/orders/${order.id}`} className="default-btn">
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
