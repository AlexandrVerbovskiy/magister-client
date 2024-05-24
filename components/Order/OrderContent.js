import React, { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  checkStringDateLowerOrEqualCurrentDate,
  getDaysDifference,
  getFilePath,
  getListingImageByType,
  increaseDateByOneDay,
  moneyFormat,
  ownerGetsCalculate,
  tenantPaymentCalculate,
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
  rejectOrder,
  orderAcceptCancelByTenant,
  orderAcceptCancelByOwner,
  extendOrder,
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
import { useOrderActions, useOrderDateError } from "../../hooks";
import PayedCancelTriggerModal from "./PayedCancelTriggerModal";
import InputWithIcon from "../FormComponents/InputWithIcon";
import StatusBar from "../StatusBar";
import SuccessIconPopup from "../../components/IconPopups/SuccessIconPopup";
import { useRouter } from "next/router";
import BookingModal from "../SingleListings/BookingModal";
import OrderExtendApprovementSection from "../Order/OrderExtendApprovementSection";

const bookingStatuses = [
  STATIC.ORDER_STATUSES.REJECTED,
  STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
  STATIC.ORDER_STATUSES.PENDING_OWNER,
  STATIC.ORDER_STATUSES.PENDING_TENANT,
];

const OrderContent = ({
  order: baseOrder,
  authToken,
  questions,
  ownerBaseCommission,
  tenantBaseCommission,
}) => {
  const { success, error, sessionUser } = useContext(IndiceContext);
  const [order, setOrder] = useState(baseOrder);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [successIconPopupState, setSuccessIconPopupState] = useState({});
  const [extendPopupActive, setExtendPopupActive] = useState(false);
  const [extendApproveData, setExtendApproveData] = useState(null);

  const router = useRouter();

  const activateSuccessOrderPopup = ({
    closeButtonText = null,
    onClose = null,
    text = null,
    textWeight = null,
  }) => {
    const handleClose = () => {
      if (!onClose) {
        onClose = () => {
          if (bookingStatuses.includes(order.status)) {
            router.push("/dashboard/bookings");
          } else {
            router.push("/dashboard/orders");
          }
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

  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const closeCurrentOpenImg = () => setCurrentOpenImg(null);

  const [isOwner, setIsOwner] = useState(false);
  const [isTenant, setIsTenant] = useState(false);

  const [prevUpdateRequest, setPrevUpdateRequest] = useState(null);
  const [actualUpdateRequest, setActualUpdateRequest] = useState(null);
  const [questionAnswerInfos, setQuestionAnswerInfos] = useState([]);

  const isBookingWithoutAgreement =
    (order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
      order.status == STATIC.ORDER_STATUSES.PENDING_TENANT) &&
    order.cancelStatus == null;

  const { CanBeErrorBaseDateSpan, checkErrorData, BaseDateSpan } =
    useOrderDateError({
      order,
    });

  const calculateCurrentTotalPrice = (
    startDate,
    endDate,
    pricePerDay,
    type = null
  ) => {
    if (!type) {
      type = isOwner ? "owner" : "tenant";
    }

    const fee = type == "owner" ? order.ownerFee : order.tenantFee;
    const calculationFunc =
      type == "owner" ? ownerGetsCalculate : tenantPaymentCalculate;

    return calculationFunc(startDate, endDate, fee, pricePerDay);
  };

  useEffect(() => {
    if (questions) {
      const convertedQuestions = questions.map((question) => ({
        ...question,
        answer: false,
        description: "",
        question: question.name,
        error: null,
      }));

      setQuestionAnswerInfos(convertedQuestions);
    } else {
      setQuestionAnswerInfos([]);
    }
  }, [questions]);

  const handleUpdateQuestionDescription = (e, id) => {
    setQuestionAnswerInfos((questions) => {
      return questions.map((question) => {
        if (question.id == id) {
          question["description"] = e.target.value;
          question["error"] = null;
        }

        return question;
      });
    });
  };

  const handleUpdateQuestionAnswer = (e, id) => {
    setQuestionAnswerInfos((questions) => {
      return questions.map((question) => {
        if (question.id == id) {
          question["answer"] = e.target.value == "yes";
        }

        return question;
      });
    });
  };

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
        status: STATIC.ORDER_STATUSES.PENDING_OWNER,
      }));
    }

    activateSuccessOrderPopup({
      text:
        "Booking updates successfully. Wait for a response from the " +
        (isOwner ? "tenant" : "owner"),
    });
  };

  const setUpdatedOffer = ({ status, cancelStatus = null }, orderId = null) => {
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
      offerStartDate,
      offerEndDate,
      offerPricePerDay
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
    activateSuccessOrderPopup({
      text: "The rental starts!",
      onClose: () => {},
      closeButtonText: "Return to Order",
    });

    setOrder((prev) => ({
      ...prev,
      status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
    }));
  };

  const validateQuestions = () => {
    let hasError = true;

    const updateQuestions = [];

    for (let i = 0; i < questionAnswerInfos.length; i++) {
      const updateQuestion = { ...questionAnswerInfos[i] };

      if (updateQuestion.answer && !updateQuestion.description) {
        hasError = false;
        updateQuestion["error"] = "Required for damaged";
      }

      updateQuestions.push(updateQuestion);
    }

    setQuestionAnswerInfos(updateQuestions);

    return hasError;
  };

  const onTenantGotListingApprove = async () => {
    try {
      if (!validateQuestions()) {
        return;
      }

      const res = await approveClientGotListing(
        order.acceptListingTenantToken,
        questionAnswerInfos,
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

  const onCreateDispute = async (description) => {
    try {
      if (isTenant) {
        await orderCancelByTenant({ id: order.id, description }, authToken);

        setOrder((prev) => ({
          ...prev,
          cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE,
        }));
      } else {
        await orderCancelByOwner({ id: order.id, description }, authToken);

        setOrder((prev) => ({
          ...prev,
          cancelStatus:
            STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE,
        }));
      }

      activateSuccessOrderPopup({
        text: "Dispute created successfully. Wait for the administrator to contact you",
      });
    } catch (e) {
      error.set(e.message);
    }
  };

  const onOrderAcceptCancelByOwner = async () => {
    try {
      await orderAcceptCancelByOwner(order.id, authToken);

      activateSuccessOrderPopup({
        text: "Order cancelled successfully",
        textWeight: 600,
      });

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

      activateSuccessOrderPopup({
        text: "Order cancelled successfully",
        textWeight: 600,
      });

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
        setUpdatedOffer({ status: STATIC.ORDER_STATUSES.REJECTED });
      } else {
        await orderFullCancel(order.id, authToken);

        setOrder((prev) => ({
          ...prev,
          cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
        }));
      }

      activateSuccessOrderPopup({
        text: "Booking cancelled successfully",
      });
    } catch (e) {
      error.set(e.message);
    }
  };

  const onPayedFastCancel = async ({ type, paypalId, cardNumber }) => {
    try {
      await orderFullCancelPayed(
        { id: order.id, type, paypalId, cardNumber },
        authToken
      );

      activateSuccessOrderPopup({
        text: `Order cancelled successfully. The money was returned to your paypal`,
      });

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
      if (!validateQuestions()) {
        return;
      }

      await finishedByOwner(
        order.acceptListingOwnerToken,
        questionAnswerInfos,
        authToken
      );

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

  const currentFee = isOwner ? order.ownerFee : order.tenantFee;

  const currentActionButtons = useOrderActions({
    order,
  });

  const statusBarStatuses = bookingStatuses.includes(order.status)
    ? [
        { title: "Make Booking", finished: true },
        {
          title: "Accepted",
          finished:
            order.status == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
        },
        { title: "Payed" },
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

  const handleBeforeMakeExtend = ({ price, fromDate, toDate }) => {
    setExtendPopupActive(false);
    setExtendApproveData({
      price,
      fromDate,
      toDate,
    });
  };

  const handleMakeBooking = async ({ feeActive, sendingMessage }) => {
    const dayDiff = getDaysDifference(
      order.offerEndDate,
      extendApproveData.fromDate
    );

    await extendOrder(
      {
        pricePerDay: extendApproveData.price,
        startDate: extendApproveData.fromDate,
        endDate: extendApproveData.toDate,
        listingId: order.listingId,
        feeActive,
        message: sendingMessage,
        parentOrderId: order.id,
      },
      authToken
    );

    if (dayDiff == 1) {
      success.set("Order extended successfully");
      router.push("/dashboard/orders");
    } else {
      success.set("New booking created successfully");
      router.push("/dashboard/bookings");
    }
  };

  if (extendApproveData) {
    return (
      <OrderExtendApprovementSection
        handleApprove={handleMakeBooking}
        setCurrentOpenImg={setCurrentOpenImg}
        listing={{
          listingImages: order.listingImages,
          name: order.listingName,
          userName: order.ownerName,
          userPhoto: order.ownerPhoto,
          userCountItems: order.listingCountStoredItems,
        }}
        handleGoBack={() => setExtendApproveData(null)}
        fromDate={extendApproveData.fromDate}
        toDate={extendApproveData.toDate}
        price={extendApproveData.price}
        fee={tenantBaseCommission}
      />
    );
  }

  return (
    <>
      <StatusBar statuses={statusBarStatuses} />

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

      {(order.defects.length > 0 || order.listingDopDefect) && (
        <div className="add-listings-box">
          <h3>Defects</h3>

          <div className="row">
            {order.defects.map((defect) => (
              <div className="col-12" key={defect.defectId}>
                <InputView value={defect.defectName} />
              </div>
            ))}

            {order.listingDopDefect && (
              <div className="col-12">
                <InputView value={order.listingDopDefect} />
              </div>
            )}
          </div>
        </div>
      )}

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
                <li>Fee: {currentFee}%</li>

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
                    <li
                      style={{
                        textDecoration: "line-through",
                      }}
                    >
                      Subtotal price with listing price per day $
                      {moneyFormat(
                        order.listingPricePerDay *
                          getDaysDifference(
                            order.offerStartDate,
                            order.offerEndDate
                          )
                      )}
                    </li>
                  )}

                <li>
                  Fact offer subtotal price: $
                  {moneyFormat(
                    order.offerPricePerDay *
                      getDaysDifference(
                        order.offerStartDate,
                        order.offerEndDate
                      )
                  )}
                </li>

                <li>
                  Total fee price: $
                  {moneyFormat(
                    (order.offerPricePerDay *
                      getDaysDifference(
                        order.offerStartDate,
                        order.offerEndDate
                      ) *
                      currentFee) /
                      100
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
                          Price with listing price per day to get $
                          {moneyFormat(
                            calculateCurrentTotalPrice(
                              order.offerStartDate,
                              order.offerEndDate,
                              order.listingPricePerDay,
                              "owner"
                            )
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
                          Price with listing price per day to pay $
                          {moneyFormat(
                            calculateCurrentTotalPrice(
                              order.offerStartDate,
                              order.offerEndDate,
                              order.listingPricePerDay,
                              "tenant"
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
                        order.offerStartDate,
                        order.offerEndDate,
                        order.offerPricePerDay,
                        "owner"
                      )
                    )}
                  </li>
                )}

                {isTenant && (
                  <li style={{ fontWeight: 700 }}>
                    Fact offer price to pay: $
                    {moneyFormat(
                      calculateCurrentTotalPrice(
                        order.offerStartDate,
                        order.offerEndDate,
                        order.offerPricePerDay,
                        "tenant"
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
                  Offer price per day: $
                  {moneyFormat(prevUpdateRequest.pricePerDay)}
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
                      Subtotal price with listing price per day $
                      {moneyFormat(
                        prevUpdateRequest.pricePerDay *
                          getDaysDifference(
                            prevUpdateRequest.startDate,
                            prevUpdateRequest.endDate
                          )
                      )}
                    </li>
                  )}

                <li>
                  Fact offer subtotal price: $
                  {moneyFormat(
                    prevUpdateRequest.pricePerDay *
                      getDaysDifference(
                        prevUpdateRequest.startDate,
                        prevUpdateRequest.endDate
                      )
                  )}
                </li>

                <li>
                  Total fee price: $
                  {moneyFormat(
                    (prevUpdateRequest.pricePerDay *
                      getDaysDifference(
                        prevUpdateRequest.startDate,
                        prevUpdateRequest.endDate
                      ) *
                      currentFee) /
                      100
                  )}
                </li>

                {isBookingWithoutAgreement &&
                  prevUpdateRequest.pricePerDay != order.listingPricePerDay && (
                    <li
                      style={{
                        textDecoration: "line-through",
                      }}
                    >
                      Price with listing price per day: $
                      {moneyFormat(
                        calculateCurrentTotalPrice(
                          prevUpdateRequest.startDate,
                          prevUpdateRequest.endDate,
                          order.listingPricePerDay
                        )
                      )}
                    </li>
                  )}

                <li style={{ fontWeight: 700 }}>
                  Fact offer price {isOwner ? "to get" : "to pay"}: $
                  {moneyFormat(
                    calculateCurrentTotalPrice(
                      prevUpdateRequest.startDate,
                      prevUpdateRequest.endDate,
                      prevUpdateRequest.pricePerDay
                    )
                  )}
                </li>
              </ul>
            </div>
          </div>

          <div className="col col-12 col-md-6 mt-4 mt-md-0 form-group">
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
                  Offer price per day: $
                  {moneyFormat(actualUpdateRequest.newPricePerDay)}
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
                    Subtotal price with listing price per day $
                    {moneyFormat(
                      actualUpdateRequest.newPricePerDay *
                        getDaysDifference(
                          actualUpdateRequest.newStartDate,
                          actualUpdateRequest.newEndDate
                        )
                    )}
                  </li>
                )}

                <li>
                  Fact offer subtotal price: $
                  {moneyFormat(
                    actualUpdateRequest.newPricePerDay *
                      getDaysDifference(
                        actualUpdateRequest.newStartDate,
                        actualUpdateRequest.newEndDate
                      )
                  )}
                </li>

                <li>
                  Total fee price: $
                  {moneyFormat(
                    (actualUpdateRequest.newPricePerDay *
                      getDaysDifference(
                        actualUpdateRequest.newStartDate,
                        actualUpdateRequest.newEndDate
                      ) *
                      currentFee) /
                      100
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
                    day: $
                    {moneyFormat(
                      calculateCurrentTotalPrice(
                        actualUpdateRequest.newStartDate,
                        actualUpdateRequest.newEndDate,
                        order.listingPricePerDay
                      )
                    )}
                  </li>
                )}

                <li style={{ fontWeight: 700 }}>
                  Fact offer price {isOwner ? "to get" : "to pay"}: $
                  {moneyFormat(
                    calculateCurrentTotalPrice(
                      actualUpdateRequest.newStartDate,
                      actualUpdateRequest.newEndDate,
                      actualUpdateRequest.newPricePerDay
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

      <SuccessIconPopup
        modalActive={successIconPopupState.active}
        closeModal={successIconPopupState.onClose}
        textWeight={successIconPopupState.textWeight}
        text={successIconPopupState.text}
        mainCloseButtonText={successIconPopupState.closeButtonText}
      />

      {questions &&
        questions.length > 0 &&
        (order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT ||
          order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) && (
          <div className="order_widget add-listings-box">
            {order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT && (
              <h3>Rental checklist</h3>
            )}
            {order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER && (
              <h3>Owner checklist</h3>
            )}

            {questionAnswerInfos.map((question) => {
              return (
                <>
                  <p>{question.question}</p>

                  <div class="form-group">
                    <ul class="facilities-list">
                      <li>
                        <label class="checkbox">
                          <input
                            type="checkbox"
                            name={`question[${question.id}]["yes"]`}
                            value="yes"
                            checked={question.answer}
                            onChange={(e) =>
                              handleUpdateQuestionAnswer(e, question.id)
                            }
                          />
                          <span>Yes</span>
                        </label>
                      </li>
                      <li>
                        <label class="checkbox">
                          <input
                            type="checkbox"
                            name={`question[${question.id}]["no"]`}
                            value="no"
                            checked={!question.answer}
                            onChange={(e) =>
                              handleUpdateQuestionAnswer(e, question.id)
                            }
                          />
                          <span>No</span>
                        </label>
                      </li>
                    </ul>
                  </div>

                  <InputWithIcon
                    placeholder="Describe the damage"
                    value={question.description}
                    onInput={(e) =>
                      handleUpdateQuestionDescription(e, question.id)
                    }
                    error={question.error}
                  />
                </>
              );
            })}
          </div>
        )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.FOR_TENANT_QRCODE
      ) && (
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

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.FOR_OWNER_QRCODE
      ) && (
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

      {isOwner &&
        order.conflictOrders &&
        order.status == STATIC.ORDER_STATUSES.PENDING_OWNER &&
        order.conflictOrders.length > 0 && (
          <div
            className="add-listings-box listings-sidebar listings-widget order_widget"
            style={{ marginTop: 0 }}
          >
            <h3>Conflict Bookings/Orders</h3>

            <ul
              className="conflicted-orders"
              style={{ listStyle: "none", padding: "0" }}
            >
              {order.conflictOrders.map((conflictOrder) => {
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
                  startDate,
                  endDate,
                  pricePrice
                );

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

                    <div>
                      Type:{" "}
                      {bookingStatuses.includes(conflictOrder.status)
                        ? "Booking"
                        : "Order"}
                    </div>

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

      {currentActionButtons.length > 0 && (
        <div className="order_widget add-listings-box">
          <h3>Operations</h3>
          <div className="booking-operations form-group">
            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
            ) && (
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
                  (!order.conflictOrders || order.conflictOrders.length < 1)
                }
                listingName={order.listingName}
                blockedDates={order.blockedDates}
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
                fee={currentFee}
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

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.PAY_BUTTON
            ) && (
              <PaypalTriggerModal
                amount={calculateCurrentTotalPrice(
                  order.offerStartDate,
                  order.offerEndDate,
                  order.offerPricePerDay,
                  "tenant"
                )}
                orderId={order.id}
                listingName={order.listingName}
                onTenantPayed={onTenantPayed}
                offerFee={order.tenantFee}
                pricePerDay={order.offerPricePerDay}
                offerStartDate={order.offerStartDate}
                offerEndDate={order.offerEndDate}
                authToken={authToken}
              />
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.TENANT_GOT_LISTING_APPROVE_BUTTON
            ) && (
              <TenantGotListingApproveTriggerModal
                onApprove={onTenantGotListingApprove}
              />
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.ACCEPT_FINISH_BUTTON
            ) && <FinishOrderTriggerModal onFinish={finishOrder} />}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.EXTEND_BUTTON
            ) && (
              <>
                <button
                  className="default-btn"
                  type="button"
                  onClick={() => setExtendPopupActive(true)}
                >
                  Extend Offer
                </button>
                <BookingModal
                  handleMakeBooking={handleBeforeMakeExtend}
                  price={order.offerPricePerDay}
                  minRentalDays={order.listingMinRentalDays}
                  fee={tenantBaseCommission}
                  createOrderModalActive={extendPopupActive}
                  closeModal={() => setExtendPopupActive(false)}
                  listingName={order.listingName}
                  blockedDates={order.blockedForRentalDates}
                  title="Extend Now"
                  startDate={
                    order.offerEndDate
                      ? increaseDateByOneDay(order.offerEndDate)
                      : null
                  }
                />
              </>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.CANCEL_BUTTON
            ) && (
              <CancelTriggerModal onCancel={onCancel} text="Cancel Request" />
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.FAST_CANCEL_BUTTON
            ) && (
              <PayedCancelTriggerModal
                onCancel={onPayedFastCancel}
                text="Cancel Request"
                order={order}
              />
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.CREATE_DISPUTE_BUTTON
            ) && (
              <CreateDisputeTriggerModal
                onCreateDispute={onCreateDispute}
                text="Create Dispute"
              />
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.ACCEPT_TENANT_CANCEL_BUTTON
            ) && <CancelTriggerModal onCancel={onOrderAcceptCancelByTenant} />}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.ACCEPT_OWNER_CANCEL_BUTTON
            ) && <CancelTriggerModal onCancel={onOrderAcceptCancelByOwner} />}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderContent;
