import { useContext } from "react";
import { useOrderActions, useSingleOrderActions } from "../../hooks";
import OrderChatHeader from "./OrderChatHeader";
import SenderPanel from "./SenderPanel";
import MessageLi from "./MessageLi";
import OrderModals from "./OrderModals";
import { IndiceContext } from "../../contexts";
import {
  autoCalculateCurrentTotalPrice,
  dateName,
  getFactOrderDays,
} from "../../utils";
import STATIC from "../../static";
import DisputeModal from "../Order/DisputeModal";

const OrderChatBody = ({
  handleScrollBody,
  stopUpdatingMessage,
  handleChangeUpdatingMessageId,
  messagesToView,
  updatingMessage,
  updateEntity: updateOrder,
  entity: order,
  setListWindow,
  selectedChat,
  actions,
  dopEntityInfo: dopOrderInfo,
  handleSelectChat,
  windowProps,
}) => {
  const currentActionButtons = useOrderActions({
    order,
  });

  const { error, sessionUser, success } = useContext(IndiceContext);
  const isOwner = sessionUser?.id == order.ownerId;
  const actualUpdateRequest = order.actualUpdateRequest;

  const setActualUpdateRequest = (request) => {
    updateOrder({ actualUpdateRequest: request });
  };

  const setUpdatedOffer = ({ status, cancelStatus = null }) => {
    const offerPrice = actualUpdateRequest
      ? actualUpdateRequest.newPrice
      : order.offerPrice;
    const offerStartDate = actualUpdateRequest
      ? actualUpdateRequest.newStartDate
      : order.offerStartDate;
    const offerEndDate = actualUpdateRequest
      ? actualUpdateRequest.newEndDate
      : order.offerEndDate;

    const totalPrice = autoCalculateCurrentTotalPrice({
      isOwner,
      price: order.offerPrice,
      ownerFee: order.ownerFee,
      workerFee: order.workerFee,
    });

    const updatedFields = {
      offerPrice,
      offerStartDate,
      offerEndDate,
      duration: getFactOrderDays(offerStartDate, offerEndDate),
      factTotalPrice: totalPrice,
      requestId: null,
      newEndDate: null,
      newStartDate: null,
    };

    if (status) {
      updatedFields["status"] = status;
    }

    if (cancelStatus) {
      updatedFields["cancelStatus"] = cancelStatus;
    }

    updateOrder({
      ...updatedFields,
    });
  };

  const onCreateUpdateRequest = ({
    price,
    fromDate,
    toDate,
    chatMessage,
    request,
  }) => {
    const newOrderPart = {
      actualUpdateRequest: {
        ...request,
        senderId: sessionUser?.id,
        newStartDate: fromDate,
        newEndDate: toDate,
        newPrice: price,
      },
    };

    if (isOwner) {
      newOrderPart["status"] = STATIC.ORDER_STATUSES.PENDING_WORKER;
    } else {
      newOrderPart["status"] = STATIC.ORDER_STATUSES.PENDING_OWNER;
    }

    updateOrder(newOrderPart);
    actions.appendMessage(chatMessage);
    windowProps.scrollBodyBottom();
  };

  const onCancel = ({ chatMessage }) => {
    if (isOwner) {
      setUpdatedOffer({
        status: STATIC.ORDER_STATUSES.REJECTED,
        actualUpdateRequest: null,
      });
    } else {
      updateOrder({
        cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
      });
    }

    actions.appendMessage(chatMessage);
    windowProps.scrollBodyBottom();
  };

  const onPayedFastCancel = ({ chatMessage }) => {
    updateOrder({
      cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
    });

    actions.appendMessage(chatMessage);
    windowProps.scrollBodyBottom();
  };

  const onAcceptOrder = ({ chatMessage, status }) => {
    updateOrder({ status });
    actions.appendMessage(chatMessage);
    windowProps.scrollBodyBottom();
  };

  const onAcceptFinishOrder = ({ chatMessage, status }) => {
    updateOrder({ status });
    actions.appendMessage(chatMessage);
    windowProps.scrollBodyBottom();
  };

  const onFinishOrder = ({ chatMessage, status }) => {
    updateOrder({ status });
    actions.appendMessage(chatMessage);
    windowProps.scrollBodyBottom();
  };

  const onRejectOrder = ({ chatMessage, status, cancelStatus }) => {
    updateOrder({ status, cancelStatus });
    actions.appendMessage(chatMessage);
    windowProps.scrollBodyBottom();
  };

  const onDisputeOpened = async ({ chatMessage, orderPart }) => {
    updateOrder(orderPart);
    actions.appendMessage(chatMessage);
    windowProps.scrollBodyBottom();
  };

  const onWorkerPayed = async ({ chatMessage, orderPart }) => {
    setTimeout(() => {
      actions.appendMessage(chatMessage);
      updateOrder(orderPart);
      windowProps.scrollBodyBottom();
    }, 100);
  };

  const popupsData = useSingleOrderActions({
    order,
    setUpdatedOffer,
    setActualUpdateRequest,
    onCreateUpdateRequest,
    onCancel,
    setError: error.set,
    onAcceptOrder,
    onRejectOrder,
    onPayedFastCancel,
    onDisputeOpened,
    onAcceptFinishOrder,
    onFinishOrder
  });

  /*  activeDisputeWindow,
  setActiveDisputeWindow,
  handleOpenDispute, */

  return (
    <>
      <div className="chat-list">
        <OrderChatHeader
          entity={order}
          handleGoBackClick={setListWindow}
          {...selectedChat}
          popupsData={popupsData}
        />

        <div
          className="chat-container"
          data-simplebar
          onScroll={handleScrollBody}
        >
          <div className="chat-content">
            {messagesToView.map((message) => {
              if (message.type == "date") {
                return (
                  <div className="w-100 my-3" key={message.tempKey}>
                    <div className="badge badge-pill badge-light">
                      {dateName(message.content)}
                    </div>
                  </div>
                );
              }

              if (message.type == STATIC.MESSAGE_TYPES.RESOLVED_DISPUTE) {
                return (
                  <div className="w-100 my-3" key={message.id}>
                    <div className="badge badge-light gray badge-pill chat-message">
                      Dispute resolved
                    </div>
                  </div>
                );
              }

              return (
                <MessageLi
                  key={message.id ?? message.tempKey}
                  {...message}
                  stopSendMediaMessage={actions.stopSendMediaMessage}
                  handleChangeUpdatingMessageId={handleChangeUpdatingMessageId}
                  handleDeleteMessage={actions.deleteMessage}
                  entity={order}
                  popupsData={popupsData}
                />
              );
            })}
            <div
              ref={windowProps.bodyTriggerRef}
              className="right-sidebar-bottom"
            ></div>
          </div>
        </div>

        <div className="chat-list-footer">
          <SenderPanel
            stopUpdatingMessage={stopUpdatingMessage}
            updatingMessage={updatingMessage}
            chatId={selectedChat.id}
            {...actions}
          />
        </div>
      </div>

      <OrderModals
        {...dopOrderInfo}
        order={order}
        orderPopupsData={popupsData}
        onWorkerPayed={onWorkerPayed}
      />

      {currentActionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.OPEN_DISPUTE
      ) && (
        <DisputeModal
          {...popupsData.createDisputeData}
          handleOpenDispute={popupsData.handleOpenDispute}
          modalActive={popupsData.activeDisputeWindow}
          closeModal={() => popupsData.setActiveDisputeWindow(false)}
        />
      )}
    </>
  );
};

export default OrderChatBody;
