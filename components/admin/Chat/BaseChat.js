import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import ChatMessage from "./ChatMessage";
import InboxSidebar from "./InboxSidebar";
import { useContext, useEffect, useState } from "react";
import { dateConverter } from "../../../utils";
import SendFileModal from "./SendFileModal";
import { useChatSenderPanel, useSendFileButton } from "../../../hooks";
import ContentStoryModal from "./ContentStoryModal";
import UnsolveModal from "../Disputes/UnsolveModal";
import SolveModal from "../Disputes/SolveModal";
import { solveDispute, unsolveDispute } from "../../../services";
import { IndiceContext } from "../../../contexts";
import STATIC from "../../../static";

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
  windowProps,
  order,
  dispute,
  selectedChatId,
  handleSelectSubChat,
  actions,
  updateDisputeStatus,
}) => {
  const { authToken, error } = useContext(IndiceContext);
  const [messagesToView, setMessagesToView] = useState([]);
  const [lastShowedMessageId, setLastShowedMessageId] = useState(null);
  const [updatingMessage, setUpdatingMessage] = useState(null);
  const [currentContentStory, setCurrentContentStory] = useState(null);
  const [solvePopupActive, setSolvePopupActive] = useState(null);
  const [unsolvePopupActive, setUnsolvePopupActive] = useState(null);
  const [statusPopupActive, setStatusPopupActive] = useState(false);

  const onSelectChat = (chatId) => {
    handleSelectChat(chatId);
    windowProps.setChatWindow();
  };

  const showChatListWindow = () => {
    windowProps.setListWindow();
  };

  const onSelectSubChat = (chatId) => {
    handleSelectSubChat(chatId);
  };

  const closeContentStoryPopup = () => setCurrentContentStory(null);

  const handleOpenContentStoryPopup = (e, story) => {
    e.stopPropagation();
    setCurrentContentStory(story);
  };

  const handleChangeUpdatingMessageId = (messageId) => {
    const message = bodyProps.messages.find(
      (message) => message.id === messageId
    );
    setUpdatingMessage(message);
  };

  const stopUpdatingMessage = () => {
    setUpdatingMessage(null);
  };

  const chatSenderPanelProps = useChatSenderPanel({
    chatId: selectedChatId,
    ...actions,
    updatingMessage,
    stopUpdatingMessage,
  });
  const { handleSendMedia } = chatSenderPanelProps;

  const {
    file,
    close,
    active,
    fileInputRef,
    handleFileInputChange,
    handleSend,
  } = useSendFileButton({
    handleSendMedia,
    setError: error.set,
  });

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
    if (e.target.scrollTop === 0 && bodyProps.canShowMore) {
      setLastShowedMessageId(bodyProps.messages[0].id);
      bodyProps.handleShowMore();
    }
  };

  const activateUnsolvePopup = () => {
    setUnsolvePopupActive(true);
  };

  const activateSolvePopup = () => {
    setSolvePopupActive(true);
  };

  const handleApproveUnsolveClick = async () => {
    await unsolveDispute(dispute.id, authToken);
    updateDisputeStatus(STATIC.DISPUTE_STATUSES.UNSOLVED);
    setUnsolvePopupActive(false);
    setStatusPopupActive(false);
  };

  const handleApproveSolveClick = async (solution) => {
    const result = await solveDispute(
      { solution, disputeId: dispute.id },
      authToken
    );
    updateDisputeStatus(STATIC.DISPUTE_STATUSES.SOLVED);
    setSolvePopupActive(false);
    setStatusPopupActive(false);

    const createdMessage = result.messages.find(
      (message) => message.chatId === selectedChatId
    );

    if (createdMessage) {
      bodyProps.appendMessageToChat(createdMessage);
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
          <div
            className="overflow-x-hidden md:overflow-x-auto relative w-full h-full flex"
            ref={windowProps.chatRef}
          >
            <InboxSidebar
              selectedChat={selectedChat}
              chats={listProps.chats}
              handleSelectChat={onSelectChat}
              filter={listProps.filter}
              setFilter={listProps.setFilter}
              loading={listProps.loading}
              filterChats={listProps.filterChats}
              canShowMore={listProps.canShowMore}
              handleShowMore={listProps.handleShowMore}
            />

            <div
              id="messages-list"
              className={`w-full h-full grow flex flex-col transition-transform duration-300 ease-in-out`}
            >
              {selectedChat ? (
                <>
                  <ChatHeader
                    order={order}
                    dispute={dispute}
                    selectedChat={selectedChat}
                    selectedChatId={selectedChatId}
                    onSelectSubChat={onSelectSubChat}
                    updateDisputeStatus={updateDisputeStatus}
                    activateUnsolvePopup={activateUnsolvePopup}
                    activateSolvePopup={activateSolvePopup}
                    statusPopupActive={statusPopupActive}
                    showChatListWindow={showChatListWindow}
                    setStatusPopupActive={setStatusPopupActive}
                  />
                  <div className="messages-list-body grow px-4 sm:px-6 md:px-5 py-6 z-0 overflow-x-hidden overflow-y-auto no-scrollbar">
                    {messagesToView.map((message) => {
                      if (message.type == "date") {
                        return (
                          <div
                            key={message.tempKey}
                            className="w-full flex items-center justify-center"
                          >
                            <div className="w-fit inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-emerald-100 text-emerald-500 duration-150 ease-in-out mb-4">
                              {message.content}
                            </div>
                          </div>
                        );
                      }

                      if (
                        message.type == STATIC.MESSAGE_TYPES.RESOLVED_DISPUTE
                      ) {
                        return (
                          <div
                            key={message.id}
                            className="w-full flex items-center justify-center"
                          >
                            <div className="w-fit inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-slate-200 text-slate-500 duration-150 ease-in-out mb-4">
                              Dispute Resolved
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
                          handleChangeUpdatingMessageId={
                            handleChangeUpdatingMessageId
                          }
                          handleDeleteMessage={actions.deleteMessage}
                          handleOpenContentStoryPopup={
                            handleOpenContentStoryPopup
                          }
                          isSubChat={bodyProps.isSubChat}
                        />
                      );
                    })}
                    <div
                      ref={windowProps.bodyTriggerRef}
                      className="right-sidebar-bottom"
                    />
                  </div>
                  {bodyProps.isSubChat && (
                    <ChatFooter
                      {...chatSenderPanelProps}
                      fileInputRef={fileInputRef}
                      handleFileInputChange={handleFileInputChange}
                      updatingMessage={updatingMessage}
                      stopUpdatingMessage={stopUpdatingMessage}
                    />
                  )}
                </>
              ) : (
                <>
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-fit inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-teal-500 text-white duration-150 ease-in-out">
                      Select a chat to start messaging
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      <SendFileModal
        handleSendClick={handleSend}
        file={file}
        modalOpen={active}
        handleCloseModal={close}
      />

      <ContentStoryModal
        story={currentContentStory}
        modalOpen={!!currentContentStory}
        handleCloseModal={closeContentStoryPopup}
      />

      <UnsolveModal
        active={unsolvePopupActive}
        close={() => setUnsolvePopupActive(false)}
        onAcceptClick={handleApproveUnsolveClick}
      />

      <SolveModal
        active={solvePopupActive}
        close={() => setSolvePopupActive(false)}
        onAcceptClick={handleApproveSolveClick}
      />
    </div>
  );
};

export default BaseChat;
