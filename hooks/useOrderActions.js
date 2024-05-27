import { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../contexts";
import STATIC from "../static";

const useOrderActions = ({ order }) => {
  const { sessionUser } = useContext(IndiceContext);
  const [currentActionButtons, setCurrentActionButtons] = useState([]);

  useEffect(() => {
    const isOwner = order.ownerId == sessionUser?.id;
    const isTenant = order.tenantId == sessionUser?.id;

    const newActionButtons = [];

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
        order.status == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT &&
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
            STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
          ].includes(order.status)) ||
        (isTenant && order.status == STATIC.ORDER_STATUSES.PENDING_OWNER) ||
        (order.status == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT &&
          isTenant)
      ) {
        newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.CANCEL_BUTTON);
      }

      if (
        order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT &&
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

      if (order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT) {
        if (isTenant && order.canAcceptTenantListing) {
          newActionButtons.push(
            STATIC.ORDER_ACTION_BUTTONS.TENANT_GOT_LISTING_APPROVE_BUTTON
          );
        }

        if (isOwner || (isTenant && !order.canFastCancelPayed)) {
          newActionButtons.push(
            STATIC.ORDER_ACTION_BUTTONS.CREATE_DISPUTE_BUTTON
          );
        }

        if (isTenant && order.canFastCancelPayed) {
          newActionButtons.push(STATIC.ORDER_ACTION_BUTTONS.FAST_CANCEL_BUTTON);
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

        newActionButtons.push(
          STATIC.ORDER_ACTION_BUTTONS.CREATE_DISPUTE_BUTTON
        );
      }

      const hasProcessedExtends = order.orderParentId;
      /*order.extendOrders &&
        order.extendOrders.find(
          (extendOrder) =>
            [
              STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
              STATIC.ORDER_STATUSES.PENDING_OWNER,
              STATIC.ORDER_STATUSES.PENDING_TENANT,
            ].includes(extendOrder.status) || extendOrder.cancelStatus
        );*/

      if (
        isTenant &&
        order.status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER &&
        !hasProcessedExtends
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
