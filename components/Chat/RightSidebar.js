import ChatHeader from "./ChatHeader";
import DateLi from "./DateLi";
import SenderPanel from "./SenderPanel";
import MessageLi from "./MessageLi";
import UploadTrigger from "../UploadTrigger";
import { useEffect, useRef, useState } from "react";
import { dateConverter } from "../../utils";

const RightSidebar = ({
  messages,
  canShowMore,
  handleShowMore,
  setListWindow,
  selectedChat,
  actions,
}) => {
  const firstBuildRef = useRef(true);
  const [messagesToView, setMessagesToView] = useState([]);

  useEffect(() => {
    if (messages.length == 0) {
      firstBuildRef.current = true;
    } else {
      firstBuildRef.current = false;
    }

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
  }, [JSON.stringify(messages)]);

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
            <ChatHeader handleGoBackClick={setListWindow} {...selectedChat} />

            <div className="chat-container" data-simplebar>
              <div className="chat-content">
                {canShowMore && !firstBuildRef.current && (
                  <UploadTrigger onTriggerShown={handleShowMore} />
                )}
                {messagesToView.map((message) =>
                  message.type == "date" ? (
                    <DateLi key={message.tempKey} date={message.content} />
                  ) : (
                    <MessageLi
                      key={message.id ?? message.tempKey}
                      {...message}
                      stopSendMediaMessage={actions.stopSendMediaMessage}
                    />
                  )
                )}
              </div>
            </div>

            <div className="chat-list-footer">
              <SenderPanel chatId={selectedChat.id} {...actions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
