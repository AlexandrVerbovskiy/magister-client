import Link from "next/link";
import { getListingImageByType } from "../../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import StatusBlock from "./StatusBlock";

/*const OrderItem = (order) => {
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
};*/

const OrderItem = (order) => {
  return (
    <tr>
      <td className="name">
        <img src="/images/user1.jpg" alt="image" />
        <div className="info">
          <span>James Anderson</span>
          <ul>
            <li>
              <a href="tel:+21444556521">+214 4455 6521</a>
            </li>
            <li>
              <a href="mailto:hello@james.com">hello@james.com</a>
            </li>
          </ul>
          <a href="mailto:hello@james.com" className="default-btn">
            <i className="bx bx-envelope"></i> Send Message
          </a>
        </div>
      </td>

      <td className="details">
        <h4>
          Farmis Hotel & Restaurant{" "}
          <span className="bookings-status pending">Pending</span>
        </h4>

        <ul>
          <li>
            <i className="bx bx-map"></i>
            <span>Address:</span>
            40 Journal Square, NG USA
          </li>
          <li>
            <i className="bx bx-calendar"></i>
            <span>Date:</span>
            20/05/2020
          </li>
          <li>
            <i className="bx bx-purchase-tag"></i>
            <span>Price:</span>
            $1500
          </li>
          <li>
            <i className="bx bx-group"></i>
            <span>Persons:</span>4 Peoples
          </li>
          <li>
            <i className="bx bx-credit-card-front"></i>
            <span>Payment:</span>
            <strong className="paid">Paid</strong> using Paypal
          </li>
        </ul>
      </td>

      <td className="action">
        <a href="#" className="default-btn">
          <i className="bx bx-check-circle"></i> Approve
        </a>
        <a href="#" className="default-btn danger">
          <i className="bx bx-x-circle"></i> Reject
        </a>
      </td>
    </tr>
  );
};

export default OrderItem;
