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

  const { authToken, error, success, sessionUser } = useContext(IndiceContext);
  const handleCreateUpdateRequest = async ({
    order,
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
          orderId: order.id,
          newStartDate: fromDate,
          newEndDate: toDate,
          newPricePerDay: price,
        },
        authToken
      );

      onCreateUpdateRequest({
        orderId: order.id,
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

  const handleAcceptAcceptOrder = async (order) => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);

      const result = await acceptOrder(order.id, authToken);

      if (onAcceptOrder) {
        onAcceptOrder(result);
      }

      setUpdatedOffer(
        { status: STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT },
        order.id
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

  const handleAcceptRejectOrder = async (order) => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);

      const result = await rejectOrder(order.id, authToken);

      if (onRejectOrder) {
        onRejectOrder(result);
      }

      if (sessionUser.id == order.ownerId) {
        setUpdatedOffer({ status: STATIC.ORDER_STATUSES.REJECTED }, order.id);
      } else {
        setUpdatedOffer(
          {
            status: null,
            cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
          },
          order.id
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
