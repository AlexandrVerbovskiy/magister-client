import React, { useContext, useEffect, useRef, useState } from "react";
import ClipboardJS from "clipboard";
import { IndiceContext } from "../../contexts";
import {
  checkStringDateHigherOrEqualCurrentDate,
  getDaysDifference,
  getFilePath,
  getListingImageByType,
  separateDate,
  timeNormalConverter,
} from "../../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import ImagePopup from "../_App/ImagePopup";
import MultyMarkersMap from "../../components/Listings/MultyMarkersMap";

import STATIC from "../../static";
import CreateUpdateOrderRequestModal from "./CreateUpdateOrderRequestModal";
import { createOrderUpdateRequest } from "../../services";
import YesNoModal from "../_App/YesNoModal";

const OrderContent = ({ order, tenantBaseCommissionPercent }) => {
  const { success, error, sessionUser } = useContext(IndiceContext);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [updateRequestModalActive, setUpdateRequestModalActive] =
    useState(false);
  const [orderStatus, setOrderStatus] = useState(
    STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER
  );

  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const closeCurrentOpenImg = () => setCurrentOpenImg(null);

  const [isOwner, setIsOwner] = useState(true);
  const [isTenant, setIsTenant] = useState(true);

  const [prevUpdateRequest, setPrevUpdateRequest] = useState(null);
  const [actualUpdateRequest, setActualUpdateRequest] = useState(null);
  const [acceptOrderModalActive, setAcceptOrderModalActive] = useState(null);
  const [rejectOrderModalActive, setRejectOrderModalActive] = useState(null);

  const calculateCurrentTotalPrice = (pricePerDay, duration, fee) =>
    (pricePerDay * duration * (100 + fee)) / 100;

  const handleActivateCreateRequest = () => {
    setUpdateRequestModalActive(true);
  };

  const handleAcceptOrder = () => {
    setAcceptOrderModalActive(true);
  };

  const handleRejectOrder = () => {
    setRejectOrderModalActive(true);
  };

  useEffect(() => {
    setIsOwner(order.ownerId == sessionUser.id);
    setIsTenant(order.tenantId == sessionUser.id);
    setOrderStatus(order.status);

    if (order.previousUpdateRequest) {
      setPrevUpdateRequest(order.previousUpdateRequest);
    } else {
      if (order.actualUpdateRequest) {
        setPrevUpdateRequest({
          senderId: order.tenantId,
          startDate: order.startDate,
          endDate: order.endDate,
          pricePerDay: order.offerPricePerDay,
        });
      }
    }

    setActualUpdateRequest(order.actualUpdateRequest);
  }, [order.id]);

  const handleCreateUpdateRequest = async ({ price, fromDate, toDate }) => {
    try {
      setUpdateRequestModalActive(false);

      if (isOwner) {
        setOrderStatus(STATIC.ORDER_STATUSES.PENDING_TENANT);
      } else {
        setOrderStatus(STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER);
      }

      const request = await createOrderUpdateRequest(
        {
          orderId: order.id,
          newStartDate: fromDate,
          newEndDate: toDate,
          newPricePerDay: price,
        },
        authToken
      );

      if (actualUpdateRequest) {
        setPrevUpdateRequest({
          senderId: actualUpdateRequest.senderId,
          startDate: actualUpdateRequest.newStartDate,
          endDate: actualUpdateRequest.newEndDate,
          pricePerDay: actualUpdateRequest.newPricePerDay,
        });
      } else {
        setPrevUpdateRequest({
          senderId: order.tenantId,
          startDate: order.offerStartDate,
          endDate: order.offerEndDate,
          pricePerDay: order.offerPricePerDay,
        });
      }

      setActualUpdateRequest({
        senderId: sessionUser.userId,
        newStartDate: fromDate,
        newEndDate: toDate,
        newPricePerDay: price,
      });

      success.set(
        "Booking updates successfully. Wait for a response from the " +
          (isOwner ? "tenant" : "owner")
      );
    } catch (e) {
      error.set(e);
    }
  };

  const handleAcceptAcceptOrder = async () => {};

  const handleAcceptRejectOrder = async () => {};

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
                  {!actualUpdateRequest && (
                    <div className="listings-widget order_widget">
                      <h3>Booking Info</h3>

                      <ul style={{ listStyle: "none", padding: "0" }}>
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
                          <li>
                            Offer price per day: ${order.offerPricePerDay}
                          </li>
                        )}

                        {timeNormalConverter(order.offerStartDate) ===
                        timeNormalConverter(order.offerEndDate) ? (
                          <>
                            <li>
                              Rental date:{" "}
                              <span
                                className={
                                  checkStringDateHigherOrEqualCurrentDate(
                                    order.offerStartDate
                                  )
                                    ? ""
                                    : "error-span"
                                }
                              >
                                {timeNormalConverter(order.offerStartDate)}
                              </span>{" "}
                            </li>
                          </>
                        ) : (
                          <>
                            <li>
                              Rental duration:{" "}
                              <span
                                className={
                                  checkStringDateHigherOrEqualCurrentDate(
                                    order.offerStartDate
                                  )
                                    ? ""
                                    : "error-span"
                                }
                              >
                                {timeNormalConverter(order.offerStartDate)}
                              </span>{" "}
                              -{" "}
                              <span
                                className={
                                  checkStringDateHigherOrEqualCurrentDate(
                                    order.offerEndDate
                                  )
                                    ? ""
                                    : "error-span"
                                }
                              >
                                {timeNormalConverter(order.offerEndDate)}
                              </span>
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
                  )}

                  {actualUpdateRequest && (
                    <div className="row">
                      <div className="col col-12 col-md-6">
                        <div className="listings-widget order_widget">
                          <h3>{isOwner ? "Tenant" : "Owner"} Proposal Info</h3>

                          <ul style={{ listStyle: "none", padding: "0" }}>
                            <li
                              style={
                                order.listingPricePerDay !=
                                prevUpdateRequest.pricePerDay
                                  ? { textDecoration: "line-through" }
                                  : {}
                              }
                            >
                              Listing price per day: ${order.listingPricePerDay}
                            </li>

                            {order.listingPricePerDay !=
                              prevUpdateRequest.pricePerDay && (
                              <li>
                                Offer price per day: $
                                {prevUpdateRequest.pricePerDay}
                              </li>
                            )}

                            {timeNormalConverter(
                              prevUpdateRequest.startDate
                            ) ===
                            timeNormalConverter(prevUpdateRequest.endDate) ? (
                              <>
                                <li>
                                  Rental date:{" "}
                                  <span
                                    className={
                                      checkStringDateHigherOrEqualCurrentDate(
                                        prevUpdateRequest.startDate
                                      )
                                        ? ""
                                        : "error-span"
                                    }
                                  >
                                    {timeNormalConverter(
                                      prevUpdateRequest.startDate
                                    )}
                                  </span>{" "}
                                </li>
                              </>
                            ) : (
                              <>
                                <li>
                                  Rental duration:{" "}
                                  <span
                                    className={
                                      checkStringDateHigherOrEqualCurrentDate(
                                        prevUpdateRequest.startDate
                                      )
                                        ? ""
                                        : "error-span"
                                    }
                                  >
                                    {timeNormalConverter(
                                      prevUpdateRequest.startDate
                                    )}
                                  </span>{" "}
                                  -{" "}
                                  <span
                                    className={
                                      checkStringDateHigherOrEqualCurrentDate(
                                        prevUpdateRequest.endDate
                                      )
                                        ? ""
                                        : "error-span"
                                    }
                                  >
                                    {timeNormalConverter(
                                      prevUpdateRequest.endDate
                                    )}
                                  </span>
                                </li>
                              </>
                            )}

                            <li>Fee: {order.fee}%</li>

                            {prevUpdateRequest.pricePerDay !=
                              order.listingPricePerDay && (
                              <li style={{ fontWeight: 700 }}>
                                Price with listing price per day: $
                                {calculateCurrentTotalPrice(
                                  order.listingPricePerDay,
                                  getDaysDifference(
                                    prevUpdateRequest.startDate,
                                    prevUpdateRequest.endDate
                                  ),
                                  tenantBaseCommissionPercent
                                )}
                              </li>
                            )}

                            <li style={{ fontWeight: 700 }}>
                              Fact offer price: $
                              {calculateCurrentTotalPrice(
                                prevUpdateRequest.pricePerDay,
                                getDaysDifference(
                                  prevUpdateRequest.startDate,
                                  prevUpdateRequest.endDate
                                ),
                                tenantBaseCommissionPercent
                              )}
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="col col-12 col-md-6">
                        <div className="listings-widget order_widget">
                          <h3>Your Proposal</h3>

                          <ul style={{ listStyle: "none", padding: "0" }}>
                            <li
                              style={
                                order.listingPricePerDay !=
                                actualUpdateRequest.newPricePerDay
                                  ? { textDecoration: "line-through" }
                                  : {}
                              }
                            >
                              Listing price per day: ${order.listingPricePerDay}
                            </li>

                            {order.listingPricePerDay !=
                              actualUpdateRequest.newPricePerDay && (
                              <li>
                                Offer price per day: $
                                {actualUpdateRequest.newPricePerDay}
                              </li>
                            )}

                            {timeNormalConverter(
                              actualUpdateRequest.newStartDate
                            ) ===
                            timeNormalConverter(
                              actualUpdateRequest.newEndDate
                            ) ? (
                              <>
                                <li>
                                  Rental date:{" "}
                                  <span
                                    className={
                                      checkStringDateHigherOrEqualCurrentDate(
                                        actualUpdateRequest.newStartDate
                                      )
                                        ? ""
                                        : "error-span"
                                    }
                                  >
                                    {timeNormalConverter(
                                      actualUpdateRequest.newStartDate
                                    )}
                                  </span>{" "}
                                </li>
                              </>
                            ) : (
                              <>
                                <li>
                                  Rental duration:{" "}
                                  <span
                                    className={
                                      checkStringDateHigherOrEqualCurrentDate(
                                        actualUpdateRequest.newStartDate
                                      )
                                        ? ""
                                        : "error-span"
                                    }
                                  >
                                    {timeNormalConverter(
                                      actualUpdateRequest.newStartDate
                                    )}
                                  </span>{" "}
                                  -{" "}
                                  <span
                                    className={
                                      checkStringDateHigherOrEqualCurrentDate(
                                        actualUpdateRequest.newEndDate
                                      )
                                        ? ""
                                        : "error-span"
                                    }
                                  >
                                    {timeNormalConverter(
                                      actualUpdateRequest.newEndDate
                                    )}
                                  </span>
                                </li>
                              </>
                            )}

                            <li>Fee: {order.fee}%</li>

                            {actualUpdateRequest.newPricePerDay !=
                              order.listingPricePerDay && (
                              <li style={{ fontWeight: 700 }}>
                                Price with listing price per day: $
                                {calculateCurrentTotalPrice(
                                  order.listingPricePerDay,
                                  getDaysDifference(
                                    actualUpdateRequest.newStartDate,
                                    actualUpdateRequest.newEndDate
                                  ),
                                  tenantBaseCommissionPercent
                                )}
                              </li>
                            )}

                            <li style={{ fontWeight: 700 }}>
                              Fact offer price: $
                              {calculateCurrentTotalPrice(
                                actualUpdateRequest.newPricePerDay,
                                getDaysDifference(
                                  actualUpdateRequest.newStartDate,
                                  actualUpdateRequest.newEndDate
                                ),
                                tenantBaseCommissionPercent
                              )}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {((isOwner &&
                    orderStatus == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
                    (isTenant &&
                      orderStatus == STATIC.ORDER_STATUSES.PENDING_TENANT)) && (
                    <div className="listings-widget order_widget">
                      <h3>Booking operations</h3>

                      <div className="booking-operations">
                        {((actualUpdateRequest &&
                          checkStringDateHigherOrEqualCurrentDate(
                            actualUpdateRequest.newStartDate
                          )) ||
                          (!actualUpdateRequest &&
                            checkStringDateHigherOrEqualCurrentDate(
                              order.offerStartDate
                            ))) && (
                          <button
                            className="default-btn"
                            type="button"
                            onClick={handleAcceptOrder}
                          >
                            Accept
                          </button>
                        )}

                        <button
                          className="default-btn"
                          type="button"
                          onClick={handleRejectOrder}
                        >
                          Reject
                        </button>

                        <button
                          className="default-btn"
                          type="button"
                          onClick={handleActivateCreateRequest}
                        >
                          Offer other terms
                        </button>

                        <CreateUpdateOrderRequestModal
                          handleCreateUpdateRequest={handleCreateUpdateRequest}
                          price={order.listingPricePerDay}
                          proposalPrice={order.offerPricePerDay}
                          proposalStartDate={order.startDate}
                          proposalEndDate={order.endDate}
                          minRentalDays={order.listingMinRentalDays}
                          fee={tenantBaseCommissionPercent}
                          updateRequestModalActive={updateRequestModalActive}
                          setUpdateRequestModalActive={
                            setUpdateRequestModalActive
                          }
                          listingName={order.listingName}
                          blockedDates={order.blockedDates}
                        />

                        <YesNoModal
                          active={acceptOrderModalActive}
                          toggleActive={() => setAcceptOrderModalActive(false)}
                          title="Operation confirmation"
                          body="Confirm that the proposed booking conditions are actually suitable for you"
                          onAccept={handleAcceptAcceptOrder}
                          acceptText="Accept"
                        />
                        <YesNoModal
                          active={rejectOrderModalActive}
                          toggleActive={() => setRejectOrderModalActive(false)}
                          title="Operation confirmation"
                          body="Confirm that you really want to cancel the booking"
                          onAccept={handleAcceptRejectOrder}
                          acceptText="Accept"
                        />
                      </div>
                    </div>
                  )}
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
                  {isTenant && (
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

                  {isOwner && (
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
