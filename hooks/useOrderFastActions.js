import { useContext, useState } from "react";
import { IndiceContext } from "../contexts";
import {
  createDispute,
  extendOrder,
  orderFullCancelPayed,
  orderFullCancel,
  rejectOrder,
} from "../services";
import useBookingAgreementPanel from "./useBookingAgreementPanel";
import STATIC from "../static";
import { useRouter } from "next/router";
import { getDaysDifference, hasPayError } from "../utils";
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

  const getOrdersWithOrderListing = (order) => {
    return orders.filter(
      (checkOrder) =>
        checkOrder.listingId === order.listingId && checkOrder.id !== order.id
    );
  };

  const removeConflictOrder = (order) => {
    const ordersWithCurrentListing = getOrdersWithOrderListing(order);

    ordersWithCurrentListing.forEach((orderWithCurrentListing) => {
      const newConflictOrders = orderWithCurrentListing.conflictOrders.filter(
        (conflictOrder) => conflictOrder.id != order.id
      );

      const newExtendOrders = orderWithCurrentListing.extendOrders.map(
        (extendOrder) => ({
          ...extendOrder,
          conflictOrders: extendOrder.conflictOrders.filter(
            (conflictOrder) => conflictOrder.id != order.id
          ),
        })
      );

      setItemFields(
        {
          conflictOrders: newConflictOrders,
          extendOrders: newExtendOrders,
        },
        orderWithCurrentListing.id
      );
    });
  };

  const updateConflictOrder = (order) => {
    const ordersWithCurrentListing = getOrdersWithOrderListing(order);

    ordersWithCurrentListing.forEach((orderWithCurrentListing) => {
      const newConflictOrders = orderWithCurrentListing.conflictOrders.filter(
        (conflictOrder) => conflictOrder.id != order.id
      );

      const newExtendOrders = orderWithCurrentListing.extendOrders.map(
        (extendOrder) => {
          const extendConflictOrders = extendOrder.conflictOrders.filter(
            (conflictOrder) => conflictOrder.id != order.id
          );

          return {
            ...extendOrder,
            conflictOrders: [...extendConflictOrders, order],
          };
        }
      );

      setItemFields(
        {
          conflictOrders: [...newConflictOrders, order],
          extendOrders: newExtendOrders,
        },
        orderWithCurrentListing.id
      );
    });
  };

  const addConflictOrder = (order) => {
    const blockedStartDate = order.requestId
      ? order.newStartDate
      : order.offerStartDate;
    const blockedEndDate = order.requestId
      ? order.newEndDate
      : order.offerEndDate;

    const updatedOrder = {
      ...order,
      offerStartDate: blockedStartDate,
      offerEndDate: blockedEndDate,
      newStartDate: null,
      newEndDate: null,
    };

    updateConflictOrder(updatedOrder);
  };

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

      autoParentOrderSetItemField(
        {
          disputeId: orderPart.disputeId,
          disputeStatus: STATIC.DISPUTE_STATUSES.OPEN,
          disputeType: createDisputeData.type,
          disputeDescription: createDisputeData.description,
        },
        orderToDispute.id
      );

      success.set("Dispute created success");

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

  const [extendModalActive, setExtendModalActive] = useState(false);
  const [extendModalActiveOrder, setExtendModalActiveOrder] = useState(null);

  const findCurrentOrderById = (id) => {
    let foundOrder = orders.find((order) => order.id === id);

    if (!foundOrder) {
      for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < orders[i].extendOrders.length; j++) {
          if (orders[i].extendOrders[j].id === id) {
            foundOrder = { ...orders[i], ...orders[i].extendOrders[j] };
          }
        }
      }
    }

    return foundOrder;
  };

  const autoParentOrderSetItemField = (data, orderId) => {
    const foundOrder = findCurrentOrderById(orderId);
    const parentId = foundOrder.orderParentId;

    if (parentId) {
      const parentOrder = findCurrentOrderById(foundOrder.orderParentId);
      const extendOrders = parentOrder.extendOrders;
      const newExtendOrders = extendOrders.map((order) => {
        if (order.id === foundOrder.id) {
          return { ...order, ...data };
        } else {
          return { ...order };
        }
      });

      setItemFields({ extendOrders: newExtendOrders }, parentId);
    } else {
      setItemFields(data, foundOrder.id);
    }
  };

  const onTenantPayed = () => {
    autoParentOrderSetItemField(
      {
        status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT,
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

      if (foundOrder.ownerId === sessionUser?.id) {
        await rejectOrder(activeCancelId, authToken);

        autoParentOrderSetItemField(
          { status: STATIC.ORDER_STATUSES.REJECTED },
          activeCancelId
        );
      } else {
        await orderFullCancel(activeCancelId, authToken);

        autoParentOrderSetItemField(
          { cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED },
          activeCancelId
        );
      }

      removeConflictOrder(foundOrder);
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

  const closeExtendOrder = () => {
    setExtendModalActiveOrder(null);
    setExtendModalActive(false);
  };

  const handleClickExtendOrder = (orderId) => {
    setExtendModalActiveOrder(findCurrentOrderById(orderId));
    setExtendModalActive(true);
  };

  const handleClickApproveExtendOrder = async ({
    price,
    fromDate,
    toDate,
    feeActive,
    sendingMessage,
  }) => {
    try {
      const dayDiff = getDaysDifference(
        extendModalActiveOrder.offerEndDate,
        extendModalActiveOrder.fromDate
      );

      await extendOrder(
        {
          pricePerDay: price,
          startDate: fromDate,
          endDate: toDate,
          listingId: extendModalActiveOrder.listingId,
          feeActive,
          message: sendingMessage,
          parentOrderId: extendModalActiveOrder.id,
        },
        authToken
      );

      if (dayDiff == 1) {
        success.set("Order extended successfully");
      } else {
        success.set("New booking created successfully");
      }

      router.push("/dashboard/orders/", undefined, {
        unstable_skipClientCache: true,
      });
    } catch (e) {
      error.set(e.message);
    }
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

      autoParentOrderSetItemField(
        {
          cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
        },
        activeFastCancelOrder.id
      );

      removeConflictOrder(activeFastCancelOrder);
      setActiveFastCancelOrder(null);
      setActiveFastCancel(false);
      activateSuccessOrderPopup({
        text: `Order cancelled successfully. The money was returned to your paypal`,
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

  const handleClickPay = (orderId) => {
    const order = findCurrentOrderById(orderId);
    const payError = hasPayError({ order, sessionUser });

    if (payError) {
      error.set(payError);
    } else {
      setActivePayOrder(order);
      setActivePay(true);
    }
  };

  const onCreateUpdateRequest = ({
    orderId,
    price,
    fromDate,
    toDate,
    request,
  }) => {
    let status = null;
    const requestId = request.id;
    const updatedOrder = findCurrentOrderById(orderId);

    if (updatedOrder.ownerId === sessionUser?.id) {
      status = STATIC.ORDER_STATUSES.PENDING_TENANT;
    } else {
      status = STATIC.ORDER_STATUSES.PENDING_OWNER;
    }

    const updatedParts = {
      newPricePerDay: price,
      newStartDate: fromDate,
      newEndDate: toDate,
      status,
      requestId,
      conflictOrders: [],
    };

    autoParentOrderSetItemField(updatedParts, orderId);
    setUpdateRequestModalActiveOrder(null);

    if (updatedOrder.ownerId === sessionUser?.id) {
      updateConflictOrder({ ...updatedOrder, ...updatedParts });
    } else {
      removeConflictOrder(updatedOrder);
    }
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
    setUpdatedOffer: (data, orderId) => {
      autoParentOrderSetItemField({ ...data }, orderId);
      setRejectOrderModalActiveId(null);
      setAcceptOrderModalActiveId(null);
    },
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
    handleCreateUpdateRequest({
      ...data,
      orderId: updateRequestModalActiveOrder.id,
    });
  };

  const handleClickReject = (orderId) => {
    setRejectOrderModalActiveId(orderId);
    setRejectOrderModalActive(true);
  };

  const handleAcceptReject = () => {
    const order = findCurrentOrderById(rejectOrderModalActiveId);
    handleAcceptRejectOrder(
      rejectOrderModalActiveId,
      order.ownerId === sessionUser?.id
    );
  };

  const handleClickAccept = (orderId) => {
    setAcceptOrderModalActiveId(orderId);
    setAcceptOrderModalActive(true);
  };

  const handleAcceptAccept = () => {
    const order = findCurrentOrderById(acceptOrderModalActiveId);

    handleAcceptAcceptOrder(
      acceptOrderModalActiveId,
      order.ownerId === sessionUser?.id
    );

    addConflictOrder(order);
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

    handleClickPay,
    activePay,
    closePay,
    onTenantPayed,
    activePayOrder,

    handleClickExtendOrder,
    handleClickApproveExtendOrder,
    extendModalActive,
    extendModalActiveOrder,
    closeExtendOrder,

    successIconPopupState,

    createDisputeData,
    disputeWindowActive,
    disputeCreate,
    closeDisputeWindow,
    onCreateDispute,
  };
};

export default useOrderFastActions;
