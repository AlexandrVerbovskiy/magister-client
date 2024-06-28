import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import ChatMessage from "./ChatMessage";
import InboxSidebar from "./InboxSidebar";
import { useEffect, useState } from "react";
import { dateConverter } from "../../../utils";

const BaseChat = ({
  listProps,
  bodyProps,
  sidebarOpen,
  contentArea,
  msgSidebarOpen,
  setSidebarOpen,
  setMsgSidebarOpen,
  selectedChat = null,
  handleSelectChat,
  chatBodyTriggerRef,
  order,
  dispute,
}) => {
  const onSelectChat = (chatId) => {
    setMsgSidebarOpen(false);
    handleSelectChat(chatId);
  };

  const [messagesToView, setMessagesToView] = useState([]);
  const [lastShowedMessageId, setLastShowedMessageId] = useState(null);
  const [updatingMessage, setUpdatingMessage] = useState(null);

  useEffect(() => {
    const newMessagesToView = [];
    let prevMessage = null;

    bodyProps.messages.forEach((message) => {
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
  }, [JSON.stringify(bodyProps.messages)]);

  const handleScrollBody = (e) => {
    if (e.target.scrollTop === 0) {
      setLastShowedMessageId(bodyProps.messages[0].id);
      bodyProps.handleShowMore();
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
        onScroll={handleScrollBody}
        ref={contentArea}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative w-full h-full flex">
            <InboxSidebar
              msgSidebarOpen={msgSidebarOpen}
              setMsgSidebarOpen={setMsgSidebarOpen}
              selectedChat={selectedChat}
              chats={listProps.chats}
              handleSelectChat={onSelectChat}
            />

            <div
              className={`w-full h-full grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out ${
                msgSidebarOpen ? "translate-x-1/3" : "translate-x-0"
              }`}
            >
              {selectedChat ? (
                <>
                  <ChatHeader
                    msgSidebarOpen={msgSidebarOpen}
                    setMsgSidebarOpen={setMsgSidebarOpen}
                    order={order}
                    dispute={dispute}
                    selectedChat={selectedChat}
                  />
                  <div className="grow px-4 sm:px-6 md:px-5 py-6 z-0">
                    {messagesToView.map((message) => {
                      if (message.type == "date") {
                        return (
                          <div
                            key={message.tempKey}
                            className="w-full flex items-center justify-center"
                          >
                            <div className="w-fit inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-emerald-100 text-emerald-500 duration-150 ease-in-out">
                              {message.content}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <ChatMessage
                          key={message.id ?? message.tempKey}
                          {...message}
                          order={order}
                          dispute={dispute}
                        />
                      );
                    })}
                    <div ref={chatBodyTriggerRef} />
                  </div>
                  {/*<ChatFooter />*/}
                </>
              ) : (
                <>
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-fit inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out">
                      Select a chat to start messaging
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BaseChat;
