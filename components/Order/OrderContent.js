import React, { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  checkStringDateLowerOrEqualCurrentDate,
  getDaysDifference,
  getFilePath,
  getListingImageByType,
  moneyFormat,
  timeNormalConverter,
} from "../../utils";
import ImagePopup from "../_App/ImagePopup";
import MultyMarkersMap from "../Listings/MultyMarkersMap";
import STATIC from "../../static";
import {
  approveClientGotListing,
  finishedByOwner,
  orderCancelByOwner,
  orderCancelByTenant,
  orderFullCancel,
  orderFullCancelPayed,
  paypalCreateOrder,
  paypalOrderPayed,
  rejectOrder,
  orderAcceptCancelByTenant,
  orderAcceptCancelByOwner,
} from "../../services";
import ErrorBlockMessage from "../_App/ErrorBlockMessage";
import StatusBlock from "../Listings/StatusBlock";
import InputView from "../../components/FormComponents/InputView";
import TextareaView from "../../components/FormComponents/TextareaView";
import PaypalTriggerModal from "../PaypalTriggerModal";
import CreateDisputeTriggerModal from "./CreateDisputeTriggerModal";
import CancelTriggerModal from "./CancelTriggerModal";
import BookingAgreementPanel from "./BookingAgreementPanel";
import TenantGotListingApproveTriggerModal from "./TenantGotListingApproveTriggerModal";
import FinishOrderTriggerModal from "./FinishOrderTriggerModal";

const bookingStatuses = [
  STATIC.ORDER_STATUSES.REJECTED,
  STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
  STATIC.ORDER_STATUSES.PENDING_OWNER,
  STATIC.ORDER_STATUSES.PENDING_TENANT,
];

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
  ownerBaseCommissionPercent,
  blockedDates,
  conflictOrders = null,
  canAcceptTenantListing = false,
  canAcceptOwnerListing = false,
  authToken,
  acceptListingTenantToken = null,
  acceptListingOwnerToken = null,
  canFastCancelPayed = false,
  canFinalization = false,
}) => {
  const { success, error, sessionUser } = useContext(IndiceContext);
  const [order, setOrder] = useState(baseOrder);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const closeCurrentOpenImg = () => setCurrentOpenImg(null);

  const [isOwner, setIsOwner] = useState(true);
  const [isTenant, setIsTenant] = useState(true);

  const [prevUpdateRequest, setPrevUpdateRequest] = useState(null);
  const [actualUpdateRequest, setActualUpdateRequest] = useState(null);

  console.log(prevUpdateRequest);
  console.log(actualUpdateRequest);

  const isBookingWithoutAgreement =
    (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
      order.status == STATIC.ORDER_STATUSES.PENDING_TENANT) &&
    order.cancelStatus == null;

  const checkErrorData = (startDate) => {
    let tooltipErrorMessage = "";
    let blocked = false;

    if (isBookingWithoutAgreement) {
      if (checkStringDateLowerOrEqualCurrentDate(startDate)) {
        tooltipErrorMessage = "Order start date is overdue";
        blocked = true;
      }

      if (
        conflictOrders &&
        conflictOrders.length > 0 &&
        baseOrder.ownerId == sessionUser?.id
      ) {
        tooltipErrorMessage =
          "There are more priority bookings and orders for these dates";
        blocked = true;
      }
    }

    return { tooltipErrorMessage, blocked };
  };

  const CanBeErrorBaseDateSpan = ({ startDate, endDate }) => {
    const { tooltipErrorMessage, blocked } = checkErrorData(startDate);

    return (
      <BaseDateSpan
        startDate={startDate}
        endDate={endDate}
        className={blocked ? "error-span" : ""}
        tooltipText={tooltipErrorMessage}
      />
    );
  };

  const calculateCurrentTotalPayPrice = (pricePerDay, duration) =>
    (pricePerDay * duration * (100 + tenantBaseCommissionPercent)) / 100;

  const calculateCurrentTotalGetPrice = (pricePerDay, duration) =>
    (pricePerDay * duration * (100 - ownerBaseCommissionPercent)) / 100;

  const calculateCurrentTotalPrice = isOwner
    ? calculateCurrentTotalGetPrice
    : calculateCurrentTotalPayPrice;

  useEffect(() => {
    setIsOwner(order.ownerId == sessionUser?.id);
    setIsTenant(order.tenantId == sessionUser?.id);

    if (isBookingWithoutAgreement) {
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

  const onCreateUpdateRequest = async ({ price, fromDate, toDate }) => {
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
      senderId: sessionUser?.id,
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
      getDaysDifference(offerStartDate, offerEndDate)
    );

    const updatedFields = {
      offerPricePerDay,
      offerStartDate,
      offerEndDate,
      duration: getDaysDifference(offerStartDate, offerEndDate),
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

  const onTenantPayed = () => {
    success.set("Operation successful");
    setOrder((prev) => ({
      ...prev,
      status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
    }));
  };

  const onTenantGotListingApprove = async () => {
    try {
      const res = await approveClientGotListing(
        acceptListingTenantToken,
        authToken
      );

      setOrder((prev) => ({
        ...prev,
        ownerAcceptListingQrcode: res.qrCode,
        status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
      }));

      success.set("Approved successfully");
    } catch (e) {
      error.set(e.message);
    }
  };

  const onCreateDispute = async () => {
    try {
      if (isTenant) {
        await orderCancelByTenant(order.id, authToken);

        setOrder((prev) => ({
          ...prev,
          cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE,
        }));
      } else {
        await orderCancelByOwner(order.id, authToken);

        setOrder((prev) => ({
          ...prev,
          cancelStatus:
            STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE,
        }));
      }

      success.set(
        "Dispute created successfully. Wait for the administrator to contact you"
      );
    } catch (e) {
      error.set(e.message);
    }
  };

  const onOrderAcceptCancelByOwner = async () => {
    try {
      await orderAcceptCancelByOwner(order.id, authToken);

      success.set("Order cancelled successfully");

      setOrder((prev) => ({
        ...prev,
        cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
      }));
    } catch (e) {
      error.set(e.message);
    }
  };

  const onOrderAcceptCancelByTenant = async () => {
    try {
      await orderAcceptCancelByTenant(order.id, authToken);

      success.set("Order cancelled successfully");

      setOrder((prev) => ({
        ...prev,
        cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
      }));
    } catch (e) {
      error.set(e.message);
    }
  };

  const onCancel = async () => {
    try {
      if (isOwner) {
        await rejectOrder(order.id, authToken);

        setActualUpdateRequest(null);
        setPrevUpdateRequest(null);
        setUpdatedOffer(STATIC.ORDER_STATUSES.REJECTED);

        success.set("Order cancelled successfully");
      } else {
        await orderFullCancel(order.id, authToken);

        setOrder((prev) => ({
          ...prev,
          cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
        }));

        success.set("Order cancelled successfully");
      }
    } catch (e) {
      error.set(e.message);
    }
  };

  const onPayedFastCancel = async () => {
    try {
      await orderFullCancelPayed(order.id, authToken);

      success.set(
        `Order cancelled successfully. The money was returned to your paypal`
      );

      setOrder((prev) => ({
        ...prev,
        cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
      }));
    } catch (e) {
      error.set(e.message);
    }
  };

  const finishOrder = async () => {
    try {
      await finishedByOwner(acceptListingOwnerToken, authToken);

      success.set(
        `Order finished successfully. Thank you for using the platform`
      );

      setOrder((prev) => ({
        ...prev,
        status: STATIC.ORDER_STATUSES.FINISHED,
      }));
    } catch (e) {
      error.set(e.message);
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

      <div className="add-listings-box">
        <h3>Defects</h3>

        <div className="row">
          {order.defects.map((defect) => (
            <div className="col-12" key={defect.defectId}>
              <InputView value={defect.defectName} />
            </div>
          ))}
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
          <h3>Renter Details</h3>

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
                label="Renter Name:"
                icon="bx bx-envelope"
                placeholder="Renter Name"
                value={order.tenantName}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Renter Email:"
                icon="bx bx-envelope"
                placeholder="Renter Email"
                value={order.tenantEmail}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Renter Phone:"
                icon="bx bx-phone-call"
                placeholder="Renter Phone"
                value={order.tenantPhone ? order.tenantPhone : "-"}
              />
            </div>

            <div className="col">
              <InputView
                label="Renter Place Work:"
                icon="bx bx-building"
                placeholder="Renter Place Work"
                value={order.tenantPlaceWork ? order.tenantPlaceWork : "-"}
              />
            </div>
          </div>
        </div>
      )}

      {(order.cancelStatus != null || !actualUpdateRequest) && (
        <div className="row listings-sidebar" style={{ marginTop: 0 }}>
          <div className="col form-group">
            <div className="listings-widget order_widget  order-proposal-info">
              <h3>Proposal Info</h3>

              <ul style={{ listStyle: "none", padding: "0" }}>
                {isBookingWithoutAgreement &&
                  order.listingPricePerDay != order.offerPricePerDay && (
                    <li
                      style={
                        order.listingPricePerDay != order.offerPricePerDay
                          ? { textDecoration: "line-through" }
                          : {}
                      }
                    >
                      Listing price per day: $
                      {moneyFormat(order.listingPricePerDay)}
                    </li>
                  )}
                <li>
                  Offer price per day: ${moneyFormat(order.offerPricePerDay)}
                </li>
                <li>
                  <CanBeErrorBaseDateSpan
                    startDate={order.offerStartDate}
                    endDate={order.offerEndDate}
                  />
                </li>
                <li>
                  Fee:{" "}
                  {isOwner
                    ? ownerBaseCommissionPercent
                    : tenantBaseCommissionPercent}
                  %
                </li>
                {(order.status != STATIC.ORDER_STATUSES.PENDING_OWNER ||
                  order.status != STATIC.ORDER_STATUSES.PENDING_TENANT) && (
                  <li className="order-status">
                    Status:{" "}
                    <StatusBlock
                      status={order.status}
                      statusCancelled={order.cancelStatus}
                      ownerId={order.ownerId}
                      tenantId={order.tenantId}
                      userId={sessionUser?.id}
                      endDate={order.offerEndDate}
                    />
                  </li>
                )}
                {isBookingWithoutAgreement &&
                  order.offerPricePerDay != order.listingPricePerDay && (
                    <>
                      {isOwner && (
                        <li style={{ fontWeight: 700, textDecoration: "line-through" }}>
                          Price with listing price per day to get $
                          {moneyFormat(
                            calculateCurrentTotalPrice(
                              order.listingPricePerDay,
                              order.duration
                            )
                          )}
                        </li>
                      )}

                      {isTenant && (
                        <li style={{ fontWeight: 700, textDecoration: "line-through" }}>
                          Price with listing price per day to pay$
                          {moneyFormat(
                            calculateCurrentTotalPrice(
                              order.listingPricePerDay,
                              order.duration
                            )
                          )}
                        </li>
                      )}
                    </>
                  )}

                {isOwner && (
                  <li style={{ fontWeight: 700 }}>
                    Fact offer price to get: $
                    {moneyFormat(
                      calculateCurrentTotalPrice(
                        order.offerPricePerDay,
                        order.duration
                      )
                    )}
                  </li>
                )}

                {isTenant && (
                  <li style={{ fontWeight: 700 }}>
                    Fact offer price to pay: $
                    {moneyFormat(
                      calculateCurrentTotalPrice(
                        order.offerPricePerDay,
                        order.duration
                      )
                    )}
                  </li>
                )}
                {checkErrorData(order.offerStartDate).blocked && (
                  <li>
                    <ErrorBlockMessage>
                      {checkErrorData(order.offerStartDate).tooltipErrorMessage}
                    </ErrorBlockMessage>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {order.cancelStatus == null && actualUpdateRequest && (
        <div className="row listings-sidebar" style={{ marginTop: 0 }}>
          <div className="col col-12 col-md-6 form-group">
            <div className="listings-widget order_widget order-proposal-info">
              <h3>{isOwner ? "Rental" : "Owner"} Proposal Info</h3>

              <ul style={{ listStyle: "none", padding: "0" }}>
                <li>
                  Offer price per day: $
                  {moneyFormat(prevUpdateRequest.pricePerDay)}
                </li>

                <li>
                  <BaseDateSpan
                    startDate={prevUpdateRequest.startDate}
                    endDate={prevUpdateRequest.endDate}
                  />
                </li>

                <li>
                  Fee:{" "}
                  {isOwner
                    ? ownerBaseCommissionPercent
                    : tenantBaseCommissionPercent}
                  %
                </li>

                {isBookingWithoutAgreement &&
                  prevUpdateRequest.pricePerDay != order.listingPricePerDay && (
                    <li>
                      Price with listing price per day: $
                      {moneyFormat(
                        calculateCurrentTotalPrice(
                          order.listingPricePerDay,
                          getDaysDifference(
                            prevUpdateRequest.startDate,
                            prevUpdateRequest.endDate
                          )
                        )
                      )}
                    </li>
                  )}

                <li style={{ fontWeight: 700 }}>
                  Fact offer price {isOwner ? "to get" : "to pay"}: $
                  {moneyFormat(
                    calculateCurrentTotalPrice(
                      prevUpdateRequest.pricePerDay,
                      getDaysDifference(
                        prevUpdateRequest.startDate,
                        prevUpdateRequest.endDate
                      )
                    )
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
                  Offer price per day: $
                  {moneyFormat(actualUpdateRequest.newPricePerDay)}
                </li>

                <li>
                  <CanBeErrorBaseDateSpan
                    startDate={actualUpdateRequest.newStartDate}
                    endDate={actualUpdateRequest.newEndDate}
                  />
                </li>

                <li>
                  Fee:{" "}
                  {isOwner
                    ? ownerBaseCommissionPercent
                    : tenantBaseCommissionPercent}
                  %
                </li>

                {actualUpdateRequest.newPricePerDay !=
                  order.listingPricePerDay && (
                  <li>
                    Price {isOwner ? "to get" : "to pay"} with listing price per
                    day: $
                    {moneyFormat(
                      calculateCurrentTotalPrice(
                        order.listingPricePerDay,
                        getDaysDifference(
                          actualUpdateRequest.newStartDate,
                          actualUpdateRequest.newEndDate
                        )
                      )
                    )}
                  </li>
                )}

                <li style={{ fontWeight: 700 }}>
                  Fact offer price {isOwner ? "to get" : "to pay"}: $
                  {moneyFormat(
                    calculateCurrentTotalPrice(
                      actualUpdateRequest.newPricePerDay,
                      getDaysDifference(
                        actualUpdateRequest.newStartDate,
                        actualUpdateRequest.newEndDate
                      )
                    )
                  )}
                </li>

                {checkErrorData(actualUpdateRequest.newStartDate).blocked && (
                  <li>
                    <ErrorBlockMessage>
                      {
                        checkErrorData(actualUpdateRequest.newStartDate)
                          .tooltipErrorMessage
                      }
                    </ErrorBlockMessage>
                  </li>
                )}
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
                  getDaysDifference(startDate, endDate)
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
                        <a
                          href={
                            bookingStatuses.includes(conflictOrder.status)
                              ? `/dashboard/bookings/${conflictOrder.id}`
                              : `/dashboard/orders/${conflictOrder.id}`
                          }
                        >
                          #{conflictOrder.id}
                        </a>
                      </div>

                      <a
                        href={
                          bookingStatuses.includes(conflictOrder.status)
                            ? `/dashboard/bookings/${conflictOrder.id}`
                            : `/dashboard/orders/${conflictOrder.id}`
                        }
                      >
                        <StatusBlock
                          status={conflictOrder.status}
                          statusCancelled={conflictOrder.cancelStatus}
                          ownerId={conflictOrder.ownerId}
                          tenantId={conflictOrder.tenantId}
                          userId={sessionUser?.id}
                          dopClass="order-status-small-span"
                          endDate={order.offerEndDate}
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

                    <div>Price per day: ${moneyFormat(pricePrice)}</div>

                    <div>
                      <b>
                        Total price {isOwner ? "to get" : "to pay"}: $
                        {moneyFormat(totalPrice)}
                      </b>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

      {order.cancelStatus == null && (
        <>
          {((isOwner && order.status == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
            (isTenant &&
              order.status == STATIC.ORDER_STATUSES.PENDING_TENANT)) && (
            <BookingAgreementPanel
              onCreateUpdateRequest={onCreateUpdateRequest}
              acceptView={
                ((actualUpdateRequest &&
                  !checkStringDateLowerOrEqualCurrentDate(
                    actualUpdateRequest.newStartDate
                  )) ||
                  (!actualUpdateRequest &&
                    !checkStringDateLowerOrEqualCurrentDate(
                      order.offerStartDate
                    ))) &&
                (!conflictOrders || conflictOrders.length < 1)
              }
              listingName={order.listingName}
              blockedDates={blockedDates}
              listingPricePerDay={order.listingPricePerDay}
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
              listingMinRentalDays={order.listingMinRentalDays}
              fee={
                order.status == STATIC.ORDER_STATUSES.PENDING_OWNER
                  ? ownerBaseCommissionPercent
                  : tenantBaseCommissionPercent
              }
              commissionType={
                order.status == STATIC.ORDER_STATUSES.PENDING_OWNER
                  ? "reject"
                  : "sum"
              }
              setUpdatedOffer={setUpdatedOffer}
              setActualUpdateRequest={setActualUpdateRequest}
              setPrevUpdateRequest={setPrevUpdateRequest}
              orderId={order.id}
              ownerId={order.ownerId}
            />
          )}

          {((isOwner &&
            [
              STATIC.ORDER_STATUSES.PENDING_TENANT,
              STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
            ].includes(order.status)) ||
            (isTenant &&
              order.status == STATIC.ORDER_STATUSES.PENDING_OWNER)) && (
            <div className="order_widget add-listings-box">
              <h3>Operations</h3>
              <div className="booking-operations form-group">
                <CancelTriggerModal onCancel={onCancel} />
              </div>
            </div>
          )}

          {order.status == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT &&
            isTenant && (
              <div className="order_widget add-listings-box">
                <h3>Operations</h3>

                <div className="booking-operations form-group">
                  <PaypalTriggerModal
                    amount={calculateCurrentTotalPrice(
                      order.offerPricePerDay,
                      order.duration
                    )}
                    createOrderRequest={paypalCreateOrder}
                    approveOrderRequest={paypalOrderPayed}
                    authToken={authToken}
                    orderId={order.id}
                    listingName={order.listingName}
                    onTenantPayed={onTenantPayed}
                    offerFee={tenantBaseCommissionPercent}
                    listingPricePerDay={order.listingPricePerDay}
                    offerStartDate={order.offerStartDate}
                    offerEndDate={order.offerEndDate}
                  />

                  <CancelTriggerModal onCancel={onCancel} />
                </div>
              </div>
            )}

          {order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT &&
            isOwner && (
              <div className="order_widget add-listings-box">
                <h3>Renters QR code to confirm acceptance of the tool</h3>

                <div className="booking-operations form-group">
                  <img
                    width="200px"
                    height="200px"
                    src={`${order.tenantAcceptListingQrcode}`}
                  />
                </div>
              </div>
            )}

          {order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER &&
            isTenant && (
              <div className="order_widget add-listings-box">
                <h3>Owners QR code to confirm acceptance of the tool</h3>

                <div className="booking-operations form-group">
                  <img
                    width="200px"
                    height="200px"
                    src={`${order.ownerAcceptListingQrcode}`}
                  />
                </div>
              </div>
            )}

          {order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT && (
            <>
              {isTenant && (
                <>
                  <div className="order_widget add-listings-box">
                    <h3>Operations</h3>

                    <div className="booking-operations form-group">
                      {canAcceptTenantListing ? (
                        <TenantGotListingApproveTriggerModal
                          onApprove={onTenantGotListingApprove}
                        />
                      ) : (
                        <></>
                      )}

                      {canFastCancelPayed ? (
                        <CancelTriggerModal onCancel={onPayedFastCancel} />
                      ) : (
                        <CreateDisputeTriggerModal
                          onCreateDispute={onCreateDispute}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}

              {isOwner && (
                <>
                  <div className="order_widget add-listings-box">
                    <h3>Operations</h3>

                    <div className="booking-operations form-group">
                      <CreateDisputeTriggerModal
                        onCreateDispute={onCreateDispute}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER && (
            <div className="order_widget add-listings-box">
              <h3>Operations</h3>
              <div className="booking-operations form-group">
                {isOwner && /*canFinalization &&*/ canAcceptOwnerListing && (
                  <FinishOrderTriggerModal onFinish={finishOrder} />
                )}
                <CreateDisputeTriggerModal onCreateDispute={onCreateDispute} />
              </div>
            </div>
          )}
        </>
      )}

      {isOwner &&
        order.cancelStatus ==
          STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE && (
          <div className="order_widget add-listings-box">
            <h3>Operations</h3>
            <div className="booking-operations form-group">
              <CancelTriggerModal onCancel={onOrderAcceptCancelByOwner} />
            </div>
          </div>
        )}

      {isTenant &&
        order.cancelStatus ==
          STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE && (
          <div className="order_widget add-listings-box">
            <h3>Operations</h3>
            <div className="booking-operations form-group">
              <CancelTriggerModal onCancel={onOrderAcceptCancelByTenant} />
            </div>
          </div>
        )}
    </>
  );
};

export default OrderContent;
