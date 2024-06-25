import ChatHeader from "./ChatHeader";
import DateLi from "./DateLi";
import SenderPanel from "./SenderPanel";
import MessageLi from "./MessageLi";
import { useContext, useEffect, useRef, useState } from "react";
import { dateConverter } from "../../utils";
import OrderModals from "./OrderModals";
import { IndiceContext } from "../../contexts";
import { useSingleOrderActions } from "../../hooks";

const RightSidebar = ({
  loading,
  messages,
  canShowMore,
  handleShowMore,
  setListWindow,
  selectedChat,
  actions,
  entity,
  dopEntityInfo,
  setEntity,
}) => {
  const { error } = useContext(IndiceContext);

  const [messagesToView, setMessagesToView] = useState([]);
  const [lastShowedMessageId, setLastShowedMessageId] = useState(null);
  const [updatingMessage, setUpdatingMessage] = useState(null);

  useEffect(() => {
    const newMessagesToView = [];
    let prevMessage = null;

    messages.forEach((message) => {
      if (prevMessage) {
        const prevMessageDate = dateConverter(prevMessage.createdAt);
        const messageDate = dateConverter(message.createdAt);

        if (messageDate != prevMessageDate) {
          newMessagesToView.push({
            type: "date",
            content: messageDate,
            tempKey: messageDate,
          });
        }
      }

      prevMessage = message;
      newMessagesToView.push(message);
    });

    setMessagesToView(newMessagesToView);

    if (lastShowedMessageId) {
      setTimeout(
        () =>
          document
            .querySelector("#message-" + lastShowedMessageId)
            .scrollIntoView({ behavior: "instant", block: "end" }),
        0
      );

      setLastShowedMessageId(null);
    }
  }, [JSON.stringify(messages)]);

  const handleScrollBody = (e) => {
    if (e.target.scrollTop === 0) {
      setLastShowedMessageId(messages[0].id);
      handleShowMore();
    }
  };

  let usePopupsData = () => {};

  if (entity.type == "order") {
    const setActualUpdateRequest = (request) => {
      setEntity({ actualUpdateRequest: request });
    };

    const onCreateUpdateRequest = () => {};

    const onCancel = () => {};

    const onExtendOrder = () => {};

    usePopupsData = () =>
      useSingleOrderActions({
        order: entity,
        setUpdatedOffer: setEntity,
        setActualUpdateRequest,
        onCreateUpdateRequest,
        onCancel,
        onExtendOrder,
        setError: error.set,
      });
  }

  const popupsData = usePopupsData();

  const handleChangeUpdatingMessageId = (messageId) => {
    const message = messages.find((message) => message.id === messageId);
    setUpdatingMessage(message);
  };

  const stopUpdatingMessage = () => {
    setUpdatingMessage(null);
  };

  if (!selectedChat) {
    return (
      <div className="content-right h-100">
        <div className="chat-area h-100">
          <div className="chat-list-wrapper h-100">
            <div className="chat-list h-100">
              <div className="chat-container h-100">
                <div className="chat-content  w-100 h-100 d-flex justify-content-center align-items-center">
                  <div className="badge badge-pill badge-light my-3 main">
                    Select a chat to start messaging
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-right">
      <div className="chat-area">
        <div className="chat-list-wrapper">
          <div className="chat-list">
            <ChatHeader
              entity={entity}
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
                      handleChangeUpdatingMessageId={
                        handleChangeUpdatingMessageId
                      }
                      handleDeleteMessage={actions.deleteMessage}
                      entity={entity}
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
        </div>
      </div>

      <OrderModals
        {...dopEntityInfo}
        order={entity}
        setOrder={setEntity}
        orderPopupsData={popupsData}
      />
    </div>
  );
};

export default RightSidebar;
