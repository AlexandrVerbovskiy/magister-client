import { useContext, useState } from "react";
import useBookingAgreementPanel from "./useBookingAgreementPanel";
import { IndiceContext } from "../contexts";
import {
  orderFullCancel,
  orderFullCancelPayed,
  rejectOrder,
} from "../services";

const useSingleOrderActions = ({
  order,
  setUpdatedOffer = null,
  setActualUpdateRequest = null,
  setPrevUpdateRequest = null,
  onCreateUpdateRequest = null,
  onCancel = null,
  setError,
  onAcceptOrder = null,
  onRejectOrder = null,
  onPayedFastCancel = null,
}) => {
  const { authToken, sessionUser } = useContext(IndiceContext);

  const [paypalModalActive, setPaypalModalActive] = useState(false);
  const [cancelModalActive, setCancelModalActive] = useState(false);
  const [payedCancelModalActive, setPayedCancelModalActive] = useState(false);
  const [payedCancelDisabled, setPayedCancelDisabled] = useState(false);

  const [finishModalActive, setFinishModalActive] = useState(false);
  const [acceptFinishModalActive, setAcceptFinishModalActive] = useState(false);

  const ownerId = order?.ownerId;

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
        result = await rejectOrder(order?.id, authToken);
      } else {
        result = await orderFullCancel(order?.id, authToken);
      }

      if (onCancel) {
        onCancel(result);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handlePayedFastCancel = async ({ type, paypalId, cardNumber }) => {
    try {
      const result = await orderFullCancelPayed(
        { id: order?.id, receiptType: type, paypalId, cardNumber },
        authToken
      );

      if (onPayedFastCancel) {
        onPayedFastCancel(result);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAcceptFinishModalActive = async () => {};

  const handleAcceptAcceptFinishModalActive = async () => {};

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
    finishModalActive,
    setFinishModalActive,
    handleAcceptFinishModalActive,
    acceptFinishModalActive,
    setAcceptFinishModalActive,
    handleAcceptAcceptFinishModalActive,
  };
};

export default useSingleOrderActions;
