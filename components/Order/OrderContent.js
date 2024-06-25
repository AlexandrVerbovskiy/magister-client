import React, { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  calculateCurrentTotalPrice,
  checkStringDateLowerOrEqualCurrentDate,
  generateProfileFilePath,
  getDaysDifference,
  getListingImageByType,
  increaseDateByOneDay,
  moneyFormat,
} from "../../utils";
import ImagePopup from "../_App/ImagePopup";
import MultyMarkersMap from "../Listings/MultyMarkersMap";
import STATIC from "../../static";
import {
  approveClientGotListing,
  finishedByOwner,
  orderFullCancel,
  orderFullCancelPayed,
  rejectOrder,
  extendOrder,
  createDispute,
} from "../../services";
import ErrorBlockMessage from "../_App/ErrorBlockMessage";
import StatusBlock from "../Listings/StatusBlock";
import InputView from "../../components/FormComponents/InputView";
import TextareaView from "../../components/FormComponents/TextareaView";
import {
  useCreateDispute,
  useOrderActions,
  useOrderDateError,
  useSingleOrderActions,
} from "../../hooks";
import InputWithIcon from "../FormComponents/InputWithIcon";
import StatusBar from "../StatusBar";
import SuccessIconPopup from "../../components/IconPopups/SuccessIconPopup";
import { useRouter } from "next/router";
import OrderExtendApprovementSection from "../Order/OrderExtendApprovementSection";
import Link from "next/link";
import CreateDisputeSection from "../Dispute/CreateDisputeSection";
import OrderPopups from "./OrderPopups";
import TenantGotListingApproveModal from "./TenantGotListingApproveModal";
import FinishOrderModal from "./FinishOrderModal";

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
  bankInfo,
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
  const createDisputeData = useCreateDispute({ order });

  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const closeCurrentOpenImg = () => setCurrentOpenImg(null);

  const [isOwner, setIsOwner] = useState(false);
  const [isTenant, setIsTenant] = useState(false);

  const [prevUpdateRequest, setPrevUpdateRequest] = useState(null);
  const [actualUpdateRequest, setActualUpdateRequest] = useState(null);
  const [questionAnswerInfos, setQuestionAnswerInfos] = useState([]);

  const isBookingWithoutAgreement =
    order.status == STATIC.ORDER_STATUSES.PENDING_OWNER ||
    order.status == STATIC.ORDER_STATUSES.PENDING_TENANT;

  const { CanBeErrorBaseDateSpan, checkErrorData, BaseDateSpan } =
    useOrderDateError({
      order,
    });

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
            `/dashboard/orders?type=${
              sessionUser.id == order.ownerId ? "owner" : "tenant"
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

    const totalPrice = localCalculateCurrentTotalPrice({
      startDate: offerStartDate,
      endDate: offerEndDate,
      pricePerDay: offerPricePerDay,
    });

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

    setTimeout(() => {
      setOrder((prev) => ({
        ...prev,
        status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
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
      text: `Order cancelled successfully. The money was returned to your paypal`,
    });

    setOrder((prev) => ({
      ...prev,
      cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
    }));
  };

  const onExtendOrder = () => {
    success.set("Order extended successfully");
    router.push("/dashboard/orders");
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

  const handleTenantGotListingApprove = async () => {
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

  const handleCreateDispute = async () => {
    try {
      const disputeId = await createDispute(
        {
          orderId: order.id,
          type: createDisputeData.type,
          description: createDisputeData.description,
        },
        authToken
      );

      setOrder((prev) => ({
        ...prev,
        disputeId,
        disputeStatus: STATIC.DISPUTE_STATUSES.OPEN,
        disputeType: createDisputeData.type,
        disputeDescription: createDisputeData.description,
      }));

      orderPopupsData.setActiveDisputeWindow(false);

      success.set("Dispute created success");
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleFinishOrder = async () => {
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
            order.status == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
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

  const onMakeExtend = ({ price, fromDate, toDate }) => {
    orderPopupsData.setExtendPopupActive(false);
    orderPopupsData.setExtendApproveData({
      price,
      fromDate,
      toDate,
    });
  };

  if (orderPopupsData.extendApproveData) {
    return (
      <OrderExtendApprovementSection
        handleApprove={orderPopupsData.handleMakeBooking}
        setCurrentOpenImg={setCurrentOpenImg}
        listing={{
          listingImages: order.listingImages,
          name: order.listingName,
          userName: order.ownerName,
          userPhoto: order.ownerPhoto,
          userCountItems: order.listingCountStoredItems,
        }}
        handleGoBack={() => orderPopupsData.setExtendApproveData(null)}
        fromDate={orderPopupsData.extendApproveData.fromDate}
        toDate={orderPopupsData.extendApproveData.toDate}
        price={orderPopupsData.extendApproveData.price}
        fee={tenantBaseCommission}
      />
    );
  }

  if (orderPopupsData.activeDisputeWindow) {
    return (
      <>
        <CreateDisputeSection
          {...createDisputeData}
          onGoBack={() => orderPopupsData.setActiveDisputeWindow(false)}
          setCurrentOpenImg={setCurrentOpenImg}
          needWrapping={false}
          onSubmit={handleCreateDispute}
        />
        <ImagePopup
          photoUrl={currentOpenImg}
          open={!!currentOpenImg}
          close={closeCurrentOpenImg}
        />
      </>
    );
  }

  const bookingAcceptView =
    ((actualUpdateRequest &&
      !checkStringDateLowerOrEqualCurrentDate(
        actualUpdateRequest.newStartDate
      )) ||
      (!actualUpdateRequest &&
        !checkStringDateLowerOrEqualCurrentDate(order.offerStartDate))) &&
    (!order.conflictOrders || order.conflictOrders.length < 1);

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
              open={!!currentOpenImg}
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
                          Price with listing price per day to pay $
                          {moneyFormat(
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
                    Fact offer price to get: $
                    {moneyFormat(
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
                    Fact offer price to pay: $
                    {moneyFormat(
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
                        localCalculateCurrentTotalPrice({
                          startDate: prevUpdateRequest.startDate,
                          endDate: prevUpdateRequest.endDate,
                          pricePerDay: order.listingPricePerDay,
                        })
                      )}
                    </li>
                  )}

                <li style={{ fontWeight: 700 }}>
                  Fact offer price {isOwner ? "to get" : "to pay"}: $
                  {moneyFormat(
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
                      localCalculateCurrentTotalPrice({
                        startDate: actualUpdateRequest.newStartDate,
                        endDate: actualUpdateRequest.newEndDate,
                        pricePerDay: order.listingPricePerDay,
                      })
                    )}
                  </li>
                )}

                <li style={{ fontWeight: 700 }}>
                  Fact offer price {isOwner ? "to get" : "to pay"}: $
                  {moneyFormat(
                    localCalculateCurrentTotalPrice({
                      startDate: actualUpdateRequest.newStartDate,
                      endDate: actualUpdateRequest.newEndDate,
                      pricePerDay: actualUpdateRequest.newPricePerDay,
                    })
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
                <React.Fragment key={question.id}>
                  <p>{question.question}</p>

                  <div className="form-group">
                    <ul className="facilities-list">
                      <li>
                        <label className="checkbox">
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
                        <label className="checkbox">
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
                </React.Fragment>
              );
            })}
          </div>
        )}

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.FOR_TENANT_QRCODE
      ) && (
        <div id="tenant-qr-code" className="order_widget add-listings-box">
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
        <div id="owner-qr-code" className="order_widget add-listings-box">
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

                const pricePerDay =
                  conflictOrder.newPricePerDay ??
                  conflictOrder.offerPricePerDay;

                const totalPrice = localCalculateCurrentTotalPrice({
                  startDate,
                  endDate,
                  pricePerDay,
                });

                return (
                  <li className="form-group" key={conflictOrder.id}>
                    <div className="d-flex justify-content-between">
                      <div>
                        Id:{" "}
                        <Link href={`/dashboard/orders/${conflictOrder.id}`}>
                          #{conflictOrder.id}
                        </Link>
                      </div>

                      <Link href={`/dashboard/orders/${conflictOrder.id}`}>
                        <StatusBlock
                          status={conflictOrder.status}
                          statusCancelled={order.cancelStatus}
                          disputeStatus={order.disputeStatus}
                          ownerId={conflictOrder.ownerId}
                          tenantId={conflictOrder.tenantId}
                          userId={sessionUser?.id}
                          dopClass="order-status-small-span"
                          endDate={order.offerEndDate}
                          payedId={order.paymentInfo?.id}
                          adminApproved={order.paymentInfo?.adminApproved}
                          waitingApproved={order.paymentInfo?.waitingApproved}
                        />
                      </Link>
                    </div>

                    <div>
                      Type:{" "}
                      {bookingStatuses.includes(conflictOrder.status)
                        ? "Booking"
                        : "Order"}
                    </div>

                    <div>
                      Rental:{" "}
                      <Link href={`/owner-listing-list/${tenantId}`}>
                        {tenantName}
                      </Link>
                    </div>

                    <div>
                      <BaseDateSpan startDate={startDate} endDate={endDate} />
                    </div>

                    <div>Price per day: ${moneyFormat(pricePerDay)}</div>

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

      {currentActionButtons.length > countDopAction && (
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
                {bookingAcceptView && (
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
              <button
                className="default-btn"
                type="button"
                onClick={() => orderPopupsData.setPaypalModalActive(true)}
              >
                Pay
              </button>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.PAY_UPDATE_BUTTON
            ) && (
              <Link
                className="default-btn"
                href={`/dashboard/pay-by-credit-card/` + order.id}
              >
                Update payment
              </Link>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.TENANT_REVIEW
            ) && (
              <Link
                className="default-btn"
                href={`/dashboard/creating-renter-review/` + order.id}
              >
                Leave a review
              </Link>
            )}

            {currentActionButtons.includes(
              STATIC.ORDER_ACTION_BUTTONS.OWNER_REVIEW
            ) && (
              <Link
                className="default-btn"
                href={`/dashboard/creating-owner-review/` + order.id}
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
                onClick={() => setTenantGotListingApproveModalActive(true)}
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
                onClick={() => setFinishOrderModalActive(true)}
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
              <button
                type="button"
                className="default-btn error-btn"
                onClick={() => orderPopupsData.setActiveDisputeWindow(true)}
              >
                Open dispute
              </button>
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
                href={`/dashboard/chat/${order.chatId}`}
              >
                Chat
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
              onMakeExtend={onMakeExtend}
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

      {order.disputeId && (
        <ErrorBlockMessage>
          <b>Dispute type:</b> {STATIC.DISPUTE_TYPE_TITLE[order.disputeType]}
          <br />
          <b>Dispute description:</b> {order.disputeDescription}
        </ErrorBlockMessage>
      )}
    </>
  );
};

export default OrderContent;
