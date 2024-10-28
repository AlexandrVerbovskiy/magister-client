import { useState, useContext } from "react";
import { IndiceContext } from "../contexts";
import {
  acceptOrder,
  createOrderUpdateRequest,
  rejectOrder,
} from "../services";
import STATIC from "../static";

const useBookingAgreementPanel = ({
  setUpdatedOffer = null,
  setActualUpdateRequest = null,
  setPrevUpdateRequest = null,
  onAcceptOrder = null,
  onRejectOrder = null,
  onCreateUpdateRequest = null,
}) => {
  const [disabled, setDisabled] = useState(false);
  const [updateRequestModalActive, setUpdateRequestModalActive] =
    useState(false);
  const [acceptOrderModalActive, setAcceptOrderModalActive] = useState(false);
  const [rejectOrderModalActive, setRejectOrderModalActive] = useState(false);

  const { authToken, error, success, sessionUser } = useContext(IndiceContext);
  const handleCreateUpdateRequest = async ({ order, price, finishTime }) => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);
      setUpdateRequestModalActive(false);

      const result = await createOrderUpdateRequest(
        {
          orderId: order.id,
          newPrice: price,
          newFinishTime: finishTime,
        },
        authToken
      );

      if (onCreateUpdateRequest) {
        onCreateUpdateRequest({
          orderId: order.id,
          price,
          finishTime,
          ...result,
        });
      }

      return {
        orderId: order.id,
        price,
        finishTime,
        ...result,
      };
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

      const updatedOrderInfo = {
        id: order.id,
        status: STATIC.ORDER_STATUSES.PENDING_WORKER_PAYMENT,
      };

      if (setUpdatedOffer) {
        setUpdatedOffer(updatedOrderInfo);
      }

      setTimeout(() => {
        if (setActualUpdateRequest) {
          setActualUpdateRequest(null);
        }

        if (setPrevUpdateRequest) {
          setPrevUpdateRequest(null);
        }
      }, 0);

      success.set("Order accepted successfully");
      return updatedOrderInfo;
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

      const updatedOrderInfo = { id: order.id };

      if (sessionUser?.id == order.ownerId) {
        updatedOrderInfo["status"] = STATIC.ORDER_STATUSES.REJECTED;
      } else {
        updatedOrderInfo["status"] = null;
        updatedOrderInfo["cancelStatus"] =
          STATIC.ORDER_CANCELATION_STATUSES.CANCELLED;
      }

      if (setUpdatedOffer) {
        setUpdatedOffer(updatedOrderInfo);
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

      return updatedOrderInfo;
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
