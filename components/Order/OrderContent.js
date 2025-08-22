import React, { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  autoCalculateCurrentTotalPrice,
  generateProfileFilePath,
  getDisputeTitle,
  getListingImageByType,
  getPriceByDays,
  moneyFormatVisual,
  ownerEarnFeeCalculate,
  renterPaysFeeCalculate,
} from "../../utils";
import ImagePopup from "../_App/ImagePopup";
import MultyMarkersMap from "../Listings/MultyMarkersMap";
import STATIC from "../../static";
import ErrorBlockMessage from "../_App/ErrorBlockMessage";
import StatusBlock from "../Listings/StatusBlock";
import InputView from "../../components/FormComponents/InputView";
import TextareaView from "../../components/FormComponents/TextareaView";
import {
  useOrderActions,
  useOrderDateError,
  useSingleOrderActions,
} from "../../hooks";
import StatusBar from "../StatusBar";
import SuccessIconPopup from "../../components/IconPopups/SuccessIconPopup";
import { useRouter } from "next/router";
import Link from "next/link";
import OrderPopups from "./OrderPopups";

const bookingStatuses = [
  STATIC.ORDER_STATUSES.REJECTED,
  STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT,
  STATIC.ORDER_STATUSES.PENDING_OWNER,
  STATIC.ORDER_STATUSES.PENDING_RENTER,
];

const OrderContent = ({
  order: baseOrder,
  renterBaseCommission,
  bankInfo,
  operationsDisabled = false,
}) => {
  const { error, sessionUser } = useContext(IndiceContext);
  const [order, setOrder] = useState(baseOrder);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [successIconPopupState, setSuccessIconPopupState] = useState({});

  const router = useRouter();

  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const closeCurrentOpenImg = () => setCurrentOpenImg(null);

  const [isOwner, setIsOwner] = useState(false);
  const [isRenter, setIsRenter] = useState(false);

  const [prevUpdateRequest, setPrevUpdateRequest] = useState(null);
  const [actualUpdateRequest, setActualUpdateRequest] = useState(null);

  const isBookingWithoutAgreement =
    order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
    order.status == STATIC.ORDER_STATUSES.PENDING_RENTER;

  const { CanBeErrorBaseDateSpan, checkErrorData } = useOrderDateError({
    order,
  });

  useEffect(() => {
    setOrder(baseOrder);
  }, [baseOrder?.id]);

  useEffect(() => {
    setIsOwner(order.ownerId == sessionUser?.id);
    setIsRenter(order.renterId == sessionUser?.id);

    if (isBookingWithoutAgreement) {
      if (order.previousUpdateRequest) {
        setPrevUpdateRequest(order.previousUpdateRequest);
      } else {
        if (order.actualUpdateRequest) {
          setPrevUpdateRequest({
            senderId: order.renterId,
            startDate: order.offerStartDate,
            finishDate: order.offerFinishDate,
            price: order.offerPrice,
          });
        }
      }

      setActualUpdateRequest(order.actualUpdateRequest);
    }
  }, [order.id]);

  const activateSuccessOrderPopup = ({
    closeButtonText = null,
    onClose = null,
    text = null,
    textWeight = null,
  }) => {
    const handleClose = () => {
      if (!onClose) {
        onClose = () => {
          router.push(
            `/dashboard/orders/?type=${
              sessionUser?.id == order.ownerId ? "owner" : "renter"
            }`
          );
        };
      }

      setSuccessIconPopupState({});
      onClose();
    };

    if (!closeButtonText) {
      if (bookingStatuses.includes(order.status)) {
        closeButtonText = "Move to Bookings";
      } else {
        closeButtonText = "Move to Orders";
      }
    }

    setSuccessIconPopupState({
      active: true,
      text,
      closeButtonText: closeButtonText,
      onClose: handleClose,
      textWeight: textWeight ?? 600,
    });
  };

  const localCalculateCurrentTotalPrice = ({
    price,
    startDate,
    finishDate,
    type = null,
  }) =>
    autoCalculateCurrentTotalPrice({
      price: getPriceByDays(price, startDate, finishDate),
      type,
      isOwner,
      ownerFee: order.ownerFee,
      renterFee: order.renterFee,
    });

  const onCreateUpdateRequest = ({ price, startDate, finishDate }) => {
    if (actualUpdateRequest) {
      setPrevUpdateRequest({
        senderId: actualUpdateRequest.senderId,
        finishDate: actualUpdateRequest.newFinishDate,
        startDate: actualUpdateRequest.newStartDate,
        price: actualUpdateRequest.newPrice,
      });
    } else {
      setPrevUpdateRequest({
        senderId: order.renterId,
        startDate: order.offerStartDate,
        finishDate: order.offerFinishDate,
        price: order.offerPrice,
      });
    }

    setActualUpdateRequest({
      senderId: sessionUser?.id,
      newPrice: price,
      newStartDate: startDate,
      newFinishDate: finishDate,
    });

    if (isOwner) {
      setOrder((prev) => ({
        ...prev,
        status: STATIC.ORDER_STATUSES.PENDING_RENTER,
      }));
    } else {
      setOrder((prev) => ({
        ...prev,
        status: STATIC.ORDER_STATUSES.PENDING_OWNER,
      }));
    }

    activateSuccessOrderPopup({
      text:
        "Conditions updates successfully. Wait for a response from the " +
        (isOwner ? "renter" : "owner"),
    });
  };

  const setUpdatedOffer = ({ status, cancelStatus = null }) => {
    const offerPrice = actualUpdateRequest
      ? actualUpdateRequest.newPrice
      : order.offerPrice;

    const offerStartDate = actualUpdateRequest
      ? actualUpdateRequest.newStartDate
      : order.offerStartDate;

    const offerFinishDate = actualUpdateRequest
      ? actualUpdateRequest.newFinishDate
      : order.offerFinishDate;

    const totalPrice = localCalculateCurrentTotalPrice({
      price: offerPrice,
      startDate: offerStartDate,
      finishDate: offerFinishDate,
    });

    const updatedFields = {
      offerPrice,
      factTotalPrice: totalPrice,
      requestId: null,
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

  const onRenterPayed = () => {
    activateSuccessOrderPopup({
      text: "Order started!",
      onClose: () => {},
      closeButtonText: "Return to Order",
    });

    setTimeout(() => {
      setOrder((prev) => ({
        ...prev,
        status: STATIC.ORDER_STATUSES.IN_PROCESS,
      }));
    }, 100);
  };

  const onCancel = () => {
    if (isOwner) {
      setActualUpdateRequest(null);
      setPrevUpdateRequest(null);
      setUpdatedOffer({ status: STATIC.ORDER_STATUSES.REJECTED });
    } else {
      setOrder((prev) => ({
        ...prev,
        cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
      }));
    }

    activateSuccessOrderPopup({
      text: "Booking cancelled successfully",
    });
  };

  const onPayedFastCancel = () => {
    activateSuccessOrderPopup({
      text: `Order cancelled successfully. A refund request has been sent to the administrator`,
    });

    setOrder((prev) => ({
      ...prev,
      cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
    }));
  };

  const onFinishOrder = () => {
    setOrder((prev) => ({
      ...prev,
      status: STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED,
    }));
  };

  const onAcceptFinishOrder = () => {
    setOrder((prev) => ({
      ...prev,
      status: STATIC.ORDER_STATUSES.FINISHED,
    }));
  };

  const currentFee = isOwner ? order.ownerFee : order.renterFee;
  const currentFeeCalculate = (price, startDate, finishDate, fee) =>
    isOwner
      ? ownerEarnFeeCalculate(getPriceByDays(price, startDate, finishDate), fee)
      : renterPaysFeeCalculate(
          getPriceByDays(price, startDate, finishDate),
          fee
        );

  const currentActionButtons = useOrderActions({
    order,
  });

  const statusBarStatuses = bookingStatuses.includes(order.status)
    ? [
        { title: "Make Booking", finished: true },
        {
          title: "Accepted",
          finished:
            order.status == STATIC.ORDER_STATUSES.PENDING_RENTER_PAYMENT,
        },
        {
          title: "Payment Confirmation",
          finished: order.paymentInfo?.adminApproved,
        },
        { title: "Paid" },
      ]
    : [
        { title: "Make Order", finished: true },
        {
          title: "Pending to Client",
          finished: [
            STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED,
            STATIC.ORDER_STATUSES.FINISHED,
          ].includes(order.status),
        },
        {
          title: "In Progress",
          finished: [STATIC.ORDER_STATUSES.FINISHED].includes(order.status),
        },
        {
          title: "Completed",
          finished: order.status == STATIC.ORDER_STATUSES.FINISHED,
        },
      ];

  const orderPopupsData = useSingleOrderActions({
    order,
    setUpdatedOffer,
    setActualUpdateRequest,
    setPrevUpdateRequest,
    onCreateUpdateRequest,
    onCancel,
    onPayedFastCancel,
    setError: error.set,
    onFinishOrder,
    onAcceptFinishOrder,
  });

  return (
    <>
      <StatusBar
        statuses={statusBarStatuses}
        hasCancelStatus={
          !!order.disputeStatus ||
          !!order.cancelStatus ||
          order.status == STATIC.ORDER_STATUSES.REJECTED ||
          (order.paymentInfo &&
            !order.paymentInfo?.adminApproved &&
            !order.paymentInfo?.waitingApproved)
        }
      />

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
              value={order.listingCategoryName ?? order.listingOtherCategory}
            />
          </div>

          <div className="row">
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
              open={!!currentOpenImg}
              close={closeCurrentOpenImg}
            />
          </div>
        </div>
      )}

      <div className="add-listings-box">
        <h3>Collection Location</h3>

        <div className="row">
          <div className="col-md-6">
            <div className="row">
              <div className="col-12 mb-1">
                <InputView
                  value={order.listingCity}
                  label="City:"
                  icon="bx bx-menu-alt-left"
                  placeholder="Listing City"
                />
              </div>

              <div className="col-12 mb-1">
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
          </div>

          <div className="col-md-6">
            <div className="row">
              <div className="col">
                <div
                  className="add-listings-box form-group px-0"
                  style={{ height: "300px" }}
                >
                  <MultyMarkersMap
                    markers={[
                      {
                        id: 1,
                        lat: order.listingRentalLat,
                        lng: order.listingRentalLng,
                        radius: order.listingRadius,
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
        </div>
      </div>

      {isRenter && (
        <div id="user-info" className="add-listings-box">
          <h3>Listing Owner Details</h3>

          <div className="order-info-main-opponent-info mb-4">
            <div className="d-flex align-items-center">
              <img
                src={generateProfileFilePath(order.ownerPhoto)}
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
          </div>
        </div>
      )}

      {isOwner && (
        <div id="user-info" className="add-listings-box">
          <h3>Renter Details</h3>

          <div className="order-info-main-opponent-info mb-4">
            <div className="d-flex align-items-center">
              <img
                src={generateProfileFilePath(order.renterPhoto)}
                alt={order.renterName}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-6">
              <InputView
                label="Renter Name:"
                icon="bx bx-envelope"
                placeholder="Renter Name"
                value={order.renterName}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Renter Email:"
                icon="bx bx-envelope"
                placeholder="Renter Email"
                value={order.renterEmail}
              />
            </div>
          </div>
        </div>
      )}

      {(order.cancelStatus != null || !actualUpdateRequest) && (
        <div
          className="row listings-sidebar mt-0"
          style={{ marginBottom: "30px" }}
        >
          <div className="col form-group mb-0">
            <div className="listings-widget order_widget order-proposal-info">
              <h3>Proposal Info</h3>

              <ul style={{ listStyle: "none", padding: "0" }}>
                {isBookingWithoutAgreement &&
                  order.listingPrice != order.offerPrice && (
                    <li
                      style={
                        order.listingPrice != order.offerPrice
                          ? { textDecoration: "line-through" }
                          : {}
                      }
                    >
                      Listing price: {moneyFormatVisual(order.listingPrice)}
                    </li>
                  )}

                <li>Offer price: {moneyFormatVisual(order.offerPrice)}</li>
                <li>
                  <CanBeErrorBaseDateSpan
                    finishDate={order.offerFinishDate}
                    startDate={order.offerStartDate}
                  />
                </li>
                <li>Fee: {currentFee}%</li>

                {(order.status != STATIC.ORDER_STATUSES.PENDING_OWNER ||
                  order.status != STATIC.ORDER_STATUSES.PENDING_RENTER) && (
                  <li className="order-status">
                    Status:{" "}
                    <StatusBlock
                      status={order.status}
                      statusCancelled={order.cancelStatus}
                      disputeStatus={order.disputeStatus}
                      ownerId={order.ownerId}
                      renterId={order.renterId}
                      userId={sessionUser?.id}
                      finishDate={order.offerFinishDate}
                      payedId={order.paymentInfo?.id}
                      adminApproved={order.paymentInfo?.adminApproved}
                      waitingApproved={order.paymentInfo?.waitingApproved}
                    />
                  </li>
                )}

                {order.disputeProbability !== null && (
                  <li>
                    Dispute Probability:{" "}
                    <span
                      className={
                        order.disputeProbability < 25
                          ? "text-success"
                          : order.disputeProbability < 75
                          ? "text-warning"
                          : "text-danger"
                      }
                    >
                      {order.disputeProbability}%
                    </span>
                  </li>
                )}

                {isBookingWithoutAgreement &&
                  order.offerPrice != order.listingPrice && (
                    <li
                      style={{
                        textDecoration: "line-through",
                      }}
                    >
                      Subtotal price with listing price:{" "}
                      {moneyFormatVisual(order.listingPrice)}
                    </li>
                  )}

                <li>
                  Fact offer subtotal price:{" "}
                  {moneyFormatVisual(order.offerPrice)}
                </li>

                <li>
                  Total fee price:{" "}
                  {moneyFormatVisual(
                    currentFeeCalculate(
                      order.offerPrice,
                      order.offerStartDate,
                      order.offerFinishDate,
                      currentFee
                    )
                  )}
                </li>

                {isBookingWithoutAgreement &&
                  order.offerPrice != order.listingPrice && (
                    <>
                      {isOwner && (
                        <li
                          style={{
                            fontWeight: 700,
                            textDecoration: "line-through",
                          }}
                        >
                          Price with listing price to get{" "}
                          {moneyFormatVisual(
                            localCalculateCurrentTotalPrice({
                              price: order.listingPrice,
                              startDate: order.offerStartDate,
                              finishDate: order.offerFinishDate,
                              type: "owner",
                            })
                          )}
                        </li>
                      )}

                      {isRenter && (
                        <li
                          style={{
                            fontWeight: 700,
                            textDecoration: "line-through",
                          }}
                        >
                          Price with listing price to pay{" "}
                          {moneyFormatVisual(
                            localCalculateCurrentTotalPrice({
                              price: order.listingPrice,
                              startDate: order.offerStartDate,
                              finishDate: order.offerFinishDate,
                              type: "renter",
                            })
                          )}
                        </li>
                      )}
                    </>
                  )}

                {isOwner && (
                  <li style={{ fontWeight: 700 }}>
                    Fact offer price to get:{" "}
                    {moneyFormatVisual(
                      localCalculateCurrentTotalPrice({
                        price: order.offerPrice,
                        startDate: order.offerStartDate,
                        finishDate: order.offerFinishDate,
                        type: "owner",
                      })
                    )}
                  </li>
                )}

                {isRenter && (
                  <li style={{ fontWeight: 700 }}>
                    Fact offer price to pay:{" "}
                    {moneyFormatVisual(
                      localCalculateCurrentTotalPrice({
                        price: order.offerPrice,
                        startDate: order.offerStartDate,
                        finishDate: order.offerFinishDate,
                        type: "renter",
                      })
                    )}
                  </li>
                )}
                {checkErrorData(order.offerStartDate, order.offerFinishDate)
                  .blocked && (
                  <ErrorBlockMessage dopClassName="mb-0">
                    {
                      checkErrorData(
                        order.offerStartDate,
                        order.offerFinishDate
                      ).tooltipErrorMessage
                    }
                  </ErrorBlockMessage>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {order.cancelStatus == null && actualUpdateRequest && (
        <div
          className="row listings-sidebar mt-0"
          style={{ marginBottom: "30px" }}
        >
          <div className="col col-12 col-md-6 form-group mb-0 h-100">
            <div className="listings-widget order_widget order-proposal-info">
              {(isOwner &&
                order.status == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
              (isRenter &&
                order.status == STATIC.ORDER_STATUSES.PENDING_RENTER) ? (
                <h3>Your Proposal Info</h3>
              ) : (
                <h3>{isOwner ? "Renter" : "Owner"} Proposal</h3>
              )}

              <ul style={{ listStyle: "none", padding: "0" }}>
                <li>
                  Offer price: {moneyFormatVisual(prevUpdateRequest.price)}
                </li>

                <li>
                  <CanBeErrorBaseDateSpan
                    startDate={prevUpdateRequest.startDate}
                    finishDate={prevUpdateRequest.finishDate}
                  />
                </li>

                <li>Fee: {currentFee}%</li>

                {isBookingWithoutAgreement &&
                  prevUpdateRequest.price != order.listingPrice && (
                    <li
                      style={{
                        textDecoration: "line-through",
                      }}
                    >
                      Subtotal price with listing price:{" "}
                      {moneyFormatVisual(prevUpdateRequest.price)}
                    </li>
                  )}

                <li>
                  Fact offer subtotal price:{" "}
                  {moneyFormatVisual(prevUpdateRequest.price)}
                </li>

                <li>
                  Total fee price:{" "}
                  {moneyFormatVisual(
                    currentFeeCalculate(
                      prevUpdateRequest.price,
                      prevUpdateRequest.startDate,
                      prevUpdateRequest.finishDate,
                      currentFee
                    )
                  )}
                </li>

                {isBookingWithoutAgreement &&
                  prevUpdateRequest.price != order.listingPrice && (
                    <li
                      style={{
                        textDecoration: "line-through",
                      }}
                    >
                      Price with listing price:
                      {moneyFormatVisual(
                        localCalculateCurrentTotalPrice({
                          price: order.listingPrice,
                          startDate: order.offerStartDate,
                          finishDate: order.offerFinishDate,
                        })
                      )}
                    </li>
                  )}

                <li style={{ fontWeight: 700 }}>
                  Fact offer price {isOwner ? "to pay" : "to get"}:{" "}
                  {moneyFormatVisual(
                    localCalculateCurrentTotalPrice({
                      price: prevUpdateRequest.price,
                      startDate: prevUpdateRequest.startDate,
                      finishDate: prevUpdateRequest.finishDate,
                    })
                  )}
                </li>

                {checkErrorData(
                  prevUpdateRequest.startDate,
                  prevUpdateRequest.finishDate
                ).blocked && (
                  <ErrorBlockMessage dopClassName="mb-0">
                    {
                      checkErrorData(
                        prevUpdateRequest.startDate,
                        prevUpdateRequest.finishDate
                      ).tooltipErrorMessage
                    }
                  </ErrorBlockMessage>
                )}
              </ul>
            </div>
          </div>

          <div className="col col-12 col-md-6 mt-4 mt-md-0 form-group mb-0 h-100">
            <div className="listings-widget order_widget order-proposal-info">
              {(isOwner &&
                order.status == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
              (isRenter &&
                order.status == STATIC.ORDER_STATUSES.PENDING_RENTER) ? (
                <h3>{isOwner ? "Renter" : "Owner"} Proposal</h3>
              ) : (
                <h3>Your Proposal Info</h3>
              )}

              <ul style={{ listStyle: "none", padding: "0" }}>
                <li>
                  Offer price:
                  {moneyFormatVisual(actualUpdateRequest.newPrice)}
                </li>

                <li>
                  <CanBeErrorBaseDateSpan
                    startDate={actualUpdateRequest.newStartDate}
                    finishDate={actualUpdateRequest.newFinishDate}
                  />
                </li>

                <li>Fee: {currentFee}%</li>

                {actualUpdateRequest.newPrice != order.listingPrice && (
                  <li
                    style={{
                      textDecoration: "line-through",
                    }}
                  >
                    Subtotal price with listing price:{" "}
                    {moneyFormatVisual(order.listingPrice)}
                  </li>
                )}

                <li>
                  Fact offer subtotal price:{" "}
                  {moneyFormatVisual(actualUpdateRequest.newPrice)}
                </li>

                <li>
                  Total fee price:{" "}
                  {moneyFormatVisual(
                    currentFeeCalculate(
                      actualUpdateRequest.newPrice,
                      actualUpdateRequest.newStartDate,
                      actualUpdateRequest.newFinishDate,
                      currentFee
                    )
                  )}
                </li>

                {actualUpdateRequest.newPrice != order.listingPrice && (
                  <li
                    style={{
                      textDecoration: "line-through",
                    }}
                  >
                    Price {isOwner ? "to pay" : "to get"} with listing price per
                    day:{" "}
                    {moneyFormatVisual(
                      localCalculateCurrentTotalPrice({
                        price: order.listingPrice,
                        startDate: order.offerStartDate,
                        finishDate: order.offerFinishDate,
                      })
                    )}
                  </li>
                )}

                <li style={{ fontWeight: 700 }}>
                  Fact offer price {isOwner ? "to pay" : "to get"}:{" "}
                  {moneyFormatVisual(
                    localCalculateCurrentTotalPrice({
                      price: actualUpdateRequest.newPrice,
                      startDate: actualUpdateRequest.newStartDate,
                      finishDate: actualUpdateRequest.newFinishDate,
                    })
                  )}
                </li>

                {checkErrorData(
                  actualUpdateRequest.newStartDate,
                  actualUpdateRequest.newFinishDate
                ).blocked && (
                  <ErrorBlockMessage dopClassName="mb-0">
                    {
                      checkErrorData(
                        actualUpdateRequest.newStartDate,
                        actualUpdateRequest.newFinishDate
                      ).tooltipErrorMessage
                    }
                  </ErrorBlockMessage>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <SuccessIconPopup
        modalActive={successIconPopupState.active}
        closeModal={successIconPopupState.onClose}
        textWeight={successIconPopupState.textWeight}
        text={successIconPopupState.text}
        mainCloseButtonText={successIconPopupState.closeButtonText}
      />

      {!operationsDisabled && (
        <div className="order_widget add-listings-box">
          <h3>Operations</h3>

          {currentActionButtons.includes(
            STATIC.ORDER_ACTION_BUTTONS.PAY_UPDATE_BUTTON
          ) &&
            order.paymentInfo && (
              <div className="booking-operations form-group">
                <ErrorBlockMessage dopClassName="w-100">
                  <b>Payment failed description:</b>{" "}
                  {order.paymentInfo.failedDescription}
                </ErrorBlockMessage>
              </div>
            )}

          <div className="booking-operations form-group">
            {(currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
            ) ||
              currentActionButtons.includes(
                STATIC.ORDER_ACTION_BUTTONS.BOOKING_UPDATING_SECTION
              )) && (
              <>
                {currentActionButtons.includes(
                  STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
                ) && (
                  <button
                    className="default-btn"
                    type="button"
                    onClick={() =>
                      orderPopupsData.setAcceptOrderModalActive(true)
                    }
                    disabled={orderPopupsData.bookingActionsDisabled}
                  >
                    Accept
                  </button>
                )}

                <button
                  className="default-btn"
                  type="button"
                  onClick={() =>
                    orderPopupsData.setUpdateRequestModalActive(true)
                  }
                  disabled={orderPopupsData.bookingActionsDisabled}
                >
                  Edit
                </button>

                <button
                  className="default-btn error-btn"
                  type="button"
                  onClick={() =>
                    orderPopupsData.setRejectOrderModalActive(true)
                  }
                  disabled={orderPopupsData.bookingActionsDisabled}
                >
                  Reject
                </button>
              </>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.PAY_BUTTON
            ) && (
              <Link
                className="default-btn"
                href={`/dashboard/orders/checkout/${order.id}`}
              >
                Pay
              </Link>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.PAY_UPDATE_BUTTON
            ) && (
              <Link
                className="default-btn"
                href={`/dashboard/pay-by-bank-transfer/${order.id}/`}
              >
                Update payment
              </Link>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.FINISH_BUTTON
            ) && (
              <button
                type="button"
                onClick={() => orderPopupsData.setFinishModalActive(true)}
                className="default-btn"
              >
                <i className="bx bx-check-circle"></i> Send Finish Request
              </button>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.ACCEPT_OWNER_FINISH_BUTTON
            ) && (
              <button
                type="button"
                onClick={() => orderPopupsData.setAcceptFinishModalActive(true)}
                className="default-btn"
              >
                <i className="bx bx-check-circle"></i> Accept Finish
              </button>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.RENTER_REVIEW
            ) && (
              <Link
                className="default-btn"
                href={`/dashboard/creating-renter-review/${order.id}`}
              >
                Leave a review
              </Link>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.OWNER_REVIEW
            ) && (
              <Link
                className="default-btn"
                href={`/dashboard/creating-owner-review/${order.id}`}
              >
                Leave a review
              </Link>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.OPEN_DISPUTE
            ) && (
              <Link
                type="button"
                className="default-btn error-btn"
                href={`/dashboard/orders/create-dispute/${order.id}`}
              >
                Open dispute
              </Link>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.CANCEL_BUTTON
            ) && (
              <button
                className="default-btn error-btn"
                type="button"
                onClick={() => orderPopupsData.setCancelModalActive(true)}
              >
                Cancel Request
              </button>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.FAST_CANCEL_BUTTON
            ) && (
              <button
                className="default-btn error-btn"
                type="button"
                onClick={() => orderPopupsData.setPayedCancelModalActive(true)}
              >
                Cancel Request
              </button>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.ORDER_CHAT
            ) && (
              <Link
                className="default-btn"
                href={`/dashboard/chats/${order.chatId}`}
              >
                Chat
              </Link>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.VIEW_DISPUTE_CHAT
            ) && (
              <Link
                href={`/dashboard/chats/${order.disputeChatId}`}
                className="default-btn"
                type="button"
              >
                Dispute Chat
              </Link>
            )}

            <OrderPopups
              {...orderPopupsData}
              order={order}
              actualUpdateRequest={actualUpdateRequest}
              renterBaseCommission={renterBaseCommission}
              currentFee={currentFee}
              actionButtons={currentActionButtons}
              onRenterPayed={onRenterPayed}
              bankInfo={bankInfo}
            />
          </div>
        </div>
      )}

      {order.disputeId && (
        <ErrorBlockMessage>
          <b>Dispute type:</b> {getDisputeTitle(order.disputeType)}
          <br />
          <b>Dispute description:</b> {order.disputeDescription}
        </ErrorBlockMessage>
      )}
    </>
  );
};

export default OrderContent;
