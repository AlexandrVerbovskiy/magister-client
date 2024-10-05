import React, { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  calculateCurrentTotalPrice,
  calculateFeeByDaysCount,
  generateProfileFilePath,
  getDisputeTitle,
  getFactOrderDays,
  getListingImageByType,
  moneyFormatVisual,
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
  STATIC.ORDER_STATUSES.PENDING_WORKER_PAYMENT,
  STATIC.ORDER_STATUSES.PENDING_OWNER,
  STATIC.ORDER_STATUSES.PENDING_WORKER,
];

const SubOrderItem = ({
  subOrder,
  isOwner,
  localCalculateCurrentTotalPrice,
  BaseDateSpan,
}) => {
  const { sessionUser } = useContext(IndiceContext);
  const workerName = subOrder.workerName;
  const workerId = subOrder.workerId;

  const startDate = subOrder.newStartDate ?? subOrder.offerStartDate;
  const endDate = subOrder.newEndDate ?? subOrder.offerEndDate;
  const pricePerDay = subOrder.newPricePerDay ?? subOrder.offerPricePerDay;

  const totalPrice = localCalculateCurrentTotalPrice({
    startDate,
    endDate,
    pricePerDay,
  });

  return (
    <li className="form-group">
      <div className="d-flex justify-content-between">
        <div>
          Id:{" "}
          <Link href={`/dashboard/orders/${subOrder.id}/`}>#{subOrder.id}</Link>
        </div>

        <Link href={`/dashboard/orders/${subOrder.id}/`}>
          <StatusBlock
            status={subOrder.status}
            statusCancelled={subOrder.cancelStatus}
            disputeStatus={subOrder.disputeStatus}
            ownerId={subOrder.ownerId}
            workerId={subOrder.workerId}
            userId={sessionUser?.id}
            dopClass="order-status-small-span"
            endDate={subOrder.offerEndDate}
            payedId={subOrder.paymentInfo?.id}
            adminApproved={subOrder.paymentInfo?.adminApproved}
            waitingApproved={subOrder.paymentInfo?.waitingApproved}
          />
        </Link>
      </div>

      <div>
        Type: {bookingStatuses.includes(subOrder.status) ? "Booking" : "Order"}
      </div>

      <div className="w-100 row-dots-end">
        Rental:{" "}
        <Link
          className="w-100 row-dots-end"
          href={`/owner-listings/${workerId}/`}
        >
          {workerName}
        </Link>
      </div>

      <div>
        <BaseDateSpan startDate={startDate} endDate={endDate} />
      </div>

      <div>Price per day: {moneyFormatVisual(pricePerDay)}</div>

      <div>
        <b>
          Total price {isOwner ? "to get" : "to pay"}:{" "}
          {moneyFormatVisual(totalPrice)}
        </b>
      </div>
    </li>
  );
};

const OrderContent = ({
  order: baseOrder,
  authToken,
  ownerBaseCommission,
  workerBaseCommission,
  bankInfo,
  operationsDisabled = false,
}) => {
  const { success, error, sessionUser } = useContext(IndiceContext);
  const [order, setOrder] = useState(baseOrder);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [successIconPopupState, setSuccessIconPopupState] = useState({});

  const router = useRouter();

  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const closeCurrentOpenImg = () => setCurrentOpenImg(null);

  const [isOwner, setIsOwner] = useState(false);
  const [isWorker, setIsWorker] = useState(false);

  const [prevUpdateRequest, setPrevUpdateRequest] = useState(null);
  const [actualUpdateRequest, setActualUpdateRequest] = useState(null);

  const isBookingWithoutAgreement =
    order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
    order.status == STATIC.ORDER_STATUSES.PENDING_WORKER;

  const { CanBeErrorBaseDateSpan, checkErrorData, BaseDateSpan } =
    useOrderDateError({
      order,
    });

  useEffect(() => {
    setOrder(baseOrder);
  }, [baseOrder?.id]);

  useEffect(() => {
    setIsOwner(order.ownerId == sessionUser?.id);
    setIsWorker(order.workerId == sessionUser?.id);

    if (isBookingWithoutAgreement) {
      if (order.previousUpdateRequest) {
        setPrevUpdateRequest(order.previousUpdateRequest);
      } else {
        if (order.actualUpdateRequest) {
          setPrevUpdateRequest({
            senderId: order.workerId,
            startDate: order.offerStartDate,
            endDate: order.offerEndDate,
            pricePerDay: order.offerPricePerDay,
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
              sessionUser?.id == order.ownerId ? "owner" : "worker"
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
    type = null,
    startDate,
    endDate,
    pricePerDay,
  }) =>
    calculateCurrentTotalPrice({
      startDate,
      endDate,
      pricePerDay,
      type,
      isOwner,
      ownerFee: order.ownerFee,
      workerFee: order.workerFee,
    });

  const onCreateUpdateRequest = ({ price, fromDate, toDate }) => {
    if (actualUpdateRequest) {
      setPrevUpdateRequest({
        senderId: actualUpdateRequest.senderId,
        startDate: actualUpdateRequest.newStartDate,
        endDate: actualUpdateRequest.newEndDate,
        pricePerDay: actualUpdateRequest.newPricePerDay,
      });
    } else {
      setPrevUpdateRequest({
        senderId: order.workerId,
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
        status: STATIC.ORDER_STATUSES.PENDING_WORKER,
      }));
    } else {
      setOrder((prev) => ({
        ...prev,
        status: STATIC.ORDER_STATUSES.PENDING_OWNER,
      }));
    }

    activateSuccessOrderPopup({
      text:
        "Booking updates successfully. Wait for a response from the " +
        (isOwner ? "worker" : "owner"),
    });
  };

  const setUpdatedOffer = ({ status, cancelStatus = null }) => {
    const offerPricePerDay = actualUpdateRequest
      ? actualUpdateRequest.newPricePerDay
      : order.offerPricePerDay;
    const offerStartDate = actualUpdateRequest
      ? actualUpdateRequest.newStartDate
      : order.offerStartDate;
    const offerEndDate = actualUpdateRequest
      ? actualUpdateRequest.newEndDate
      : order.offerEndDate;

    const totalPrice = localCalculateCurrentTotalPrice({
      startDate: offerStartDate,
      endDate: offerEndDate,
      pricePerDay: offerPricePerDay,
    });

    const updatedFields = {
      offerPricePerDay,
      offerStartDate,
      offerEndDate,
      duration: getFactOrderDays(offerStartDate, offerEndDate),
      factTotalPrice: totalPrice,
      requestId: null,
      newEndDate: null,
      newStartDate: null,
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

  const onWorkerPayed = () => {
    activateSuccessOrderPopup({
      text: "The rental starts!",
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

  const currentFee = isOwner ? order.ownerFee : order.workerFee;
  const currentFeeCalculate = (count, price, fee) =>
    calculateFeeByDaysCount(count, price, fee, !isOwner);

  const currentActionButtons = useOrderActions({
    order,
  });

  const statusBarStatuses = bookingStatuses.includes(order.status)
    ? [
        { title: "Make Booking", finished: true },
        {
          title: "Accepted",
          finished:
            order.status == STATIC.ORDER_STATUSES.PENDING_WORKER_PAYMENT,
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
    onCreateUpdateRequest: onCreateUpdateRequest,
    onCancel,
    onPayedFastCancel,
    setError: error.set,
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

          {order.listingDefects && (
            <div className="row">
              <div className="col">
                <TextareaView
                  value={order.listingDefects}
                  icon="bx bx-text"
                  label="Defects:"
                  placeholder="Defects..."
                />
              </div>
            </div>
          )}
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
        </div>
      </div>

      {isWorker && (
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
          <h3>Worker Details</h3>

          <div className="order-info-main-opponent-info mb-4">
            <div className="d-flex align-items-center">
              <img
                src={generateProfileFilePath(order.workerPhoto)}
                alt={order.workerName}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-6">
              <InputView
                label="Worker Name:"
                icon="bx bx-envelope"
                placeholder="Worker Name"
                value={order.workerName}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputView
                label="Worker Email:"
                icon="bx bx-envelope"
                placeholder="Worker Email"
                value={order.workerEmail}
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
                  order.listingPricePerDay != order.offerPricePerDay && (
                    <li
                      style={
                        order.listingPricePerDay != order.offerPricePerDay
                          ? { textDecoration: "line-through" }
                          : {}
                      }
                    >
                      Listing price per day:{" "}
                      {moneyFormatVisual(order.listingPricePerDay)}
                    </li>
                  )}
                <li>
                  Offer price per day:{" "}
                  {moneyFormatVisual(order.offerPricePerDay)}
                </li>
                <li>
                  <CanBeErrorBaseDateSpan
                    startDate={order.offerStartDate}
                    endDate={order.offerEndDate}
                  />
                </li>
                <li>Fee: {currentFee}%</li>

                {(order.status != STATIC.ORDER_STATUSES.PENDING_OWNER ||
                  order.status != STATIC.ORDER_STATUSES.PENDING_WORKER) && (
                  <li className="order-status">
                    Status:{" "}
                    <StatusBlock
                      status={order.status}
                      statusCancelled={order.cancelStatus}
                      disputeStatus={order.disputeStatus}
                      ownerId={order.ownerId}
                      workerId={order.workerId}
                      userId={sessionUser?.id}
                      endDate={order.offerEndDate}
                      payedId={order.paymentInfo?.id}
                      adminApproved={order.paymentInfo?.adminApproved}
                      waitingApproved={order.paymentInfo?.waitingApproved}
                    />
                  </li>
                )}

                {isBookingWithoutAgreement &&
                  order.offerPricePerDay != order.listingPricePerDay && (
                    <li
                      style={{
                        textDecoration: "line-through",
                      }}
                    >
                      Subtotal price with listing price per day{" "}
                      {moneyFormatVisual(
                        order.listingPricePerDay *
                          getFactOrderDays(
                            order.offerStartDate,
                            order.offerEndDate
                          )
                      )}
                    </li>
                  )}

                <li>
                  Fact offer subtotal price:{" "}
                  {moneyFormatVisual(
                    order.offerPricePerDay *
                      getFactOrderDays(order.offerStartDate, order.offerEndDate)
                  )}
                </li>

                <li>
                  Total fee price:{" "}
                  {moneyFormatVisual(
                    currentFeeCalculate(
                      getFactOrderDays(
                        order.offerStartDate,
                        order.offerEndDate
                      ),
                      order.offerPricePerDay,
                      currentFee
                    )
                  )}
                </li>

                {isBookingWithoutAgreement &&
                  order.offerPricePerDay != order.listingPricePerDay && (
                    <>
                      {isOwner && (
                        <li
                          style={{
                            fontWeight: 700,
                            textDecoration: "line-through",
                          }}
                        >
                          Price with listing price per day to get{" "}
                          {moneyFormatVisual(
                            localCalculateCurrentTotalPrice({
                              startDate: order.offerStartDate,
                              endDate: order.offerEndDate,
                              pricePerDay: order.listingPricePerDay,
                              type: "owner",
                            })
                          )}
                        </li>
                      )}

                      {isWorker && (
                        <li
                          style={{
                            fontWeight: 700,
                            textDecoration: "line-through",
                          }}
                        >
                          Price with listing price per day to pay{" "}
                          {moneyFormatVisual(
                            localCalculateCurrentTotalPrice({
                              startDate: order.offerStartDate,
                              endDate: order.offerEndDate,
                              pricePerDay: order.listingPricePerDay,
                              type: "worker",
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
                        startDate: order.offerStartDate,
                        endDate: order.offerEndDate,
                        pricePerDay: order.offerPricePerDay,
                        type: "owner",
                      })
                    )}
                  </li>
                )}

                {isWorker && (
                  <li style={{ fontWeight: 700 }}>
                    Fact offer price to pay:{" "}
                    {moneyFormatVisual(
                      localCalculateCurrentTotalPrice({
                        startDate: order.offerStartDate,
                        endDate: order.offerEndDate,
                        pricePerDay: order.offerPricePerDay,
                        type: "worker",
                      })
                    )}
                  </li>
                )}
                {checkErrorData(order.offerStartDate).blocked && (
                  <ErrorBlockMessage dopClassName="mb-0">
                    {checkErrorData(order.offerStartDate).tooltipErrorMessage}
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
              (isWorker &&
                order.status == STATIC.ORDER_STATUSES.PENDING_WORKER) ? (
                <h3>Your Proposal Info</h3>
              ) : (
                <h3>{isOwner ? "Rental" : "Owner"} Proposal</h3>
              )}

              <ul style={{ listStyle: "none", padding: "0" }}>
                <li>
                  Offer price per day:{" "}
                  {moneyFormatVisual(prevUpdateRequest.pricePerDay)}
                </li>

                <li>
                  <BaseDateSpan
                    startDate={prevUpdateRequest.startDate}
                    endDate={prevUpdateRequest.endDate}
                  />
                </li>

                <li>Fee: {currentFee}%</li>

                {isBookingWithoutAgreement &&
                  prevUpdateRequest.pricePerDay != order.listingPricePerDay && (
                    <li
                      style={{
                        textDecoration: "line-through",
                      }}
                    >
                      Subtotal price with listing price per day{" "}
                      {moneyFormatVisual(
                        prevUpdateRequest.pricePerDay *
                          getFactOrderDays(
                            prevUpdateRequest.startDate,
                            prevUpdateRequest.endDate
                          )
                      )}
                    </li>
                  )}

                <li>
                  Fact offer subtotal price:{" "}
                  {moneyFormatVisual(
                    prevUpdateRequest.pricePerDay *
                      getFactOrderDays(
                        prevUpdateRequest.startDate,
                        prevUpdateRequest.endDate
                      )
                  )}
                </li>

                <li>
                  Total fee price:{" "}
                  {moneyFormatVisual(
                    currentFeeCalculate(
                      getFactOrderDays(
                        prevUpdateRequest.startDate,
                        prevUpdateRequest.endDate
                      ),
                      prevUpdateRequest.pricePerDay,
                      currentFee
                    )
                  )}
                </li>

                {isBookingWithoutAgreement &&
                  prevUpdateRequest.pricePerDay != order.listingPricePerDay && (
                    <li
                      style={{
                        textDecoration: "line-through",
                      }}
                    >
                      Price with listing price per day:
                      {moneyFormatVisual(
                        localCalculateCurrentTotalPrice({
                          startDate: prevUpdateRequest.startDate,
                          endDate: prevUpdateRequest.endDate,
                          pricePerDay: order.listingPricePerDay,
                        })
                      )}
                    </li>
                  )}

                <li style={{ fontWeight: 700 }}>
                  Fact offer price {isOwner ? "to get" : "to pay"}:{" "}
                  {moneyFormatVisual(
                    localCalculateCurrentTotalPrice({
                      startDate: prevUpdateRequest.startDate,
                      endDate: prevUpdateRequest.endDate,
                      pricePerDay: prevUpdateRequest.pricePerDay,
                    })
                  )}
                </li>
              </ul>
            </div>
          </div>

          <div className="col col-12 col-md-6 mt-4 mt-md-0 form-group mb-0 h-100">
            <div className="listings-widget order_widget order-proposal-info">
              {(isOwner &&
                order.status == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
              (isWorker &&
                order.status == STATIC.ORDER_STATUSES.PENDING_WORKER) ? (
                <h3>{isOwner ? "Rental" : "Owner"} Proposal</h3>
              ) : (
                <h3>Your Proposal Info</h3>
              )}

              <ul style={{ listStyle: "none", padding: "0" }}>
                <li>
                  Offer price per day:
                  {moneyFormatVisual(actualUpdateRequest.newPricePerDay)}
                </li>

                <li>
                  <CanBeErrorBaseDateSpan
                    startDate={actualUpdateRequest.newStartDate}
                    endDate={actualUpdateRequest.newEndDate}
                  />
                </li>

                <li>Fee: {currentFee}%</li>

                {actualUpdateRequest.newPricePerDay !=
                  order.listingPricePerDay && (
                  <li
                    style={{
                      textDecoration: "line-through",
                    }}
                  >
                    Subtotal price with listing price per day
                    {moneyFormatVisual(
                      actualUpdateRequest.newPricePerDay *
                        getFactOrderDays(
                          actualUpdateRequest.newStartDate,
                          actualUpdateRequest.newEndDate
                        )
                    )}
                  </li>
                )}

                <li>
                  Fact offer subtotal price:{" "}
                  {moneyFormatVisual(
                    actualUpdateRequest.newPricePerDay *
                      getFactOrderDays(
                        actualUpdateRequest.newStartDate,
                        actualUpdateRequest.newEndDate
                      )
                  )}
                </li>

                <li>
                  Total fee price:{" "}
                  {moneyFormatVisual(
                    currentFeeCalculate(
                      getFactOrderDays(
                        actualUpdateRequest.newStartDate,
                        actualUpdateRequest.newEndDate
                      ),
                      actualUpdateRequest.newPricePerDay,
                      currentFee
                    )
                  )}
                </li>

                {actualUpdateRequest.newPricePerDay !=
                  order.listingPricePerDay && (
                  <li
                    style={{
                      textDecoration: "line-through",
                    }}
                  >
                    Price {isOwner ? "to get" : "to pay"} with listing price per
                    day:
                    {moneyFormatVisual(
                      localCalculateCurrentTotalPrice({
                        startDate: actualUpdateRequest.newStartDate,
                        endDate: actualUpdateRequest.newEndDate,
                        pricePerDay: order.listingPricePerDay,
                      })
                    )}
                  </li>
                )}

                <li style={{ fontWeight: 700 }}>
                  Fact offer price {isOwner ? "to get" : "to pay"}:{" "}
                  {moneyFormatVisual(
                    localCalculateCurrentTotalPrice({
                      startDate: actualUpdateRequest.newStartDate,
                      endDate: actualUpdateRequest.newEndDate,
                      pricePerDay: actualUpdateRequest.newPricePerDay,
                    })
                  )}
                </li>

                {checkErrorData(actualUpdateRequest.newStartDate).blocked && (
                  <ErrorBlockMessage dopClassName="mb-0">
                    {
                      checkErrorData(actualUpdateRequest.newStartDate)
                        .tooltipErrorMessage
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
            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
            ) && (
              <>
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
              STATIC.ORDER_ACTION_BUTTONS.WORKER_REVIEW
            ) && (
              <Link
                className="default-btn"
                href={`/dashboard/creating-worker-review/${order.id}`}
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
              workerBaseCommission={workerBaseCommission}
              currentFee={currentFee}
              actionButtons={currentActionButtons}
              onWorkerPayed={onWorkerPayed}
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
