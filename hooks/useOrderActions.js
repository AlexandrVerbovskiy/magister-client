import { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../contexts";
import STATIC from "../static";
import useOrderDateError from "./useOrderDateError";

const useOrderActions = ({ order }) => {
  const { sessionUser } = useContext(IndiceContext);
  const [currentActionButtons, setCurrentActionButtons] = useState([]);

  const { checkErrorData } = useOrderDateError({
    order,
  });

  useEffect(() => {
    const newActionButtons = [];

    if (!order) {
      setCurrentActionButtons(newActionButtons);
      return;
    }

    if (order.chatId) {
      newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.ORDER_CHAT);
    }

    if (order.disputeId != null) {
      if (order.disputeChatId) {
        newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.VIEW_DISPUTE_CHAT);
      }

      setCurrentActionButtons(newActionButtons);
      return;
    }

    if (order.cancelStatus != null) {
      setCurrentActionButtons(newActionButtons);
      return;
    }

    const isOwner = order.ownerId == sessionUser?.id;
    const isWorker = order.workerId == sessionUser?.id;

    console.log(order);

    if (
      (isOwner && order.status == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
      (isWorker && order.status == STATIC.ORDER_STATUSES.PENDING_WORKER)
    ) {
      if (
        checkErrorData(
          order.actualUpdateRequest?.newFinishTime ??
            order.newFinishTime ??
            order.offerFinishTime
        ).blocked
      ) {
        newActionButtons.push(
          STATIC.ORDER_ACTION_BUTTONS.BOOKING_UPDATING_SECTION
        );
      } else {
        newActionButtons.push(
          STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
        );
      }
    }

    if (
      order.status == STATIC.ORDER_STATUSES.PENDING_OWNER_PAYMENT &&
      isOwner
    ) {
      if (order.paymentInfo) {
        if (
          !order.paymentInfo.adminApproved &&
          !order.paymentInfo.waitingApproved
        ) {
          newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.PAY_UPDATE_BUTTON);
        }
      } else {
        newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.PAY_BUTTON);
      }
    }

    if (
      !order.paymentInfo?.waitingApproved &&
      ((isOwner && order.status === STATIC.ORDER_STATUSES.PENDING_WORKER) ||
        (isWorker && order.status === STATIC.ORDER_STATUSES.PENDING_OWNER) ||
        STATIC.ORDER_STATUSES.PENDING_OWNER_PAYMENT == order.status)
    ) {
      newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.CANCEL_BUTTON);
    }

    if (
      isOwner &&
      order.status === STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED
    ) {
      newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.ACCEPT_OWNER_FINISH_BUTTON);
    }

    if (
      [
        STATIC.ORDER_STATUSES.IN_PROCESS,
        STATIC.ORDER_STATUSES.FINISHED,
        STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED,
      ].includes(order.status)
    ) {
      newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.OPEN_DISPUTE);
    }

    if (order.status == STATIC.ORDER_STATUSES.IN_PROCESS) {
      if (isWorker) {
        if (order.canFastCancelPayed) {
          newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.FAST_CANCEL_BUTTON);
        } else {
          newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.OPEN_DISPUTE);
        }
        
        newActionButtons.push(
          STATIC.ORDER_ACTION_BUTTONS.FINISH_BUTTON
        );
      }
    }

    if (order.status == STATIC.ORDER_STATUSES.FINISHED) {
      if (isOwner && !order.workerCommentId) {
        newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.WORKER_REVIEW);
      }

      if (isWorker && !order.ownerCommentId) {
        newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.OWNER_REVIEW);
      }
    }

    setCurrentActionButtons(newActionButtons);
  }, [order, sessionUser]);

  return currentActionButtons;
};

export default useOrderActions;
