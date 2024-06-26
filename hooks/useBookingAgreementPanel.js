import { useState, useContext } from "react";
import { IndiceContext } from "../contexts";
import {
  acceptOrder,
  createOrderUpdateRequest,
  rejectOrder,
} from "../services";
import STATIC from "../static";

const useBookingAgreementPanel = ({
  setUpdatedOffer,
  setActualUpdateRequest = null,
  setPrevUpdateRequest = null,
  onAcceptOrder = null,
  onRejectOrder = null,
  onCreateUpdateRequest,
}) => {
  const [disabled, setDisabled] = useState(false);
  const [updateRequestModalActive, setUpdateRequestModalActive] =
    useState(false);
  const [acceptOrderModalActive, setAcceptOrderModalActive] = useState(false);
  const [rejectOrderModalActive, setRejectOrderModalActive] = useState(false);

  const { sessionUser, authToken, error, success } = useContext(IndiceContext);
  const handleCreateUpdateRequest = async ({
    orderId,
    price,
    fromDate,
    toDate,
  }) => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);
      setUpdateRequestModalActive(false);

      const { chatMessage, request } = await createOrderUpdateRequest(
        {
          orderId: orderId,
          newStartDate: fromDate,
          newEndDate: toDate,
          newPricePerDay: price,
        },
        authToken
      );

      onCreateUpdateRequest({
        orderId,
        price,
        fromDate,
        toDate,
        request,
        chatMessage,
      });
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  const handleAcceptAcceptOrder = async (orderId) => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);

      const result = await acceptOrder(orderId, authToken);

      if (onAcceptOrder) {
        onAcceptOrder(result);
      }

      setUpdatedOffer(
        { status: STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT },
        orderId
      );

      setTimeout(() => {
        if (setActualUpdateRequest) {
          setActualUpdateRequest(null);
        }

        if (setPrevUpdateRequest) {
          setPrevUpdateRequest(null);
        }
      }, 0);
      success.set("Order accepted successfully");
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  const handleAcceptRejectOrder = async (orderId, isOwner) => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);

      const result = await rejectOrder(orderId, authToken);

      if (onRejectOrder) {
        onRejectOrder(result);
      }

      if (isOwner) {
        setUpdatedOffer({ status: STATIC.ORDER_STATUSES.REJECTED }, orderId);
      } else {
        setUpdatedOffer(
          {
            status: null,
            cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
          },
          orderId
        );
      }

      setTimeout(() => {
        if (setActualUpdateRequest) {
          setActualUpdateRequest(null);
        }

        if (setPrevUpdateRequest) {
          setPrevUpdateRequest(null);
        }
      }, 0);

      success.set("Order cancelled successfully");
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  return {
    disabled,
    updateRequestModalActive,
    setUpdateRequestModalActive,
    handleCreateUpdateRequest,
    acceptOrderModalActive,
    setAcceptOrderModalActive,
    handleAcceptRejectOrder,
    rejectOrderModalActive,
    setRejectOrderModalActive,
    handleAcceptAcceptOrder,
  };
};

export default useBookingAgreementPanel;
