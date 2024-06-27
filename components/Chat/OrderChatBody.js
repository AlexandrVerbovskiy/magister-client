import { useContext } from "react";
import { useOrderActions, useSingleOrderActions } from "../../hooks";
import ChatHeader from "./ChatHeader";
import SenderPanel from "./SenderPanel";
import MessageLi from "./MessageLi";
import OrderModals from "./OrderModals";
import { IndiceContext } from "../../contexts";
import {
  calculateCurrentTotalPrice,
  dateName,
  getDaysDifference,
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
}) => {
  const currentActionButtons = useOrderActions({
    order,
  });

  const { error, sessionUser, success } = useContext(IndiceContext);
  const isOwner = sessionUser.id == order.ownerId;
  const actualUpdateRequest = order.actualUpdateRequest;

  const setActualUpdateRequest = (request) => {
    updateOrder({ actualUpdateRequest: request });
  };

  const setUpdatedOffer = ({ status, cancelStatus = null }) => {
    const offerPricePerDay = actualUpdateRequest
      ? actualUpdateRequest.newPricePerDay
      : order.offerPricePerDay;
    const offerStartDate = actualUpdateRequest
      ? actualUpdateRequest.newStartDate
      : order.offerStartDate;
    const offerEndDate = actualUpdateRequest
      ? actualUpdateRequest.newEndDate
      : order.offerEndDate;

    const totalPrice = calculateCurrentTotalPrice({
      isOwner,
      startDate: order.offerStartDate,
      endDate: order.offerEndDate,
      pricePerDay: order.offerPricePerDay,
      ownerFee: order.ownerFee,
      tenantFee: order.tenantFee,
    });

    const updatedFields = {
      offerPricePerDay,
      offerStartDate,
      offerEndDate,
      duration: getDaysDifference(offerStartDate, offerEndDate),
      factTotalPrice: totalPrice,
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
        newPricePerDay: price,
      },
    };

    if (isOwner) {
      newOrderPart["status"] = STATIC.ORDER_STATUSES.PENDING_TENANT;
    } else {
      newOrderPart["status"] = STATIC.ORDER_STATUSES.PENDING_OWNER;
    }

    updateOrder(newOrderPart);

    actions.appendMessage(chatMessage);
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
  };

  const onPayedFastCancel = ({ chatMessage }) => {
    updateOrder({
      cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
    });

    actions.appendMessage(chatMessage);
  };

  const onExtendOrder = ({ id, chatMessage, opponent }) => {
    actions.appendChatToListByMessage(chatMessage, opponent);
    handleSelectChat(chatMessage.chatId);

    success.set(
      "Order extended successfully. You can discuss the new terms in a new chat"
    );
  };

  const onAcceptOrder = ({ chatMessage, status }) => {
    updateOrder({ status });
    actions.appendMessage(chatMessage);
  };

  const onRejectOrder = ({ chatMessage, status, cancelStatus }) => {
    updateOrder({ status, cancelStatus });
    actions.appendMessage(chatMessage);
  };

  const onDisputeOpened = async ({
    chatMessage,
    createDisputeData,
    disputeId,
  }) => {
    updateOrder({
      disputeId,
      disputeStatus: STATIC.DISPUTE_STATUSES.OPEN,
      disputeType: createDisputeData.type,
      disputeDescription: createDisputeData.description,
    });

    actions.appendMessage(chatMessage);
  };

  const popupsData = useSingleOrderActions({
    order,
    setUpdatedOffer,
    setActualUpdateRequest,
    onCreateUpdateRequest,
    onCancel,
    onExtendOrder,
    setError: error.set,
    onAcceptOrder,
    onRejectOrder,
    onPayedFastCancel,
    onDisputeOpened,
  });

  /*  activeDisputeWindow,
  setActiveDisputeWindow,
  handleOpenDispute, */

  return (
    <>
      <div className="chat-list">
        <ChatHeader
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
                  <div
                    key={message.tempKey}
                    className="badge badge-pill badge-light my-3"
                  >
                    {dateName(message.content)}
                  </div>
                );
              }

              if (message.type == STATIC.MESSAGE_TYPES.RESOLVED_DISPUTE) {
                return (
                  <div
                    key={message.id}
                    className="badge badge-light gray badge-pill chat-message my-3"
                  >
                    Dispute resolved
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
            <div className="right-sidebar-bottom"></div>
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
        updateOrder={updateOrder}
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
