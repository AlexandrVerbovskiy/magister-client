import React, { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  checkStringDateLowerOrEqualCurrentDate,
  getDaysDifference,
  getFilePath,
  getListingImageByType,
  timeNormalConverter,
} from "../../utils";
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
import InputView from "../../components/FormComponents/InputView";
import TextareaView from "../../components/FormComponents/TextareaView";

const BaseDateSpan = ({
  startDate,
  endDate,
  className = "",
  tooltipText = null,
}) => {
  const Parent = ({ children }) => {
    if (tooltipText) {
      return (
        <div
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={tooltipText}
        >
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
      <div className="add-listings-box">
        <h3>Basic Informations</h3>

        <div className="row">
          <div className="col-lg-6 col-md-6">
            <InputView
              label="Listing Name:"
              icon="bx bx-briefcase-alt"
              placeholder="Name of tool"
              value={order.listingName}
            />
          </div>

          <div className="col-lg-6 col-md-6">
            <InputView
              label="Listing Category:"
              icon="bx bx-duplicate"
              placeholder="Category name of tool"
              value={order.listingCategoryName}
            />
          </div>

          <div className="col">
            <TextareaView
              value={order.listingDescription}
              icon="bx bx-text"
              label="How Item Is Stored:"
              placeholder="Details..."
            />
          </div>
        </div>
      </div>

      {order.listingImages.length > 0 && (
        <div className="add-listings-box">
          <h3>Listing Gallery</h3>
          <div className="row" style={{ gridRowGap: "10px" }}>
            {order.listingImages.map((image, index) => {
              const imgLink = getListingImageByType(image.link, image.type);

              return (
                <div
                  key={image.id}
                  className="col-xxl-3 col-lg-4 col-md-6"
                  style={{ cursor: "zoom-in" }}
                  onClick={() => setCurrentOpenImg(imgLink)}
                >
                  <div className="single-image-bpx form-group">
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
      )}

      <div className="add-listings-box">
        <h3>Listing Location</h3>

        <div className="row">
          <div className="col-lg-6 col-md-6">
            <InputView
              value={order.listingCity}
              label="City:"
              icon="bx bx-menu-alt-left"
              placeholder="Listing City"
            />
          </div>

          <div className="col-lg-6 col-md-6">
            <InputView
              label="Postcode:"
              icon="bx bx-menu-alt-left"
              placeholder="Listing Postcode"
              value={order.listingPostcode}
            />
          </div>

          <div className="col-12 mb-1">
            <InputView
              label="Address:"
              icon="bx bx-menu-alt-left"
              placeholder="Listing Address"
              value={order.listingAddress}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="form-group" style={{ height: "500px" }}>
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
            </div>
          </div>
        </div>
      </div>

      {isTenant && (
        <div className="add-listings-box">
          <h3>Listing Owner Details</h3>

          <div className="order-info-main-opponent-info mb-4">
            <div className="d-flex align-items-center">
              <img
                src={
                  order.ownerPhoto
                    ? getFilePath(order.ownerPhoto)
                    : STATIC.DEFAULT_PHOTO_LINK
                }
                alt={order.ownerName}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-6">
              <InputView
                label="Owner Name:"
                icon="bx bx-envelope"
                placeholder="Owner Name"
                value={order.ownerName}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Owner Email:"
                icon="bx bx-envelope"
                placeholder="Owner Email"
                value={order.ownerEmail}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Owner Phone:"
                icon="bx bx-phone-call"
                placeholder="Owner Phone"
                value={order.ownerPhone ? order.ownerPhone : "-"}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Owner Place Work:"
                icon="bx bx-building"
                placeholder="Owner Place Work"
                value={order.ownerPlaceWork ? order.ownerPlaceWork : "-"}
              />
            </div>
          </div>
        </div>
      )}

      {isOwner && (
        <div className="add-listings-box">
          <h3>Rental Details</h3>

          <div className="order-info-main-opponent-info mb-4">
            <div className="d-flex align-items-center">
              <img
                src={
                  order.tenantPhoto
                    ? getFilePath(order.tenantPhoto)
                    : STATIC.DEFAULT_PHOTO_LINK
                }
                alt={order.tenantName}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-6">
              <InputView
                label="Rental Name:"
                icon="bx bx-envelope"
                placeholder="Rental Name"
                value={order.tenantName}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Rental Email:"
                icon="bx bx-envelope"
                placeholder="Rental Email"
                value={order.tenantEmail}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Rental Phone:"
                icon="bx bx-phone-call"
                placeholder="Rental Phone"
                value={order.tenantPhone ? order.tenantPhone : "-"}
              />
            </div>

            <div className="col">
              <InputView
                label="Rental Place Work:"
                icon="bx bx-building"
                placeholder="Rental Place Work"
                value={order.tenantPlaceWork ? order.tenantPlaceWork : "-"}
              />
            </div>
          </div>
        </div>
      )}

      {!actualUpdateRequest && (
        <div className="row listings-sidebar" style={{ marginTop: 0 }}>
          <div className="col form-group">
            <div className="listings-widget order_widget  order-proposal-info">
              <h3>Proposal Info</h3>

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
                  <li>Offer price per day: ${order.offerPricePerDay}</li>
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
                  order.status != STATIC.ORDER_STATUSES.PENDING_TENANT) && (
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
          </div>
        </div>
      )}

      {actualUpdateRequest && (
        <div className="row listings-sidebar" style={{ marginTop: 0 }}>
          <div className="col col-12 col-md-6 form-group">
            <div className="listings-widget order_widget order-proposal-info">
              <h3>{isOwner ? "Rental" : "Owner"} Proposal Info</h3>

              <ul style={{ listStyle: "none", padding: "0" }}>
                <li>Offer price per day: ${prevUpdateRequest.pricePerDay}</li>

                <li>
                  <BaseDateSpan
                    startDate={prevUpdateRequest.startDate}
                    endDate={prevUpdateRequest.endDate}
                  />
                </li>

                <li>Fee: {order.fee}%</li>

                {prevUpdateRequest.pricePerDay != order.listingPricePerDay && (
                  <li>
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

          <div className="col col-12 col-md-6 mt-4 mt-md-0 form-group">
            <div className="listings-widget order_widget order-proposal-info">
              <h3>Your Proposal</h3>

              <ul style={{ listStyle: "none", padding: "0" }}>
                <li>
                  Offer price per day: ${actualUpdateRequest.newPricePerDay}
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
                  <li>
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
          <div
            className="add-listings-box listings-sidebar listings-widget order_widget"
            style={{ marginTop: 0 }}
          >
            <h3>Conflict Bookings/Orders</h3>

            <ul
              className="conflicted-orders"
              style={{ listStyle: "none", padding: "0" }}
            >
              {conflictOrders.map((conflictOrder) => {
                const tenantName = conflictOrder.tenantName;
                const tenantId = conflictOrder.tenantId;

                const startDate =
                  conflictOrder.newStartDate ?? conflictOrder.offerStartDate;

                const endDate =
                  conflictOrder.newEndDate ?? conflictOrder.offerEndDate;

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
                  <li className="form-group">
                    <div className="d-flex justify-content-between">
                      <div>
                        Id:{" "}
                        <a href={`/settings/orders/${conflictOrder.id}`}>
                          #{conflictOrder.id}
                        </a>
                      </div>

                      <a href={`/settings/orders/${conflictOrder.id}`}>
                        <StatusBlock
                          status={conflictOrder.status}
                          statusCancelled={conflictOrder.cancelStatus}
                          ownerId={conflictOrder.ownerId}
                          tenantId={conflictOrder.tenantId}
                          userId={sessionUser.userId}
                          dopClass="order-status-small-span"
                        />
                      </a>
                    </div>

                    <div>Type: {isBooking ? "Booking" : "Order"}</div>

                    <div>
                      Rental: <a href={`/users/${tenantId}`}>{tenantName}</a>
                    </div>

                    <div>
                      <BaseDateSpan startDate={startDate} endDate={endDate} />
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

      {((isOwner && order.status == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
        (isTenant && order.status == STATIC.ORDER_STATUSES.PENDING_TENANT)) && (
        <div className="order_widget add-listings-box">
          <h3>Booking operations</h3>
          <div className="booking-operations form-group">
            {((actualUpdateRequest &&
              !checkStringDateLowerOrEqualCurrentDate(
                actualUpdateRequest.newStartDate
              )) ||
              (!actualUpdateRequest &&
                !checkStringDateLowerOrEqualCurrentDate(
                  order.offerStartDate
                ))) &&
              (!conflictOrders || conflictOrders.length < 1) && (
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
              setUpdateRequestModalActive={setUpdateRequestModalActive}
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
        order.status == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT &&
        order.tenantId == sessionUser.userId && (
          <div className="order_widget add-listings-box">
            <h3>Payment</h3>

            <div className="booking-operations form-group">
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
    </>
  );
};

export default OrderContent;
