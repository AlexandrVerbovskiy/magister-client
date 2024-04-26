import Link from "next/link";
import { getListingImageByType } from "../../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import StatusBlock from "./StatusBlock";

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
            <Link href={order.link} className="link-btn"></Link>
          )}

          {images.length == 1 && (
            <>
              <img
                src={getListingImageByType(images[0].link, images[0].type)}
                alt={order.listingName}
              />
              <Link href={order.link} className="link-btn"></Link>
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
                    <Link href={order.link} className="link-btn"></Link>
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
          dopClass="listing-card-status"
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
            <Link href={order.link} className="default-btn">
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
