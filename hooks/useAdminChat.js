import { useContext, useEffect, useRef, useState } from "react";
import useAdminChatList from "./useAdminChatList";
import { changeLocation, indicateMediaTypeByExtension } from "../utils";
import { IndiceContext } from "../contexts";
import useMediaActions from "./useMediaActions";
import useAdminChatMessageList from "./useAdminChatMessageList";

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
}) => {
  const { io, sessionUser } = useContext(IndiceContext);
  const chatBodyTriggerRef = useRef(null);
  const [selectedChatId, setSelectedChatId] = useState(baseChatId);

  const { createMediaActions, onSuccessSendBlobPart, onStopSendMedia } =
    useMediaActions();

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
  });

  const baseChat =
    listProps.chats.find((chat) => chat.id === baseChatId) ?? null;

  const [selectedChat, setSelectedChat] = useState(baseChat);

  useEffect(() => {
    const chat =
      listProps.chats.find((chat) => chat.id === selectedChatId) ?? null;

    setSelectedChat(chat);

    setTimeout(() => {
      const interval = setInterval(() => {
        if (chatBodyTriggerRef.current) {
          chatBodyTriggerRef.current.scrollIntoView({ behavior: "smooth" });
          clearInterval(interval);
        }
      }, 100);
    }, [0]);
  }, [selectedChatId]);

  const handleSelectChat = async (chatId) => {
    await bodyProps.handleChangeChat(chatId);
    setSelectedChatId(chatId);
    changeLocation(`/admin/chats/${chatId}`);
  };

  return {
    listProps,
    handleSelectChat,
    selectedChat,
    chatBodyTriggerRef,
    bodyProps,
    order: bodyProps.order,
    dispute: bodyProps.dispute,
  };
};

export default useAdminChat;
