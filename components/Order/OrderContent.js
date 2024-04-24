import React, { useContext, useEffect, useRef, useState } from "react";
import ClipboardJS from "clipboard";
import { IndiceContext } from "../../contexts";
import {
  checkStringDateLowerOrEqualCurrentDate,
  getDaysDifference,
  getFilePath,
  getListingImageByType,
  timeNormalConverter,
} from "../../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import ImagePopup from "../_App/ImagePopup";
import MultyMarkersMap from "../Listings/MultyMarkersMap";

import STATIC from "../../static";
import CreateUpdateOrderRequestModal from "./CreateUpdateOrderRequestModal";
import {
  acceptOrder,
  createOrderUpdateRequest,
  rejectOrder,
} from "../../services";
import YesNoModal from "../_App/YesNoModal";
import StatusBlock from "../Listings/StatusBlock";

const BaseDateSpan = ({
  startDate,
  endDate,
  className = "",
  tooltipText = null,
}) => {
  const Parent = ({ children }) => {
    if (tooltipText) {
      return (
        <div dataBsToggle="tooltip" dataBsPlacement="top" title={tooltipText}>
          {children}
        </div>
      );
    }

    return <div>{children}</div>;
  };

  if (timeNormalConverter(startDate) === timeNormalConverter(endDate)) {
    return (
      <Parent>
        Rental date:{" "}
        <span className={className}>{timeNormalConverter(startDate)}</span>
      </Parent>
    );
  }

  return (
    <Parent>
      Rental duration:{" "}
      <span className={className}>{timeNormalConverter(startDate)}</span> -{" "}
      <span className={className}>{timeNormalConverter(endDate)}</span>
    </Parent>
  );
};

const OrderContent = ({
  order: baseOrder,
  tenantBaseCommissionPercent,
  blockedDates,
  conflictOrders = null,
}) => {
  const CanBeErrorBaseDateSpan = ({ startDate, endDate }) => {
    let tooltipErrorMessage = "";
    let blocked = false;

    if (checkStringDateLowerOrEqualCurrentDate(startDate)) {
      tooltipErrorMessage = "Order start date is overdue";
      blocked = true;
    }

    if (blockedDates && blockedDates.length > 0) {
      tooltipErrorMessage =
        "There are more priority bookings and orders for these dates";
      blocked = true;
    }

    return (
      <BaseDateSpan
        startDate={startDate}
        endDate={endDate}
        className={blocked ? "error-span" : ""}
        tooltipText={tooltipErrorMessage}
      />
    );
  };

  const { success, error, sessionUser, authToken } = useContext(IndiceContext);
  const [order, setOrder] = useState(baseOrder);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [updateRequestModalActive, setUpdateRequestModalActive] =
    useState(false);

  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const closeCurrentOpenImg = () => setCurrentOpenImg(null);

  const [isOwner, setIsOwner] = useState(true);
  const [isTenant, setIsTenant] = useState(true);

  const [prevUpdateRequest, setPrevUpdateRequest] = useState(null);
  const [actualUpdateRequest, setActualUpdateRequest] = useState(null);
  const [acceptOrderModalActive, setAcceptOrderModalActive] = useState(null);
  const [rejectOrderModalActive, setRejectOrderModalActive] = useState(null);
  const [disabled, setDisabled] = useState(false);

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

    if (
      order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
      order.status == STATIC.ORDER_STATUSES.PENDING_TENANT
    ) {
      if (order.previousUpdateRequest) {
        setPrevUpdateRequest(order.previousUpdateRequest);
      } else {
        if (order.actualUpdateRequest) {
          setPrevUpdateRequest({
            senderId: order.tenantId,
            startDate: order.offerStartDate,
            endDate: order.offerEndDate,
            pricePerDay: order.offerPricePerDay,
          });
        }
      }

      setActualUpdateRequest(order.actualUpdateRequest);
    }
  }, [order.id]);

  const handleCreateUpdateRequest = async ({ price, fromDate, toDate }) => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);
      setUpdateRequestModalActive(false);

      await createOrderUpdateRequest(
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

      if (isOwner) {
        setOrder((prev) => ({
          ...prev,
          status: STATIC.ORDER_STATUSES.PENDING_TENANT,
        }));
      } else {
        setOrder((prev) => ({
          ...prev,
          status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
        }));
      }

      success.set(
        "Booking updates successfully. Wait for a response from the " +
          (isOwner ? "tenant" : "owner")
      );
    } catch (e) {
      error.set(e);
    } finally {
      setDisabled(false);
    }
  };

  const setUpdatedOffer = (status, cancelStatus = null) => {
    const offerPricePerDay = actualUpdateRequest
      ? actualUpdateRequest.newPricePerDay
      : order.offerPricePerDay;
    const offerStartDate = actualUpdateRequest
      ? actualUpdateRequest.newStartDate
      : order.offerStartDate;
    const offerEndDate = actualUpdateRequest
      ? actualUpdateRequest.newEndDate
      : order.offerEndDate;

    const totalPrice = calculateCurrentTotalPrice(
      offerPricePerDay,
      getDaysDifference(offerStartDate, offerEndDate),
      tenantBaseCommissionPercent
    );

    const updatedFields = {
      offerPricePerDay,
      offerStartDate,
      offerEndDate,
      factTotalPrice: totalPrice,
    };

    if (status) {
      updatedFields["status"] = status;
    }

    if (cancelStatus) {
      updatedFields["cancelStatus"] = cancelStatus;
    }

    setOrder((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  const handleAcceptAcceptOrder = async () => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);

      await acceptOrder(order.id, authToken);

      setActualUpdateRequest(null);
      setPrevUpdateRequest(null);
      setUpdatedOffer(STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT);
    } finally {
      setDisabled(false);
    }
  };

  const handleAcceptRejectOrder = async () => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);

      await rejectOrder(order.id, authToken);

      setActualUpdateRequest(null);
      setPrevUpdateRequest(null);

      if (sessionUser.userId == order.ownerId) {
        setUpdatedOffer(STATIC.ORDER_STATUSES.REJECTED);
      } else {
        setUpdatedOffer(null, STATIC.ORDER_CANCELATION_STATUSES.CANCELED);
      }
    } finally {
      setDisabled(false);
    }
  };

  const handlePayClick = async () => {
    console.log("payed");

    if (disabled) {
      return;
    }

    try {
      setDisabled(true);
    } finally {
      setDisabled(false);
    }
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

                        <li>
                          <CanBeErrorBaseDateSpan
                            startDate={order.offerStartDate}
                            endDate={order.offerEndDate}
                          />
                        </li>

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

                        {(order.status != STATIC.ORDER_STATUSES.PENDING_OWNER ||
                          order.status !=
                            STATIC.ORDER_STATUSES.PENDING_TENANT) && (
                          <li className="order-status">
                            Status:{" "}
                            <StatusBlock
                              status={order.status}
                              statusCancelled={order.cancelStatus}
                              ownerId={order.ownerId}
                              tenantId={order.tenantId}
                              userId={sessionUser.userId}
                            />
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
                            <li>
                              Offer price per day: $
                              {prevUpdateRequest.pricePerDay}
                            </li>

                            <li>
                              <BaseDateSpan
                                startDate={prevUpdateRequest.startDate}
                                endDate={prevUpdateRequest.endDate}
                              />
                            </li>

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
                            <li>
                              Offer price per day: $
                              {actualUpdateRequest.newPricePerDay}
                            </li>

                            <li>
                              <CanBeErrorBaseDateSpan
                                startDate={actualUpdateRequest.newStartDate}
                                endDate={actualUpdateRequest.newEndDate}
                              />
                            </li>

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

                  {isOwner &&
                    conflictOrders &&
                    order.status == STATIC.ORDER_STATUSES.PENDING_OWNER &&
                    conflictOrders.length > 0 && (
                      <div className="listings-sidebar listings-widget order_widget">
                        <h3>Conflict Bookings/Orders</h3>

                        <ul style={{ listStyle: "none", padding: "0" }}>
                          {conflictOrders.map((conflictOrder) => {
                            const tenantName = conflictOrder.tenantName;
                            const tenantId = conflictOrder.tenantId;

                            const startDate =
                              conflictOrder.newStartDate ??
                              conflictOrder.offerStartDate;

                            const endDate =
                              conflictOrder.newEndDate ??
                              conflictOrder.offerEndDate;

                            const pricePrice =
                              conflictOrder.newPricePerDay ??
                              conflictOrder.offerPricePerDay;

                            const totalPrice = calculateCurrentTotalPrice(
                              pricePrice,
                              getDaysDifference(startDate, endDate),
                              tenantBaseCommissionPercent
                            );

                            const isBooking = [
                              STATIC.ORDER_STATUSES.FINISHED,
                              STATIC.ORDER_STATUSES.PENDING_TENANT,
                              STATIC.ORDER_STATUSES.PENDING_OWNER,
                              STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
                            ].includes(conflictOrder.status);

                            return (
                              <li>
                                <div className="d-flex justify-content-between">
                                  <div>
                                    Id:{" "}
                                    <a
                                      href={`/settings/orders/${conflictOrder.id}`}
                                    >
                                      #{conflictOrder.id}
                                    </a>
                                  </div>

                                  <a
                                    href={`/settings/orders/${conflictOrder.id}`}
                                  >
                                    <StatusBlock
                                      status={conflictOrder.status}
                                      statusCancelled={
                                        conflictOrder.cancelStatus
                                      }
                                      ownerId={conflictOrder.ownerId}
                                      tenantId={conflictOrder.tenantId}
                                      userId={sessionUser.userId}
                                      dopClass="order-status-small-span"
                                    />
                                  </a>
                                </div>

                                <div>
                                  Type: {isBooking ? "Booking" : "Order"}
                                </div>

                                <div>
                                  Tenant:{" "}
                                  <a href={`/users/${tenantId}`}>
                                    {tenantName}
                                  </a>
                                </div>

                                <div>
                                  <BaseDateSpan
                                    startDate={startDate}
                                    endDate={endDate}
                                  />
                                </div>

                                <div>Price per day: ${pricePrice}</div>

                                <div>
                                  <b>Total price: ${totalPrice}</b>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                  {((isOwner &&
                    order.status == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
                    (isTenant &&
                      order.status ==
                        STATIC.ORDER_STATUSES.PENDING_TENANT)) && (
                    <div className="listings-sidebar listings-widget order_widget">
                      <h3>Booking operations</h3>

                      <div className="booking-operations">
                        {((actualUpdateRequest &&
                          !checkStringDateLowerOrEqualCurrentDate(
                            actualUpdateRequest.newStartDate
                          )) ||
                          (!actualUpdateRequest &&
                            !checkStringDateLowerOrEqualCurrentDate(
                              order.offerStartDate
                            ))) && (
                          <button
                            className="default-btn"
                            type="button"
                            onClick={handleAcceptOrder}
                            disabled={disabled}
                          >
                            Accept
                          </button>
                        )}

                        <button
                          className="default-btn"
                          type="button"
                          onClick={handleRejectOrder}
                          disabled={disabled}
                        >
                          Reject
                        </button>

                        <button
                          className="default-btn"
                          type="button"
                          onClick={handleActivateCreateRequest}
                          disabled={disabled}
                        >
                          Offer other terms
                        </button>

                        <CreateUpdateOrderRequestModal
                          handleCreateUpdateRequest={handleCreateUpdateRequest}
                          price={order.listingPricePerDay}
                          proposalPrice={
                            actualUpdateRequest
                              ? actualUpdateRequest.newPricePerDay
                              : order.offerPricePerDay
                          }
                          proposalStartDate={
                            actualUpdateRequest
                              ? actualUpdateRequest.newStartDate
                              : order.offerStartDate
                          }
                          proposalEndDate={
                            actualUpdateRequest
                              ? actualUpdateRequest.newEndDate
                              : order.offerEndDate
                          }
                          minRentalDays={order.listingMinRentalDays}
                          fee={tenantBaseCommissionPercent}
                          updateRequestModalActive={updateRequestModalActive}
                          setUpdateRequestModalActive={
                            setUpdateRequestModalActive
                          }
                          listingName={order.listingName}
                          blockedDates={blockedDates}
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

                  {actualUpdateRequest &&
                    order.status ==
                      STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT &&
                    order.tenantId == sessionUser.userId && (
                      <div className="listings-sidebar listings-widget order_widget">
                        <h3>Payment</h3>

                        <div className="booking-operations">
                          <button
                            className="default-btn"
                            type="button"
                            onClick={handlePayClick}
                            disabled={disabled}
                          >
                            Pay by Stripe
                          </button>
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
                                : STATIC.DEFAULT_PHOTO_LINK
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
                                : STATIC.DEFAULT_PHOTO_LINK
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
