import { useContext, useState } from "react";
import { IndiceContext } from "../contexts";
import {
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

const useOrderFastActions = ({ orders, setItemFields }) => {
  const { error, success, sessionUser, authToken } = useContext(IndiceContext);

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

  const onTenantPayed = () => {
    setItemFields(
      {
        status: STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
      },
      activePayOrder.id
    );

    setActivePay(false);
    setActivePayOrder(null);
    success.set("Operation successful");
  };

  const [updateRequestModalActiveOrder, setUpdateRequestModalActiveOrder] =
    useState({});
  const [acceptOrderModalActiveId, setAcceptOrderModalActiveId] =
    useState(null);
  const [rejectOrderModalActiveId, setRejectOrderModalActiveId] =
    useState(null);

  const findCurrentOrderById = (id) => orders.find((order) => order.id === id);

  const handleAcceptCancel = async () => {
    try {
      if (findCurrentOrderById(activeCancelId).ownerId === sessionUser?.id) {
        await rejectOrder(activeCancelId, authToken);
        setItemFields(
          { status: STATIC.ORDER_STATUSES.REJECTED },
          activeCancelId
        );
      } else {
        await orderFullCancel(activeCancelId, authToken);
        setItemFields(
          { cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED },
          activeCancelId
        );
      }

      setActiveCancelId(null);
      setActiveCancel(false);
      success.set("Booking cancelled successfully");
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleClickCancel = (orderId) => {
    setActiveCancelId(orderId);
    setActiveCancel(true);
  };

  const handleAcceptPayedFastCancel = async () => {
    try {
      await orderFullCancelPayed(activeFastCancelOrder.id, authToken);

      setItemFields(
        {
          cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
        },
        activeFastCancelOrder.id
      );

      success.set(
        `Order cancelled successfully. The money was returned to your paypal`
      );
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
      if (findCurrentOrderById(activeCancelId).ownerId === sessionUser?.id) {
        await orderCancelByOwner(
          { id: activeCreateDisputeId, description },
          authToken
        );

        setItemFields(
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

        setItemFields(
          {
            cancelStatus:
              STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE,
          },
          activeCreateDisputeId
        );
      }

      setActiveCreateDisputeId(null);
      setActiveCreateDispute(false);

      success.set(
        "Dispute created successfully. Wait for the administrator to contact you"
      );
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleClickCreateDispute = (orderId) => {
    setActiveCancelId(orderId);
    setActiveCancel(true);
  };

  const handleOrderAcceptAcceptCancelByTenant = async () => {
    try {
      await orderAcceptCancelByOwner(
        activeOrderAcceptCancelByTenantId,
        authToken
      );

      setItemFields(
        {
          cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
        },
        activeOrderAcceptCancelByTenantId
      );

      setActiveOrderAcceptCancelByTenantId(null);
      setActiveOrderAcceptCancelByTenant(false);
      success.set("Order cancelled successfully");
    } catch (e) {
      error.set(e.message);
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

      setItemFields(
        {
          cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
        },
        activeOrderAcceptCancelByOwnerId
      );

      setActiveOrderAcceptCancelByOwnerId(null);
      setActiveOrderAcceptCancelByOwner(false);
      success.set("Order cancelled successfully");
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleOrderClickAcceptCancelByOwner = (orderId) => {
    setActiveOrderAcceptCancelByOwnerId(orderId);
    setActiveOrderAcceptCancelByOwner(true);
  };

  const handleClosePay = () => {
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

    setItemFields(
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
      setItemFields({ ...data }, orderId);
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
    handleClosePay,
    onTenantPayed,
    activePayOrder,
  };
};

export default useOrderFastActions;
