import { useContext } from "react";
import { useSingleOrderActions } from "../../hooks";
import ChatHeader from "./ChatHeader";
import DateLi from "./DateLi";
import SenderPanel from "./SenderPanel";
import MessageLi from "./MessageLi";
import OrderModals from "./OrderModals";
import { IndiceContext } from "../../contexts";
import { calculateCurrentTotalPrice } from "../../utils";
import STATIC from "../../static";

const OrderChatBody = ({
  handleScrollBody,
  stopUpdatingMessage,
  handleChangeUpdatingMessageId,
  messagesToView,
  updatingMessage,
  setEntity: setOrder,
  entity: order,
  setListWindow,
  selectedChat,
  actions,
  dopEntityInfo: dopOrderInfo,
}) => {
  const { error, sessionUser, success } = useContext(IndiceContext);
  const isOwner = sessionUser.id == order.ownerId;
  const actualUpdateRequest = order.actualUpdateRequest;

  const setActualUpdateRequest = (request) => {
    setOrder({ actualUpdateRequest: request });
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

    setOrder((prev) => ({
      ...prev,
      ...updatedFields,
    }));
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

    setOrder(newOrderPart);

    actions.appendMessage(chatMessage);
  };

  const onCancel = () => {
    if (isOwner) {
      setUpdatedOffer({
        status: STATIC.ORDER_STATUSES.REJECTED,
        actualUpdateRequest: null,
      });
    } else {
      setOrder({
        cancelStatus: STATIC.ORDER_CANCELATION_STATUSES.CANCELLED,
      });
    }
  };

  const onExtendOrder = () => {
    success.set(
      "Order extended successfully. You can discuss the new terms in a new chat"
    );
  };

  const popupsData = useSingleOrderActions({
    order,
    setUpdatedOffer,
    setActualUpdateRequest,
    onCreateUpdateRequest,
    onCancel,
    onExtendOrder,
    setError: error.set,
  });

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
            {messagesToView.map((message) =>
              message.type == "date" ? (
                <DateLi key={message.tempKey} date={message.content} />
              ) : (
                <MessageLi
                  key={message.id ?? message.tempKey}
                  {...message}
                  stopSendMediaMessage={actions.stopSendMediaMessage}
                  handleChangeUpdatingMessageId={handleChangeUpdatingMessageId}
                  handleDeleteMessage={actions.deleteMessage}
                  entity={order}
                  popupsData={popupsData}
                />
              )
            )}
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
        setOrder={setOrder}
        orderPopupsData={popupsData}
      />
    </>
  );
};

export default OrderChatBody;
