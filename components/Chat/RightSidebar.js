import { useEffect, useState } from "react";
import { dateConverter } from "../../utils";
import NoChatSelected from "./NoChatSelected";
import OrderChatBody from "./OrderChatBody";
import STATIC from "../../static";
import DisputeChatBody from "./DisputeChatBody";

const RightSidebar = (props) => {
  const {
    messages,
    handleShowMore,
    selectedChat,
    entity,
    handleSelectChat,
    canShowMore,
  } = props;
  
  const [messagesToView, setMessagesToView] = useState([]);
  const [lastShowedMessageId, setLastShowedMessageId] = useState(null);
  const [updatingMessage, setUpdatingMessage] = useState(null);

  useEffect(() => {
    const newMessagesToView = [];
    let prevMessage = null;

    messages.forEach((message, index) => {
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

      /*message["needUserPhoto"] = !(
        messages[index + 1] &&
        (messages[index + 1].senderId == message.senderId ||
          (messages[index + 1].isAdminSender && message.isAdminSender))
      );*/

      prevMessage = message;
      newMessagesToView.push(message);
    });

    setMessagesToView(newMessagesToView);

    if (lastShowedMessageId) {
      setTimeout(() => {
        const lastMessage = document.querySelector(
          "#message-" + lastShowedMessageId
        );

        if (lastMessage) {
          lastMessage.scrollIntoView({ behavior: "instant", block: "end" });
        }
      }, 0);

      setLastShowedMessageId(null);
    }
  }, [JSON.stringify(messages)]);

  const handleScrollBody = (e) => {
    if (e.target.scrollTop === 0 && canShowMore) {
      setLastShowedMessageId(messages[0].id);
      handleShowMore();
    }
  };

  if (!selectedChat || !entity) {
    return <NoChatSelected />;
  }

  const handleChangeUpdatingMessageId = (messageId) => {
    const message = messages.find((message) => message.id === messageId);
    setUpdatingMessage(message);
  };

  const stopUpdatingMessage = () => {
    setUpdatingMessage(null);
  };

  return (
    <div className="content-right">
      <div className="chat-area">
        <div className="chat-list-wrapper">
          {entity.type == STATIC.CHAT_TYPES.ORDER && (
            <OrderChatBody
              handleScrollBody={handleScrollBody}
              stopUpdatingMessage={stopUpdatingMessage}
              handleChangeUpdatingMessageId={handleChangeUpdatingMessageId}
              messagesToView={messagesToView}
              updatingMessage={updatingMessage}
              handleSelectChat={handleSelectChat}
              {...props}
            />
          )}

          {entity.type == STATIC.CHAT_TYPES.DISPUTE && (
            <DisputeChatBody
              handleScrollBody={handleScrollBody}
              stopUpdatingMessage={stopUpdatingMessage}
              handleChangeUpdatingMessageId={handleChangeUpdatingMessageId}
              messagesToView={messagesToView}
              updatingMessage={updatingMessage}
              handleSelectChat={handleSelectChat}
              {...props}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
