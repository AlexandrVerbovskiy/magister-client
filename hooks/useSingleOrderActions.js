import { useContext, useState } from "react";
import useBookingAgreementPanel from "./useBookingAgreementPanel";
import { IndiceContext } from "../contexts";
import {
  extendOrder,
  orderFullCancel,
  orderFullCancelPayed,
  rejectOrder,
} from "../services";

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
}) => {
  const { authToken, sessionUser } = useContext(IndiceContext);

  const [extendPopupActive, setExtendPopupActive] = useState(false);
  const [extendApproveData, setExtendApproveData] = useState(null);
  const [paypalModalActive, setPaypalModalActive] = useState(false);

  const [cancelModalActive, setCancelModalActive] = useState(false);
  const [payedCancelModalActive, setPayedCancelModalActive] = useState(false);
  const [payedCancelDisabled, setPayedCancelDisabled] = useState(false);

  const ownerId = order.ownerId;

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

  const isOwner = sessionUser?.id == ownerId;

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

  const handleMakeBooking = async ({
    feeActive,
    sendingMessage,
    price,
    fromDate,
    toDate,
  }) => {
    try {
      const result = await extendOrder(
        {
          pricePerDay: price,
          startDate: fromDate,
          endDate: toDate,
          listingId: order.listingId,
          feeActive,
          message: sendingMessage,
          parentOrderId: order.orderParentId ?? order.id,
        },
        authToken
      );

      onExtendOrder(result);
    } catch (e) {
      setError(e.message);
    }
  };

  return {
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
  };
};

export default useSingleOrderActions;
