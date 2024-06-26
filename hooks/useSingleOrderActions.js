import { useContext, useState } from "react";
import useBookingAgreementPanel from "./useBookingAgreementPanel";
import { IndiceContext } from "../contexts";
import {
  createDispute,
  extendOrder,
  orderFullCancel,
  orderFullCancelPayed,
  rejectOrder,
} from "../services";
import useCreateDispute from "./useCreateDispute";

const useSingleOrderActions = ({
  order,
  setUpdatedOffer,
  setActualUpdateRequest,
  setPrevUpdateRequest,
  onCreateUpdateRequest,
  onCancel,
  onExtendOrder,
  setError,
  onAcceptOrder = null,
  onRejectOrder = null,
  onPayedFastCancel = null,
  onDisputeOpened = null,
}) => {
  const { authToken, sessionUser } = useContext(IndiceContext);

  const [extendPopupActive, setExtendPopupActive] = useState(false);
  const [extendApproveData, setExtendApproveData] = useState(null);
  const [activeDisputeWindow, setActiveDisputeWindow] = useState(false);
  const [paypalModalActive, setPaypalModalActive] = useState(false);

  const [cancelModalActive, setCancelModalActive] = useState(false);
  const [payedCancelModalActive, setPayedCancelModalActive] = useState(false);
  const [payedCancelDisabled, setPayedCancelDisabled] = useState(false);
  const createDisputeData = useCreateDispute({ order });

  const ownerId = order.ownerId;

  const handleOpenDispute = async () => {
    try {
      const result = await createDispute(
        {
          orderId: order.id,
          type: createDisputeData.type,
          description: createDisputeData.description,
        },
        authToken
      );

      if (onDisputeOpened) {
        onDisputeOpened({ ...result, createDisputeData });
      }

      setActiveDisputeWindow(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const {
    disabled: bookingActionsDisabled,
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
    setUpdatedOffer,
    setActualUpdateRequest,
    setPrevUpdateRequest,
    ownerId,
    onCreateUpdateRequest,
    onAcceptOrder,
    onRejectOrder,
  });

  const isOwner = sessionUser.id == ownerId;

  const handleCancelApprove = async () => {
    try {
      let result = null;
      if (isOwner) {
        result = await rejectOrder(order.id, authToken);
      } else {
        result = await orderFullCancel(order.id, authToken);
      }

      onCancel(result);
    } catch (e) {
      setError(e.message);
    }
  };

  const handlePayedFastCancel = async ({ type, paypalId, cardNumber }) => {
    try {
      const result = await orderFullCancelPayed(
        { id: order.id, type, paypalId, cardNumber },
        authToken
      );

      if (onPayedFastCancel) {
        onPayedFastCancel(result);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleMakeBooking = async ({ feeActive, sendingMessage }) => {
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

    onExtendOrder();
  };

  return {
    createDisputeData,
    bookingActionsDisabled,
    updateRequestModalActive,
    setUpdateRequestModalActive,
    handleCreateUpdateRequest,
    acceptOrderModalActive,
    setAcceptOrderModalActive,
    handleAcceptRejectOrder,
    rejectOrderModalActive,
    setRejectOrderModalActive,
    handleAcceptAcceptOrder,

    extendPopupActive,
    setExtendPopupActive,
    extendApproveData,
    setExtendApproveData,
    activeDisputeWindow,
    setActiveDisputeWindow,
    paypalModalActive,
    setPaypalModalActive,
    cancelModalActive,
    setCancelModalActive,
    payedCancelModalActive,
    setPayedCancelModalActive,
    payedCancelDisabled,
    setPayedCancelDisabled,

    handleCancelApprove,
    handlePayedFastCancel,
    handleMakeBooking,

    handleOpenDispute,
  };
};

export default useSingleOrderActions;
