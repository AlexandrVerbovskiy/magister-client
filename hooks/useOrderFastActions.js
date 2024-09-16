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
import { cloneObject, getDaysDifference } from "../utils";
import useCreateDispute from "./useCreateDispute";

const useOrderFastActions = ({
  orders,
  setItemFields,
  updateItemsParticularly,
}) => {
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

  const getRemovedConflictOrders = (order) => {
    const newOrderParts = {};
    const ordersWithCurrentListing = getOrdersWithOrderListing(order);

    ordersWithCurrentListing.forEach((orderWithCurrentListing) => {
      const newConflictOrders = orderWithCurrentListing.conflictOrders.filter(
        (conflictOrder) => conflictOrder.id != order.id
      );

      const newExtendOrders = orderWithCurrentListing.extendOrders.map(
        (extendOrder) => {
          if (extendOrder.id == order.id) {
            return { ...extendOrder, ...order };
          } else {
            return {
              ...extendOrder,
              conflictOrders: extendOrder.conflictOrders.filter(
                (conflictOrder) => conflictOrder.id != order.id
              ),
            };
          }
        }
      );

      newOrderParts[orderWithCurrentListing.id] = {
        conflictOrders: newConflictOrders,
        extendOrders: newExtendOrders,
      };
    });

    return newOrderParts;
  };

  const getUpdateConflictOrders = (order) => {
    const newOrderParts = {};
    const ordersWithCurrentListing = getOrdersWithOrderListing(order);

    ordersWithCurrentListing.forEach((orderWithCurrentListing) => {
      const newConflictOrders = orderWithCurrentListing.conflictOrders.filter(
        (conflictOrder) => conflictOrder.id != order.id
      );

      const newExtendOrders = orderWithCurrentListing.extendOrders.map(
        (extendOrder) => {
          if (extendOrder.id == order.id) {
            return { ...extendOrder, ...order };
          } else {
            const extendConflictOrders = extendOrder.conflictOrders.filter(
              (conflictOrder) => conflictOrder.id != order.id
            );

            return {
              ...extendOrder,
              conflictOrders: [
                ...extendConflictOrders,
                {
                  id: order.id,
                  requestId: order.requestId,
                  offerStartDate: order.offerStartDate,
                  offerEndDate: order.offerEndDate,
                  newStartDate: order.newStartDate,
                  newEndDate: order.newEndDate,
                },
              ],
            };
          }
        }
      );

      newOrderParts[orderWithCurrentListing.id] = {
        conflictOrders: [...newConflictOrders, order],
        extendOrders: newExtendOrders,
      };
    });

    return newOrderParts;
  };

  const getAddConflictOrders = (order) => {
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

    return getUpdateConflictOrders(updatedOrder);
  };

  const addConflictOrderInfoToList = (list, order) => {
    const orderToUpdateInfo = getAutoParentOrderUpdatedField(order, order.id);

    if (list[orderToUpdateInfo.id]) {
      list[orderToUpdateInfo.id] = {
        ...list[orderToUpdateInfo.id],
        ...orderToUpdateInfo.data,
      };
    } else {
      list[orderToUpdateInfo.id] = orderToUpdateInfo.data;
    }

    return list;
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

  const getAutoParentOrderUpdatedField = (data, orderId) => {
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

      return { id: parentId, data: { extendOrders: newExtendOrders } };
    } else {
      return { id: foundOrder.id, data };
    }
  };

  const autoParentOrderSetItemField = (data, orderId) => {
    const updatedInfo = getAutoParentOrderUpdatedField(data, orderId);
    setItemFields(updatedInfo.data, updatedInfo.id);
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
      const newOrderData = {};

      let ordersToUpdate = {};

      orders.forEach((order) => {
        const newOrder = cloneObject(order);

        newOrder.conflictOrders = newOrder.conflictOrders.filter(
          (conflictOrder) => {
            conflictOrder.id != activeCancelId;
          }
        );

        newOrder.extendOrders = order.extendOrders.map((extension) => {
          extension.conflictOrders.filter((conflictOrder) => {
            conflictOrder.id != activeCancelId;
          });
          return extension;
        });

        if (foundOrder.orderParentId) {
          if (newOrder.id == foundOrder.orderParentId) {
            newOrder.extendOrders = order.extendOrders.filter(
              (extension) => extension.id != activeCancelId
            );
          }
        }

        ordersToUpdate[newOrder.id] = newOrder;
      });

      if (foundOrder.ownerId === sessionUser?.id) {
        await rejectOrder(activeCancelId, authToken);
        newOrderData["status"] = STATIC.ORDER_STATUSES.REJECTED;
      } else {
        await orderFullCancel(activeCancelId, authToken);
        newOrderData["cancelStatus"] =
          STATIC.ORDER_CANCELATION_STATUSES.CANCELLED;
      }

      updateItemsParticularly(ordersToUpdate);

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

      const ordersToUpdate = addConflictOrderInfoToList(
        getRemovedConflictOrders(activeFastCancelOrder),
        {
          cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
          id: activeFastCancelOrder.id,
        }
      );

      updateItemsParticularly(ordersToUpdate);

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

    let ordersToUpdateBase = {};
    if (updatedOrder.ownerId === sessionUser?.id) {
      ordersToUpdateBase = getUpdateConflictOrders({
        ...updatedOrder,
        ...updatedParts,
      });
    } else {
      ordersToUpdateBase = getRemovedConflictOrders(updatedOrder);
    }

    const ordersToUpdate = addConflictOrderInfoToList(ordersToUpdateBase, {
      ...updatedParts,
      id: orderId,
    });

    updateItemsParticularly(ordersToUpdate);
  };

  const getUpdatedByRequestOrderInfo = (orderId) => {
    const order = findCurrentOrderById(orderId);

    const offerPricePerDay = order.requestId
      ? order.newPricePerDay
      : order.offerPricePerDay;
    const offerStartDate = order.requestId
      ? order.newStartDate
      : order.offerStartDate;
    const offerEndDate = order.requestId
      ? order.newEndDate
      : order.offerEndDate;

    return {
      offerPricePerDay,
      offerStartDate,
      offerEndDate,
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

    const ordersToUpdate = addConflictOrderInfoToList(
      getRemovedConflictOrders(order),
      {
        ...updatedInfo,
        id: order.id,
      }
    );

    updateItemsParticularly(ordersToUpdate);
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

    const ordersToUpdate = addConflictOrderInfoToList(
      getAddConflictOrders(order),
      {
        ...updatedInfo,
        id: order.id,
      }
    );

    updateItemsParticularly(ordersToUpdate);
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
