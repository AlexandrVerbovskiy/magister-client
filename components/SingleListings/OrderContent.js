import React, { useContext, useEffect, useRef, useState } from "react";
import ClipboardJS from "clipboard";
import { IndiceContext } from "../../contexts";
import {
  getFilePath,
  getListingImageByType,
  timeNormalConverter,
} from "../../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import ImagePopup from "../_App/ImagePopup";
import MultyMarkersMap from "../../components/Listings/MultyMarkersMap";

import STATIC from "../../static";

const OrderContent = ({ order, tenantBaseCommissionPercent }) => {
  const { success, error, sessionUser } = useContext(IndiceContext);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const closeCurrentOpenImg = () => setCurrentOpenImg(null);
  const [requestsModalActive, setRequestsModalActive] = useState(false);

  const calculateCurrentTotalPrice = (pricePerDay, duration, fee) => {
    return (pricePerDay * duration * (100 + fee)) / 100;
  };

  return (
    <>
      <section className="listings-details-area pb-70">
        <div className="listings-details-image">
          <Swiper
            loop={true}
            autoplay={{
              delay: 8000,
            }}
            modules={[Autoplay]}
          >
            {order.listingImages.map((image) => (
              <SwiperSlide key={image.link}>
                <img
                  src={getListingImageByType(image.link, image.type)}
                  alt="image"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="container">
            <div className="container">
              <div className="listings-details-content">
                {order.categoryInfo.map((category, index) => (
                  <span
                    className="meta"
                    key={category.name}
                    style={index > 0 ? { marginLeft: "10px" } : {}}
                  >
                    <i className="flaticon-furniture-and-household"></i>
                    {category.name}
                  </span>
                ))}

                <h3>{order.listingName}</h3>

                <ul className="d-flex align-items-center">
                  <li className="location">
                    <i className="bx bx-map"></i>
                    <span>City</span>
                    {order.listingCity}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12">
              <div className="listings-details-desc">
                <h3>{order.listingName}</h3>
                <p>{order.listingDescription}</p>

                <h3>Gallery</h3>
                <div id="gallery">
                  <div
                    className="row justify-content-center"
                    style={{ gridRowGap: "10px" }}
                  >
                    {order.listingImages.map((image, index) => {
                      const imgLink = getListingImageByType(
                        image.link,
                        image.type
                      );

                      return (
                        <div
                          key={image.id}
                          className="col-lg-4 col-md-6"
                          style={{ cursor: "zoom-in" }}
                          onClick={() => setCurrentOpenImg(imgLink)}
                        >
                          <div className="single-image-bpx">
                            <img
                              src={imgLink}
                              alt={`${order.listingName} image ${index}`}
                            />
                          </div>
                        </div>
                      );
                    })}

                    <ImagePopup
                      photoUrl={currentOpenImg}
                      open={currentOpenImg}
                      close={closeCurrentOpenImg}
                    />
                  </div>
                </div>

                <div className="listings-sidebar">
                  <div className="listings-widget order_widget">
                    <h3>Booking Info</h3>

                    <ul style={{ listStyle: "none", padding: "0" }}>
                      <li>Min rental: {order.listingMinRentalDays} days</li>

                      <li
                        style={
                          order.listingPricePerDay != order.offerPricePerDay
                            ? { textDecoration: "line-through" }
                            : {}
                        }
                      >
                        Listing price per day: ${order.listingPricePerDay}
                      </li>

                      {order.listingPricePerDay != order.offerPricePerDay && (
                        <li>Offer price per day: ${order.offerPricePerDay}</li>
                      )}

                      {timeNormalConverter(order.offerStartDate) ===
                      timeNormalConverter(order.offerEndDate) ? (
                        <>
                          <li>
                            Rental date:{" "}
                            {timeNormalConverter(order.offerStartDate)}
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            Rental duration:{" "}
                            {timeNormalConverter(order.offerStartDate)} -{" "}
                            {timeNormalConverter(order.offerEndDate)}
                          </li>
                        </>
                      )}

                      <li>Fee: {order.fee}%</li>

                      {order.offerPricePerDay != order.listingPricePerDay && (
                        <li style={{ fontWeight: 700 }}>
                          Price with listing price per day: $
                          {calculateCurrentTotalPrice(
                            order.listingPricePerDay,
                            order.duration,
                            tenantBaseCommissionPercent
                          )}
                        </li>
                      )}

                      <li style={{ fontWeight: 700 }}>
                        Fact offer price: $
                        {calculateCurrentTotalPrice(
                          order.offerPricePerDay,
                          order.duration,
                          tenantBaseCommissionPercent
                        )}
                      </li>
                    </ul>
                  </div>

                  <div className="listings-widget order_widget">
                    <h3>Booking operations</h3>

                    <div className="booking-operations">
                      <button className="default-btn" type="button">
                        Accept
                      </button>
                      <button className="default-btn" type="button">
                        Reject
                      </button>
                      <button className="default-btn" type="button">
                        Offer other terms
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-12">
              <div className="listings-sidebar">
                <div className="listings-widget listings_contact_details">
                  <h3>Location</h3>
                  <ul>
                    <li>
                      <i className="bx bx-map" style={{ marginTop: "0px" }}></i>{" "}
                      {order.listingCity}
                    </li>

                    {order.listingAddress && (
                      <li>
                        <i
                          className="bx bx-map"
                          style={{ marginTop: "0px" }}
                        ></i>{" "}
                        {order.listingAddress}
                      </li>
                    )}
                    <li style={{ height: "400px", paddingLeft: "0" }}>
                      <MultyMarkersMap
                        markers={[
                          {
                            id: 1,
                            lat: order.listingRentalLat,
                            lng: order.listingRentalLng,
                            radius: order.listingRentalRadius,
                          },
                        ]}
                        baseCenter={{
                          lat: order.listingRentalLat,
                          lng: order.listingRentalLng,
                        }}
                        userLocation={userLocation}
                        setUserLocation={setUserLocation}
                        center={mapCenter}
                        setCenter={setMapCenter}
                      />
                    </li>
                  </ul>
                </div>

                <div className="listings-sidebar">
                  {order.tenantId == sessionUser.id && (
                    <div className="listings-widget listings_contact_details listings_author">
                      <h3>Listing Owner Details</h3>

                      <div className="author mb-4">
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              order.ownerPhoto
                                ? getFilePath(order.ownerPhoto)
                                : STATIC.defaultPhotoLink
                            }
                            alt={order.ownerName}
                          />
                          <div className="title">
                            <h4>
                              <a href="#">{order.ownerName}</a>
                            </h4>
                          </div>
                        </div>
                      </div>

                      <ul>
                        <li>
                          <i className="bx bx-envelope"></i>
                          <a href="#">{order.ownerEmail}</a>
                        </li>
                        <li>
                          <i className="bx bx-phone-call"></i>
                          <a href="tel:+2122791456">
                            {order.ownerPhone ? order.ownerPhone : "-"}
                          </a>
                        </li>
                        <li style={{ paddingBottom: "14px" }}>
                          <i className="bx bx-building"></i>
                          <a href="#">
                            {order.ownerPlaceWork ? order.ownerPlaceWork : "-"}
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}

                  {order.ownerId == sessionUser.id && (
                    <div className="listings-widget listings_contact_details listings_author">
                      <h3>Tenant Details</h3>

                      <div className="author mb-4">
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              order.tenantPhoto
                                ? getFilePath(order.tenantPhoto)
                                : STATIC.defaultPhotoLink
                            }
                            alt={order.tenantName}
                          />
                          <div className="title">
                            <h4>
                              <a href="#">{order.tenantName}</a>
                            </h4>
                          </div>
                        </div>
                      </div>

                      <ul>
                        <li>
                          <i className="bx bx-envelope"></i>
                          <a href="#">{order.tenantEmail}</a>
                        </li>
                        <li>
                          <i className="bx bx-phone-call"></i>
                          <a href="tel:+2122791456">
                            {order.tenantPhone ? order.tenantPhone : "-"}
                          </a>
                        </li>
                        <li style={{ paddingBottom: "14px" }}>
                          <i className="bx bx-building"></i>
                          <a href="#">
                            {order.tenantPlaceWork
                              ? order.tenantPlaceWork
                              : "-"}
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderContent;
