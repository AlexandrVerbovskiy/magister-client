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
}) => {
  const { authToken, sessionUser } = useContext(IndiceContext);

  const [extendPopupActive, setExtendPopupActive] = useState(false);
  const [extendApproveData, setExtendApproveData] = useState(null);
  const [activeDisputeWindow, setActiveDisputeWindow] = useState(false);
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
  });

  const isOwner = sessionUser.id == ownerId;

  const handleCancelApprove = async () => {
    try {
      if (isOwner) {
        await rejectOrder(order.id, authToken);
      } else {
        await orderFullCancel(order.id, authToken);
      }

      onCancel();
    } catch (e) {
      setError(e.message);
    }
  };

  const handlePayedFastCancel = async ({ type, paypalId, cardNumber }) => {
    try {
      await orderFullCancelPayed(
        { id: order.id, type, paypalId, cardNumber },
        authToken
      );
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
  };
};

export default useSingleOrderActions;
