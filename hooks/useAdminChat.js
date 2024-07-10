import { useContext, useEffect, useRef, useState } from "react";
import useAdminChatList from "./useAdminChatList";
import { changeLocation, indicateMediaTypeByExtension } from "../utils";
import { IndiceContext } from "../contexts";
import useAdminChatMessageList from "./useAdminChatMessageList";
import useChatBase from "./useChatBase";

const useAdminChat = ({
  chatId: baseChatId = null,
  chats,
  chatsCanShowMore,
  options,
  messages,
  messagesCanShowMore,
  authToken,
  order = null,
  dispute = null,
  dopInfo = null,
  mainSearchChatId: baseMainSearchChatId = false,
  searchChatType,
}) => {
  const { io, sessionUser } = useContext(IndiceContext);
  const chatBodyTriggerRef = useRef(null);
  const [selectedChatId, setSelectedChatId] = useState(baseChatId);
  const [mainSelectedChatId, setMainSelectedChatId] =
    useState(baseMainSearchChatId);

  const listProps = useAdminChatList({
    chats,
    canShowMore: chatsCanShowMore,
    options,
    authToken,
  });

  const bodyProps = useAdminChatMessageList({
    messages,
    canShowMore: messagesCanShowMore,
    chatId: selectedChatId,
    options,
    authToken,
    order,
    dispute,
    dopInfo,
    searchChatType,
  });

  const scrollBodyBottom = () =>
    setTimeout(() => {
      const interval = setInterval(() => {
        if (chatBodyTriggerRef.current) {
          chatBodyTriggerRef.current.scrollIntoView({ behavior: "smooth" });
          clearInterval(interval);
        }
      }, 100);
    }, 0);

  useEffect(() => {
    scrollBodyBottom();
  }, [selectedChatId]);

  const handleSelectChat = async (chatId) => {
    await bodyProps.handleChangeChat(chatId);
    setSelectedChatId(chatId);
    setMainSelectedChatId(chatId);
    changeLocation(`/admin/chats/${chatId}`);
  };

  const handleSelectSubChat = async (chatId) => {
    await bodyProps.handleChangeChat(chatId);
    setSelectedChatId(chatId);
    changeLocation(`/admin/chats/${chatId}`);
  };

  const chatActions = useChatBase({
    bodyProps,
    listProps,
    scrollBodyBottom,
    selectedChatId,
    prefix: "admin-",
  });

  const updateDisputeStatus = (status) => {
    bodyProps.handleDisputeUpdate({ status });
    listProps.updateChatInfo(mainSelectedChatId, { disputeStatus: status });
  };

  const selectedChat =
    listProps.chats.find((chat) => chat.id === mainSelectedChatId) ?? null;

  return {
    listProps,
    handleSelectChat,
    handleSelectSubChat,
    selectedChat,
    chatBodyTriggerRef,
    bodyProps,
    order: bodyProps.order,
    dispute: bodyProps.dispute,
    selectedChatId,
    actions: { ...chatActions },
    updateDisputeStatus,
  };
};

export default useAdminChat;
