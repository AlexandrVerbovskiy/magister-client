import { useContext, useState } from "react";
import { IndiceContext } from "../contexts";
import {
  extendOrder,
  orderAcceptCancelByOwner,
  orderAcceptCancelByTenant,
  orderCancelByOwner,
  orderCancelByTenant,
  orderFullCancel,
  orderFullCancelPayed,
  rejectOrder,
} from "../services";
import useBookingAgreementPanel from "./useBookingAgreementPanel";
import STATIC from "../static";
import { useRouter } from "next/router";
import { getDaysDifference } from "../utils";

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
      closeButtonText = "Close Popup";
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

  const [activeCreateDispute, setActiveCreateDispute] = useState(false);
  const [activeCreateDisputeId, setActiveCreateDisputeId] = useState(null);

  const [activeOrderAcceptCancelByTenant, setActiveOrderAcceptCancelByTenant] =
    useState(false);
  const [
    activeOrderAcceptCancelByTenantId,
    setActiveOrderAcceptCancelByTenantId,
  ] = useState(null);

  const [activeOrderAcceptCancelByOwner, setActiveOrderAcceptCancelByOwner] =
    useState(false);
  const [
    activeOrderAcceptCancelByOwnerId,
    setActiveOrderAcceptCancelByOwnerId,
  ] = useState(null);

  const [activePay, setActivePay] = useState(false);
  const [activePayOrder, setActivePayOrder] = useState(null);

  const [updateRequestModalActiveOrder, setUpdateRequestModalActiveOrder] =
    useState({});
  const [acceptOrderModalActiveId, setAcceptOrderModalActiveId] =
    useState(null);
  const [rejectOrderModalActiveId, setRejectOrderModalActiveId] =
    useState(null);

  const [extendModalActive, setExtendModalActive] = useState(false);
  const [extendModalActiveOrder, setExtendModalActiveOrder] = useState({});
  const [extendModalApproveActive, setExtendModalApproveActive] =
    useState(false);
  const [extendModalApproveData, setExtendModalApproveData] = useState(null);

  const findCurrentOrderById = (id) => {
    let foundOrder = orders.find((order) => order.id === id);

    if (!foundOrder) {
      for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < orders[i].extendOrders.length; j++) {
          if (orders[i].extendOrders[j].id === id) {
            foundOrder = orders[i].extendOrders[j];
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
        status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
      },
      activePayOrder.id
    );

    setActivePay(false);
    setActivePayOrder(null);
    activateSuccessOrderPopup({
      text: "Operation successful",
      onClose: () => router.push("/dashboard/orders/" + activePayOrder.id),
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
    setExtendModalActiveOrder({});
    setExtendModalActive(false);
  };

  const closeApproveExtendOrder = () => {
    setExtendModalApproveData(null);
    setExtendModalApproveActive(false);
  };

  const handleClickExtendOrder = (orderId) => {
    setExtendModalActiveOrder(findCurrentOrderById(orderId));
    setExtendModalActive(true);
  };

  const handleClickApproveExtendOrder = ({ price, fromDate, toDate }) => {
    setExtendModalActive(false);
    setExtendModalApproveActive(true);
    setExtendModalApproveData({
      price,
      fromDate,
      toDate,
      order: extendModalActiveOrder,
    });
    setExtendModalActiveOrder({});
  };

  const acceptApproveExtendOrder = async ({ feeActive, sendingMessage }) => {
    const dayDiff = getDaysDifference(
      extendModalApproveData.order.offerEndDate,
      extendModalApproveData.fromDate
    );

    await extendOrder(
      {
        pricePerDay: extendModalApproveData.price,
        startDate: extendModalApproveData.fromDate,
        endDate: extendModalApproveData.toDate,
        listingId: extendModalApproveData.order.listingId,
        feeActive,
        message: sendingMessage,
        parentOrderId: extendModalApproveData.order.id,
      },
      authToken
    );

    setExtendModalApproveData(null);
    setExtendModalApproveActive(false);

    if (dayDiff == 2) {
      success.set("Order extended successfully");
      router.push("/dashboard/orders", undefined, {
        unstable_skipClientCache: true,
      });
    } else {
      success.set("New booking created successfully");
      router.push("/dashboard/bookings");
    }
  };

  const handleAcceptPayedFastCancel = async ({
    type,
    paypalId,
    cardNumber,
  }) => {
    try {
      await orderFullCancelPayed(
        { id: activeFastCancelOrder.id, type, paypalId, cardNumber },
        authToken
      );

      autoParentOrderSetItemField(
        {
          cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
        },
        activeFastCancelOrder.id
      );

      activateSuccessOrderPopup({
        text: `Order cancelled successfully. The money was returned to your paypal`,
      });
      setActiveFastCancelOrder(null);
      setActiveFastCancel(false);
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleClickPayedFastCancel = (orderId) => {
    const order = findCurrentOrderById(orderId);
    setActiveFastCancelOrder(order);
    setActiveFastCancel(true);
  };

  const handleAcceptCreateDispute = async (description) => {
    try {
      if (
        findCurrentOrderById(activeCreateDisputeId).ownerId === sessionUser?.id
      ) {
        await orderCancelByOwner(
          { id: activeCreateDisputeId, description },
          authToken
        );

        autoParentOrderSetItemField(
          {
            cancelStatus:
              STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE,
          },
          activeCreateDisputeId
        );
      } else {
        await orderCancelByTenant(
          { id: activeCreateDisputeId, description },
          authToken
        );

        autoParentOrderSetItemField(
          {
            cancelStatus:
              STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE,
          },
          activeCreateDisputeId
        );
      }

      setActiveCreateDisputeId(null);
      setActiveCreateDispute(false);

      activateSuccessOrderPopup({
        text: "Dispute created successfully. Wait for the administrator to contact you",
      });
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleClickCreateDispute = (orderId) => {
    setActiveCreateDisputeId(orderId);
    setActiveCreateDispute(true);
  };

  const handleOrderAcceptAcceptCancelByTenant = async () => {
    try {
      await orderAcceptCancelByOwner(
        activeOrderAcceptCancelByTenantId,
        authToken
      );

      autoParentOrderSetItemField(
        {
          cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
        },
        activeOrderAcceptCancelByTenantId
      );

      setActiveOrderAcceptCancelByTenantId(null);
      setActiveOrderAcceptCancelByTenant(false);
      activateSuccessOrderPopup({ text: "Order cancelled successfully" });
    } catch (e) {
      console.log(e);
    }
  };

  const handleOrderClickAcceptCancelByTenant = (orderId) => {
    setActiveOrderAcceptCancelByTenantId(orderId);
    setActiveOrderAcceptCancelByTenant(true);
  };

  const handleOrderAcceptAcceptCancelByOwner = async () => {
    try {
      await orderAcceptCancelByOwner(
        activeOrderAcceptCancelByOwnerId,
        authToken
      );

      autoParentOrderSetItemField(
        {
          cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
        },
        activeOrderAcceptCancelByOwnerId
      );

      setActiveOrderAcceptCancelByOwnerId(null);
      setActiveOrderAcceptCancelByOwner(false);
      activateSuccessOrderPopup({ text: "Order cancelled successfully" });
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleOrderClickAcceptCancelByOwner = (orderId) => {
    setActiveOrderAcceptCancelByOwnerId(orderId);
    setActiveOrderAcceptCancelByOwner(true);
  };

  const closePay = () => {
    setActivePayOrder(null);
    setActivePay(false);
  };

  const handleClickPay = (orderId) => {
    const order = findCurrentOrderById(orderId);
    setActivePayOrder(order);
    setActivePay(true);
  };

  const onCreateUpdateRequest = ({
    orderId,
    price,
    fromDate,
    toDate,
    requestId,
  }) => {
    let status = null;

    if (findCurrentOrderById(orderId).ownerId === sessionUser?.id) {
      status = STATIC.ORDER_STATUSES.PENDING_TENANT;
    } else {
      status = STATIC.ORDER_STATUSES.PENDING_OWNER;
    }

    autoParentOrderSetItemField(
      {
        newPricePerDay: price,
        newStartDate: fromDate,
        newEndDate: toDate,
        status,
        requestId,
      },
      orderId
    );
    setUpdateRequestModalActiveOrder(null);
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
  };

  const closeActiveCancel = () => {
    setActiveCancel(false);
  };

  const closeActiveFastCancel = () => {
    setActiveFastCancel(false);
  };

  const closeActiveCreateDispute = () => {
    setActiveCreateDispute(false);
  };

  const closeActiveOrderAcceptCancelByTenant = () => {
    setActiveOrderAcceptCancelByTenant(false);
  };

  const closeActiveOrderAcceptCancelByOwner = () => {
    setActiveOrderAcceptCancelByOwner(false);
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

    handleClickCreateDispute,
    handleAcceptCreateDispute,
    activeCreateDispute,
    closeActiveCreateDispute,

    handleOrderClickAcceptCancelByTenant,
    handleOrderAcceptAcceptCancelByTenant,
    activeOrderAcceptCancelByTenant,
    closeActiveOrderAcceptCancelByTenant,

    handleOrderClickAcceptCancelByOwner,
    handleOrderAcceptAcceptCancelByOwner,
    activeOrderAcceptCancelByOwner,
    closeActiveOrderAcceptCancelByOwner,

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
    extendModalApproveActive,
    extendModalApproveData,
    closeExtendOrder,
    closeApproveExtendOrder,
    acceptApproveExtendOrder,

    successIconPopupState,
  };
};

export default useOrderFastActions;
