import { useEffect, useState } from "react";
import { dateConverter } from "../../utils";
import NoChatSelected from "./NoChatSelected";
import OrderChatBody from "./OrderChatBody";

const RightSidebar = (props) => {
  const { messages, handleShowMore, selectedChat, entity } = props;
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
          {entity.type == "order" && (
            <OrderChatBody
              handleScrollBody={handleScrollBody}
              stopUpdatingMessage={stopUpdatingMessage}
              handleChangeUpdatingMessageId={handleChangeUpdatingMessageId}
              messagesToView={messagesToView}
              updatingMessage={updatingMessage}
              {...props}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
