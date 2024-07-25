import { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../contexts";
import STATIC from "../static";

const useOrderActions = ({ order }) => {
  const { sessionUser } = useContext(IndiceContext);
  const [currentActionButtons, setCurrentActionButtons] = useState([]);

  useEffect(() => {
    const newActionButtons = [];

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

    const isOwner = order.ownerId == sessionUser?.id;
    const isTenant = order.tenantId == sessionUser?.id;

    if (order.cancelStatus == null) {
      if (
        (isOwner && order.status == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
        (isTenant && order.status == STATIC.ORDER_STATUSES.PENDING_TENANT)
      ) {
        newActionButtons.push(
          STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
        );
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
            newActionButtons.push(
              STATIC.ORDER_ACTION_BUTTONS.PAY_UPDATE_BUTTON
            );
          }
        } else {
          newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.PAY_BUTTON);
        }
      }

      if (
        (isOwner &&
          [
            STATIC.ORDER_STATUSES.PENDING_TENANT,
            STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
          ].includes(order.status)) ||
        (isTenant &&
          [
            STATIC.ORDER_STATUSES.PENDING_OWNER,
            STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
          ].includes(order.status))
      ) {
        newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.CANCEL_BUTTON);
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
        if (
          isOwner &&
          /*order.canFinalization &&*/ order.canAcceptOwnerListing
        ) {
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

      if (order.orderParentId) {
        newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.PARENT_VIEW);
      }

      if (
        order.extendOrders &&
        order.extendOrders.length > 0 &&
        (!order.orderParentId || order.extendOrders.length > 1)
      ) {
        newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.EXTENSION_LIST);
      }

      const hasFinishedExtends =
        order.extendOrders &&
        order.extendOrders.length > 0 &&
        !order.extendOrders.find(
          (extendOrder) =>
            [
              STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
              STATIC.ORDER_STATUSES.PENDING_OWNER,
              STATIC.ORDER_STATUSES.PENDING_TENANT,
              STATIC.ORDER_STATUSES.REJECTED,
            ].includes(extendOrder.status) || extendOrder.cancelStatus
        );

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
    } else {
      if (
        isOwner &&
        order.cancelStatus ==
          STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE
      ) {
        newActionButtons.push(
          STATIC.ORDER_ACTION_BUTTONS.ACCEPT_OWNER_CANCEL_BUTTON
        );
      }

      if (
        isTenant &&
        order.cancelStatus ==
          STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE
      ) {
        newActionButtons.push(
          STATIC.ORDER_ACTION_BUTTONS.ACCEPT_TENANT_CANCEL_BUTTON
        );
      }
    }

    setCurrentActionButtons(newActionButtons);
  }, [order, sessionUser]);

  return currentActionButtons;
};

export default useOrderActions;
