import { useContext, useEffect, useState } from "react";
import useChatList from "./useChatList";
import useChatMessageList from "./useChatMessageList";
import { changeLocation } from "../utils";
import { IndiceContext } from "../contexts";
import useChatWindowsChanger from "./useChatWindowsChanger";
import useChatBase from "./useChatBase";

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
  const { io, sessionUser } = useContext(IndiceContext);
  const [selectedChatId, setSelectedChatId] = useState(baseChatId);

  const windowProps = useChatWindowsChanger(selectedChatId);

  const listProps = useChatList({
    chats,
    canShowMore: chatsCanShowMore,
    options,
    authToken,
  });

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

  const handleSelectChat = async (chatId) => {
    await bodyProps.handleChangeChat(chatId);
    setSelectedChatId(chatId);
    changeLocation(`/dashboard/chats/${chatId}`);
  };

  const handleChangeType = (type) => {
    listProps.changeType(type);
    bodyProps.reset();
    setSelectedChatId(null);
  };

  const scrollBodyBottom = () => windowProps.scrollBodyBottom();

  const chatActions = useChatBase({
    bodyProps,
    listProps,
    scrollBodyBottom,
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
