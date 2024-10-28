import { useContext, useState } from "react";
import { IndiceContext } from "../contexts";
import {
  createDispute,
  orderFullCancelPayed,
  orderFullCancel,
  rejectOrder,
} from "../services";
import useBookingAgreementPanel from "./useBookingAgreementPanel";
import STATIC from "../static";
import { useRouter } from "next/router";
import useCreateDispute from "./useCreateDispute";

const useOrderFastActions = ({ orders, setItemFields }) => {
  const { error, success, sessionUser, authToken } = useContext(IndiceContext);

  const router = useRouter();

  const [successIconPopupState, setSuccessIconPopupState] = useState({});
  const activateSuccessOrderPopup = ({
    closeButtonText = null,
    onClose = null,
    text = null,
    textWeight = null,
  }) => {
    const handleClose = () => {
      setSuccessIconPopupState({});
      if (onClose) {
        onClose();
      }
    };

    if (!closeButtonText) {
      closeButtonText = "Close";
    }

    setSuccessIconPopupState({
      active: true,
      text,
      closeButtonText: closeButtonText,
      onClose: handleClose,
      textWeight: textWeight ?? 600,
    });
  };

  const [activeCancel, setActiveCancel] = useState(false);
  const [activeCancelId, setActiveCancelId] = useState(null);

  const [activeFastCancel, setActiveFastCancel] = useState(false);
  const [activeFastCancelOrder, setActiveFastCancelOrder] = useState(null);

  const [orderToDispute, setOrderToDispute] = useState(null);
  const [disputeWindowActive, setDisputeWindowActive] = useState(false);
  const createDisputeData = useCreateDispute({ order: orderToDispute });

  const disputeCreate = (orderId) => {
    const order = findCurrentOrderById(orderId);
    setDisputeWindowActive(true);
    setOrderToDispute({ ...order });
  };

  const closeDisputeWindow = () => {
    setOrderToDispute(null);
    setDisputeWindowActive(false);
  };

  const onCreateDispute = async () => {
    try {
      const { orderPart } = await createDispute(
        {
          orderId: orderToDispute.id,
          type: createDisputeData.type,
          description: createDisputeData.description,
        },
        authToken
      );

      setItemFields(
        {
          disputeId: orderPart.disputeId,
          disputeStatus: STATIC.DISPUTE_STATUSES.OPEN,
          disputeType: createDisputeData.type,
          disputeDescription: createDisputeData.description,
        },
        orderToDispute.id
      );

      success.set("Dispute created successfully");

      closeDisputeWindow();
    } catch (e) {
      error.set(e.message);
    }
  };

  const [activePay, setActivePay] = useState(false);
  const [activePayOrder, setActivePayOrder] = useState(null);

  const [updateRequestModalActiveOrder, setUpdateRequestModalActiveOrder] =
    useState(null);
  const [acceptOrderModalActiveId, setAcceptOrderModalActiveId] =
    useState(null);
  const [rejectOrderModalActiveId, setRejectOrderModalActiveId] =
    useState(null);

  const findCurrentOrderById = (id) => orders.find((order) => order.id === id);

  const getAutoParentOrderUpdatedField = (data, orderId) => {
    const foundOrder = findCurrentOrderById(orderId);
    return { id: foundOrder.id, data };
  };

  const onWorkerPayed = () => {
    setItemFields(
      {
        status: STATIC.ORDER_STATUSES.IN_PROCESS,
      },
      activePayOrder.id
    );

    setActivePay(false);
    setActivePayOrder(null);
    activateSuccessOrderPopup({
      text: "Operation successful",
      onClose: () => router.push(`/dashboard/orders/${activePayOrder.id}/`),
      closeButtonText: "Move to Order",
    });
  };

  const handleAcceptCancel = async () => {
    try {
      const foundOrder = findCurrentOrderById(activeCancelId);
      const newOrderData = {};

      if (foundOrder.ownerId === sessionUser?.id) {
        await rejectOrder(activeCancelId, authToken);
        newOrderData["status"] = STATIC.ORDER_STATUSES.REJECTED;
      } else {
        await orderFullCancel(activeCancelId, authToken);
        newOrderData["cancelStatus"] =
          STATIC.ORDER_CANCELATION_STATUSES.CANCELLED;
      }

      setActiveCancelId(null);
      setActiveCancel(false);
      activateSuccessOrderPopup({ text: "Booking cancelled successfully" });
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleClickCancel = (orderId) => {
    setActiveCancelId(orderId);
    setActiveCancel(true);
  };

  const handleAcceptPayedFastCancel = async ({
    type,
    paypalId,
    cardNumber,
  }) => {
    try {
      await orderFullCancelPayed(
        {
          id: activeFastCancelOrder.id,
          receiptType: type,
          paypalId,
          cardNumber,
        },
        authToken
      );

      setActiveFastCancelOrder(null);
      setActiveFastCancel(false);
      activateSuccessOrderPopup({
        text: `Order cancelled successfully. A refund request has been sent to the administrator`,
      });
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleClickPayedFastCancel = (orderId) => {
    const order = findCurrentOrderById(orderId);
    setActiveFastCancelOrder(order);
    setActiveFastCancel(true);
  };

  const closePay = () => {
    setActivePayOrder(null);
    setActivePay(false);
  };

  const onCreateUpdateRequest = ({ orderId, price, finishTime }) => {
    let status = null;
    const updatedOrder = findCurrentOrderById(orderId);

    if (updatedOrder.ownerId === sessionUser?.id) {
      status = STATIC.ORDER_STATUSES.PENDING_WORKER;
    } else {
      status = STATIC.ORDER_STATUSES.PENDING_OWNER;
    }

    setItemFields(
      {
        newPrice: price,
        newFinishTime: finishTime,
        status,
      },
      orderId
    );
  };

  const getUpdatedByRequestOrderInfo = (orderId) => {
    const order = findCurrentOrderById(orderId);
    const offerPrice = order.requestId ? order.newPrice : order.offerPrice;

    return {
      offerPrice,
      requestId: null,
      newEndDate: null,
      newStartDate: null,
    };
  };

  const {
    updateRequestModalActive,
    setUpdateRequestModalActive,
    handleCreateUpdateRequest,
    acceptOrderModalActive,
    setAcceptOrderModalActive,
    handleAcceptRejectOrder,
    rejectOrderModalActive,
    setRejectOrderModalActive,
    handleAcceptAcceptOrder,
  } = useBookingAgreementPanel({
    setActualUpdateRequest: () => {},
    setPrevUpdateRequest: () => {},
    onCreateUpdateRequest,
  });

  const handleClickUpdateRequest = (orderId) => {
    const order = findCurrentOrderById(orderId);
    setUpdateRequestModalActiveOrder(order);
    setUpdateRequestModalActive(true);
  };

  const handleAcceptUpdateRequest = (data) => {
    const order = findCurrentOrderById(updateRequestModalActiveOrder.id);
    handleCreateUpdateRequest({
      ...data,
      order,
    });
    setAcceptOrderModalActiveId(null);
  };

  const handleClickReject = (orderId) => {
    setRejectOrderModalActiveId(orderId);
    setRejectOrderModalActive(true);
  };

  const handleAcceptReject = async () => {
    const order = findCurrentOrderById(rejectOrderModalActiveId);
    let updatedInfo = await handleAcceptRejectOrder(order);
    const updateOrderInfo = getUpdatedByRequestOrderInfo(order.id);
    updatedInfo = { ...updatedInfo, ...updateOrderInfo };
    setRejectOrderModalActiveId(null);
  };

  const handleClickAccept = (orderId) => {
    setAcceptOrderModalActiveId(orderId);
    setAcceptOrderModalActive(true);
  };

  const handleAcceptAccept = async () => {
    const order = findCurrentOrderById(acceptOrderModalActiveId);
    let updatedInfo = await handleAcceptAcceptOrder(order);
    const updateOrderInfo = getUpdatedByRequestOrderInfo(order.id);
    updatedInfo = { ...updatedInfo, ...updateOrderInfo };
    setAcceptOrderModalActiveId(null);
  };

  const closeActiveCancel = () => {
    setActiveCancel(false);
  };

  const closeActiveFastCancel = () => {
    setActiveFastCancel(false);
  };

  const closeActiveUpdateRequest = () => {
    setUpdateRequestModalActiveOrder(null);
    setUpdateRequestModalActive(false);
  };

  const closeAcceptOrderModal = () => {
    setAcceptOrderModalActive(false);
  };

  const closeRejectOrderModal = () => {
    setRejectOrderModalActive(false);
  };

  return {
    handleAcceptCancel,
    handleClickCancel,
    activeCancel,
    closeActiveCancel,

    handleClickPayedFastCancel,
    handleAcceptPayedFastCancel,
    activeFastCancel,
    activeFastCancelOrder,
    closeActiveFastCancel,

    handleClickUpdateRequest,
    handleAcceptUpdateRequest,
    activeUpdateRequest: updateRequestModalActive,
    closeActiveUpdateRequest,
    updateRequestModalActiveOrder,

    handleClickReject,
    handleAcceptReject,
    rejectOrderModalActive,
    closeRejectOrderModal,

    handleClickAccept,
    handleAcceptAccept,
    acceptOrderModalActive,
    closeAcceptOrderModal,

    activePay,
    closePay,
    onWorkerPayed,
    activePayOrder,

    successIconPopupState,

    createDisputeData,
    disputeWindowActive,
    disputeCreate,
    closeDisputeWindow,
    onCreateDispute,
  };
};

export default useOrderFastActions;
