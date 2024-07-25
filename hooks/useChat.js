import { useEffect, useRef, useState } from "react";
import useChatList from "./useChatList";
import useChatMessageList from "./useChatMessageList";
import useChatWindowsChanger from "./useChatWindowsChanger";
import useChatBase from "./useChatBase";
import { useRouter } from "next/router";

const useChat = ({
  chatId: baseChatId = null,
  chats,
  chatsCanShowMore,
  options,
  messages,
  messagesCanShowMore,
  authToken,
  entity = null,
  dopEntityInfo = null,
}) => {
  const router = useRouter();
  const [selectedChatId, setSelectedChatId] = useState(baseChatId);
  const windowProps = useChatWindowsChanger(selectedChatId);
  const typeRef = useRef(options.chatType ?? STATIC.CHAT_TYPES.ORDER);
  const firstUpdateChatTypeRef = useRef(true);
  const firstUpdateChatIdRef = useRef(true);

  const listProps = useChatList({
    chats,
    canShowMore: chatsCanShowMore,
    options,
    authToken,
    typeRef,
  });

  useEffect(() => {
    if (firstUpdateChatTypeRef.current) {
      firstUpdateChatTypeRef.current = false;
    } else {
      listProps.onChatTypeUpdate(options.chatType);
      bodyProps.reset();
      setSelectedChatId(null);
    }
  }, [options.chatType]);

  const bodyProps = useChatMessageList({
    messages,
    canShowMore: messagesCanShowMore,
    chatId: selectedChatId,
    options,
    authToken,
    entity,
    dopEntityInfo,
  });

  useEffect(() => {
    if (!selectedChatId) {
      return;
    }

    windowProps.scrollBodyBottom();
  }, [selectedChatId]);

  const onChatIdUpdate = async (newChatId) => {
    if (newChatId) {
      await bodyProps.handleChangeChat(newChatId);
      setSelectedChatId(newChatId);
    } else {
      bodyProps.reset();
      setSelectedChatId(null);
    }
  };

  useEffect(() => {
    if (firstUpdateChatIdRef.current) {
      firstUpdateChatIdRef.current = false;
    } else {
      onChatIdUpdate(baseChatId);
    }
  }, [baseChatId]);

  const handleSelectChat = async (chatId) => {
    router.push(`/dashboard/chats/${chatId}/`);
  };

  const handleChangeType = (type) => {
    listProps.changeType(type);
  };

  const scrollBodyBottom = () => windowProps.scrollBodyBottom();

  const chatActions = useChatBase({
    bodyProps,
    listProps,
    scrollBodyBottom,
    selectedChatId,
  });

  const selectedChat =
    listProps.chats.find((chat) => chat.id === selectedChatId) ?? null;

  return {
    listProps,
    bodyProps,
    handleSelectChat,
    selectedChat,
    handleChangeType,
    actions: {
      appendMessage: bodyProps.appendMessageToChat,
      appendChatToListByMessage: listProps.onGetMessage,
      ...chatActions,
    },
    windowProps,
  };
};

export default useChat;
