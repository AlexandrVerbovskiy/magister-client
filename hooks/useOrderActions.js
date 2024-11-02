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

    if (order.parentChatId) {
      newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.EXTENSION_CHAT);
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
    const isTenant = order.tenantId == sessionUser?.id;

    console.log(order);

    if (
      (isOwner && order.status == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
      (isTenant && order.status == STATIC.ORDER_STATUSES.PENDING_TENANT)
    ) {
      if (
        checkErrorData(order.actualUpdateRequest?.newFinishTime ?? order.newFinishTime ?? order.offerFinishTime).blocked
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
      order.status == STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT &&
      isTenant
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
        STATIC.ORDER_STATUSES.PENDING_WORKER_PAYMENT == order.status)
    ) {
      newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.CANCEL_BUTTON);
    }

    if (order.orderParentId) {
      newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.PARENT_VIEW);
    } else {
      if (
        order.extendOrders &&
        order.extendOrders.length > 0 &&
        order.extendOrders.length > 1
      ) {
        newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.EXTENSION_LIST);
      }

      if (
        [
          STATIC.ORDER_STATUSES.FINISHED,
          STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
        ].includes(order.status) ||
        (order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT &&
          isOwner)
      ) {
        newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.OPEN_DISPUTE);
      }

      if (
        order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT &&
        isOwner
      ) {
        newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.FOR_TENANT_QRCODE);
      }

      if (
        order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER &&
        isTenant
      ) {
        newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.FOR_OWNER_QRCODE);
      }

      if (order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT) {
        if (isTenant) {
          if (order.canAcceptTenantListing) {
            newActionButtons.push(
              STATIC.ORDER_ACTION_BUTTONS.TENANT_GOT_LISTING_APPROVE_BUTTON
            );
          }

          if (order.canFastCancelPayed) {
            newActionButtons.push(
              STATIC.ORDER_ACTION_BUTTONS.FAST_CANCEL_BUTTON
            );
          } else {
            newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.OPEN_DISPUTE);
          }
        }
      }

      if (order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
        if (isOwner && order.canAcceptOwnerListing) {
          newActionButtons.push(
            STATIC.ORDER_ACTION_BUTTONS.ACCEPT_FINISH_BUTTON
          );
        }
      }

      if (order.status == STATIC.ORDER_STATUSES.FINISHED) {
        if (isOwner && !order.tenantCommentId) {
          newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.TENANT_REVIEW);
        }

        if (isTenant && !order.ownerCommentId) {
          newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.OWNER_REVIEW);
        }
      }
    }

    const hasUnstartedExtends =
      order.extendOrders &&
      order.extendOrders.length > 0 &&
      order.extendOrders.find(
        (extendOrder) =>
          [
            STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
            STATIC.ORDER_STATUSES.PENDING_OWNER,
            STATIC.ORDER_STATUSES.PENDING_TENANT,
            STATIC.ORDER_STATUSES.REJECTED,
          ].includes(extendOrder.status) && !extendOrder.cancelStatus
      );

    if (
      isTenant &&
      !hasUnstartedExtends &&
      order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER
    ) {
      newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.EXTEND_BUTTON);
    }

    setCurrentActionButtons(newActionButtons);
  }, [order, sessionUser]);

  return currentActionButtons;
};

export default useOrderActions;
