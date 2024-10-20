import React, { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  calculateCurrentTotalPrice,
  calculateFeeByDaysCount,
  dateConverter,
  generateProfileFilePath,
  getDisputeTitle,
  getFactOrderDays,
  getListingImageByType,
  isOrderCanBeAccepted,
  moneyFormatVisual,
} from "../../utils";
import ImagePopup from "../_App/ImagePopup";
import MultyMarkersMap from "../Listings/MultyMarkersMap";
import STATIC from "../../static";
import { approveClientGotListing, finishedByOwner } from "../../services";
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
import OrderExtendApprovementSection from "../Order/OrderExtendApprovementSection";
import Link from "next/link";
import OrderPopups from "./OrderPopups";
import TenantGotListingApproveModal from "./TenantGotListingApproveModal";
import FinishOrderModal from "./FinishOrderModal";

const bookingStatuses = [
  STATIC.ORDER_STATUSES.REJECTED,
  STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
  STATIC.ORDER_STATUSES.PENDING_OWNER,
  STATIC.ORDER_STATUSES.PENDING_TENANT,
];

const SubOrderItem = ({
  subOrder,
  isOwner,
  localCalculateCurrentTotalPrice,
  BaseDateSpan,
}) => {
  const { sessionUser } = useContext(IndiceContext);
  const tenantName = subOrder.tenantName;
  const tenantId = subOrder.tenantId;

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
            tenantId={subOrder.tenantId}
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
          href={`/owner-listings/${tenantId}/`}
        >
          {tenantName}
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
  tenantBaseCommission,
  bankInfo,
  operationsDisabled = false,
}) => {
  const { success, error, sessionUser } = useContext(IndiceContext);
  const [order, setOrder] = useState(baseOrder);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [successIconPopupState, setSuccessIconPopupState] = useState({});

  const [
    tenantGotListingApproveModalActive,
    setTenantGotListingApproveModalActive,
  ] = useState(false);

  const [finishOrderModalActive, setFinishOrderModalActive] = useState(false);

  const router = useRouter();

  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const closeCurrentOpenImg = () => setCurrentOpenImg(null);

  const [isOwner, setIsOwner] = useState(false);
  const [isTenant, setIsTenant] = useState(false);

  const [prevUpdateRequest, setPrevUpdateRequest] = useState(null);
  const [actualUpdateRequest, setActualUpdateRequest] = useState(null);

  const isBookingWithoutAgreement =
    order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
    order.status == STATIC.ORDER_STATUSES.PENDING_TENANT;

  const { CanBeErrorBaseDateSpan, checkErrorData, BaseDateSpan } =
    useOrderDateError({
      order,
    });

  useEffect(() => {
    setOrder(baseOrder);
  }, [baseOrder?.id]);

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
              sessionUser?.id == order.ownerId ? "owner" : "tenant"
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
      tenantFee: order.tenantFee,
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
        conflictOrders: [],
      }));
    } else {
      setOrder((prev) => ({
        ...prev,
        status: STATIC.ORDER_STATUSES.PENDING_OWNER,
        conflictOrders: [],
      }));
    }

    activateSuccessOrderPopup({
      text:
        "Booking updates successfully. Wait for a response from the " +
        (isOwner ? "tenant" : "owner"),
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

  const onTenantPayed = () => {
    activateSuccessOrderPopup({
      text: "The rental starts!",
      onClose: () => {},
      closeButtonText: "Return to Order",
    });

    setTimeout(() => {
      setOrder((prev) => ({
        ...prev,
        status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT,
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

  const onExtendOrder = ({ id }) => {
    success.set("Order extended successfully");
    router.push("/dashboard/orders/");
  };

  const handleMoveToOrder = (id) => {
    router.push(`/dashboard/orders/${id}/`);
  };

  const handleTenantGotListingApprove = async () => {
    try {
      const res = await approveClientGotListing(
        {
          token: order.acceptListingTenantToken,
        },
        authToken
      );

      setOrder((prev) => ({
        ...prev,
        ownerAcceptListingQrcode: res.qrCode,
        status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
      }));

      activateSuccessOrderPopup({
        text: "Approved successfully",
      });
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleFinishOrder = async () => {
    try {
      await finishedByOwner(
        {
          token: order.acceptListingOwnerToken,
        },
        authToken
      );

      setOrder((prev) => ({
        ...prev,
        status: STATIC.ORDER_STATUSES.FINISHED,
      }));

      activateSuccessOrderPopup({
        text: "Finished successfully",
      });
    } catch (e) {
      error.set(e.message);
    }
  };

  const currentFee = isOwner ? order.ownerFee : order.tenantFee;
  const currentFeeCalculate = (count, price, fee) =>
    calculateFeeByDaysCount(count, price, fee, !isOwner);

  const currentActionButtons = useOrderActions({
    order,
  });

  let countDopAction = 0;

  if (
    currentActionButtons.includes(STATIC.ORDER_ACTION_BUTTONS.FOR_OWNER_QRCODE)
  ) {
    countDopAction += 1;
  }

  if (
    currentActionButtons.includes(STATIC.ORDER_ACTION_BUTTONS.FOR_TENANT_QRCODE)
  ) {
    countDopAction += 1;
  }

  const statusBarStatuses = bookingStatuses.includes(order.status)
    ? [
        { title: "Make Booking", finished: true },
        {
          title: "Accepted",
          finished:
            order.status == STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
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
            STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
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
    onExtendOrder,
  });

  const updateFromDate = (fromDate) => {
    orderPopupsData.setExtendApproveData({
      ...orderPopupsData.extendApproveData,
      fromDate,
    });
  };

  const updateToDate = (toDate) => {
    orderPopupsData.setExtendApproveData({
      ...orderPopupsData.extendApproveData,
      toDate,
    });
  };

  const triggerFinishClick = () => {
    setFinishOrderModalActive(true);
  };

  const triggerTenantQotListingClick = () => {
    setTenantGotListingApproveModalActive(true);
  };

  if (orderPopupsData.extendApproveData) {
    return (
      <OrderExtendApprovementSection
        handleApprove={orderPopupsData.handleMakeBooking}
        setCurrentOpenImg={setCurrentOpenImg}
        listing={{
          id: order.listingId,
          name: order.listingName,
          userName: order.ownerName,
          userPhoto: order.ownerPhoto,
          listingImages: order.listingImages,
          userCountItems: order.listingCountStoredItems,
          ownerAverageRating: order.ownerAverageRating,
          ownerCommentCount: order.ownerCommentCount,
        }}
        handleGoBack={() => orderPopupsData.setExtendApproveData(null)}
        fromDate={orderPopupsData.extendApproveData.fromDate}
        toDate={orderPopupsData.extendApproveData.toDate}
        price={orderPopupsData.extendApproveData.price}
        fee={tenantBaseCommission}
        setToDate={updateToDate}
        setFromDate={updateFromDate}
        blockedDates={getOrderBlockedDatesToUpdate(order)}
        minRentalDays={order.listingMinRentalDays}
      />
    );
  }

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
                        lat: order.listingLat,
                        lng: order.listingLng,
                        radius: order.listingRadius,
                      },
                    ]}
                    baseCenter={{
                      lat: order.listingLat,
                      lng: order.listingLng,
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

      {isTenant && (
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
                src={generateProfileFilePath(order.tenantPhoto)}
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
                  order.status != STATIC.ORDER_STATUSES.PENDING_TENANT) && (
                  <li className="order-status">
                    Status:{" "}
                    <StatusBlock
                      status={order.status}
                      statusCancelled={order.cancelStatus}
                      disputeStatus={order.disputeStatus}
                      ownerId={order.ownerId}
                      tenantId={order.tenantId}
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

                      {isTenant && (
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
                              type: "tenant",
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

                {isTenant && (
                  <li style={{ fontWeight: 700 }}>
                    Fact offer price to pay:{" "}
                    {moneyFormatVisual(
                      localCalculateCurrentTotalPrice({
                        startDate: order.offerStartDate,
                        endDate: order.offerEndDate,
                        pricePerDay: order.offerPricePerDay,
                        type: "tenant",
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
              (isTenant &&
                order.status == STATIC.ORDER_STATUSES.PENDING_TENANT) ? (
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
              (isTenant &&
                order.status == STATIC.ORDER_STATUSES.PENDING_TENANT) ? (
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

      {((order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT &&
        order.canAcceptTenantListing) ||
        (order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER &&
          order.canAcceptOwnerListing)) && <>{/* CHECKLIST */}</>}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.FOR_TENANT_QRCODE
      ) && (
        <div id="tenant-qr-code" className="order_widget add-listings-box">
          <h3>Renters QR code to confirm acceptance of the tool</h3>

          <div className="booking-operations form-group">
            <img
              width="200px"
              height="200px"
              src={order.tenantAcceptListingQrcode}
            />
          </div>
        </div>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.FOR_OWNER_QRCODE
      ) && (
        <div id="owner-qr-code" className="order_widget add-listings-box">
          <h3>Owners QR code to confirm acceptance of the tool</h3>

          <div className="booking-operations form-group">
            <img
              width="200px"
              height="200px"
              src={order.ownerAcceptListingQrcode}
            />
          </div>
        </div>
      )}

      {isOwner &&
        order.conflictOrders &&
        order.status == STATIC.ORDER_STATUSES.PENDING_OWNER &&
        order.conflictOrders.length > 0 && (
          <div className="add-listings-box listings-sidebar listings-widget order_widget mt-0">
            <h3>Conflict Bookings/Orders</h3>

            <ul
              className="conflicted-orders"
              style={{ listStyle: "none", padding: "0" }}
            >
              {order.conflictOrders.map((conflictOrder) => (
                <SubOrderItem
                  key={conflictOrder.id}
                  subOrder={conflictOrder}
                  isOwner={isOwner}
                  BaseDateSpan={BaseDateSpan}
                  localCalculateCurrentTotalPrice={
                    localCalculateCurrentTotalPrice
                  }
                />
              ))}
            </ul>
          </div>
        )}

      {!operationsDisabled && currentActionButtons.length > countDopAction && (
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
              STATIC.ORDER_ACTION_BUTTONS.PARENT_VIEW
            ) && (
              <button
                type="button"
                className="default-btn"
                onClick={() => handleMoveToOrder(order.orderParentId)}
              >
                View Main Order
              </button>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
            ) && (
              <>
                {isOrderCanBeAccepted(order) && (
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
              STATIC.ORDER_ACTION_BUTTONS.TENANT_REVIEW
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
              STATIC.ORDER_ACTION_BUTTONS.TENANT_GOT_LISTING_APPROVE_BUTTON
            ) && (
              <button
                className="default-btn"
                type="button"
                onClick={triggerTenantQotListingClick}
              >
                Approve
              </button>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.ACCEPT_FINISH_BUTTON
            ) && (
              <button
                className="default-btn"
                type="button"
                onClick={triggerFinishClick}
              >
                Finish
              </button>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.EXTEND_BUTTON
            ) && (
              <button
                className="default-btn"
                type="button"
                onClick={() => orderPopupsData.setExtendPopupActive(true)}
              >
                Extend Offer
              </button>
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
              STATIC.ORDER_ACTION_BUTTONS.EXTENSION_CHAT
            ) && (
              <Link
                className="default-btn"
                href={`/dashboard/chats/${order.parentChatId}`}
              >
                Parent Chat
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
              tenantBaseCommission={tenantBaseCommission}
              currentFee={currentFee}
              actionButtons={currentActionButtons}
              onTenantPayed={onTenantPayed}
              bankInfo={bankInfo}
            />

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.TENANT_GOT_LISTING_APPROVE_BUTTON
            ) && (
              <TenantGotListingApproveModal
                onApprove={handleTenantGotListingApprove}
                modalActive={tenantGotListingApproveModalActive}
                closeModal={() => setTenantGotListingApproveModalActive(false)}
              />
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.ACCEPT_FINISH_BUTTON
            ) && (
              <FinishOrderModal
                modalActive={finishOrderModalActive}
                closeModal={() => setFinishOrderModalActive(false)}
                onFinish={handleFinishOrder}
              />
            )}
          </div>
        </div>
      )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.EXTENSION_LIST
      ) && (
        <div
          className="add-listings-box listings-sidebar listings-widget order_widget mt-0"
          style={{ marginTop: 0 }}
        >
          <h3>Extensions</h3>

          <div className="booking-operations form-group">
            <ul
              className="conflicted-orders w-100"
              style={{ listStyle: "none", padding: "0" }}
            >
              {order.extendOrders
                .filter((extension) => extension.id != order.id)
                .sort((e1, e2) => {
                  if (
                    dateConverter(e1.offerStartDate) >
                    dateConverter(e2.offerStartDate)
                  ) {
                    return 1;
                  }

                  if (
                    dateConverter(e1.offerStartDate) <
                    dateConverter(e2.offerStartDate)
                  ) {
                    return -1;
                  }

                  return 0;
                })
                .map((extension) => (
                  <SubOrderItem
                    key={extension.id}
                    subOrder={extension}
                    isOwner={isOwner}
                    BaseDateSpan={BaseDateSpan}
                    localCalculateCurrentTotalPrice={
                      localCalculateCurrentTotalPrice
                    }
                  />
                ))}
            </ul>
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
