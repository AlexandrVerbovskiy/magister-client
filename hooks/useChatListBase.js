import { useEffect, useState } from "react";
import STATIC from "../static";

const useChatListBase = ({
  chats: baseChats,
  canShowMore: baseCanShowMore,
  authToken,
  getChatList,
  getDopOptions = () => ({}),
  ignoreNewMessageCondition = (message) => false,
  chatHasRelationToOther = (chat, chatId) => false,
  checkMainRelationToOther = (chat, chatId) => false,
}) => {
  const [filter, setFilter] = useState("");
  const [filterChats, setFilterChats] = useState([]);
  const [chats, setChats] = useState(baseChats);
  const [canShowMore, setCanShowMore] = useState(baseCanShowMore);
  const [loading, setLoading] = useState(false);

  const handleShowMore = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (!chats.length) {
        return;
      }

      const lastChatId = chats[chats.length - 1].id;

      const result = await getChatList(
        { lastChatId, ...getDopOptions() },
        authToken
      );

      setCanShowMore(result.chatsCanShowMore);
      setChats([...chats, ...result.chats]);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const getFilterChats = async (filter) => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (!filter) {
        setFilterChats([]);
        return;
      }

      const result = await getChatList(
        {
          ...getDopOptions(),
          chatFilter: filter,
        },
        authToken
      );

      setFilterChats(result.chats);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      getFilterChats(filter);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filter]);

  const updateChatInfo = (chatId, chatInfo) => {
    setChats((prevChats) => {
      const newChatList = prevChats.map((chat) =>
        chatHasRelationToOther(chat, chatId) &&
        checkMainRelationToOther(chat, chatId)
          ? { ...chat, ...chatInfo }
          : chat
      );

      newChatList.sort((a, b) => b.messageCreatedAt - a.messageCreatedAt);
      return newChatList;
    });
  };

  const startTyping = (chatId) => updateChatInfo(chatId, { typing: true });

  const finishTyping = (chatId) => updateChatInfo(chatId, { typing: false });

  const deleteMessage = (messageChatId, messageId, previousMessage) => {
    setChats((prevChats) => {
      const newChatList = prevChats.map((chat) =>
        chatHasRelationToOther(chat, messageChatId) &&
        checkMainRelationToOther(chat, messageChatId) &&
        chat.messageId === messageId
          ? {
              ...chat,
              messageId: previousMessage.id,
              messageType: previousMessage.type,
              messageSenderId: previousMessage.senderId,
              messageCreatedAt: previousMessage.createdAt,
            }
          : chat
      );

      newChatList.sort((a, b) => b.messageCreatedAt - a.messageCreatedAt);
      return newChatList;
    });
  };

  const onGetMessage = (message, opponentInfo = null) => {
    if (ignoreNewMessageCondition(message)) {
      return;
    }

    setChats((prevChats) => {
      const prevFirstChat = prevChats.find((chat) =>
        chatHasRelationToOther(chat, message.chatId)
      );

      if (
        prevFirstChat &&
        !checkMainRelationToOther(prevFirstChat, message.chatId)
      ) {
        return prevChats;
      }

      const newChatList = prevChats.filter(
        (chat) => !chatHasRelationToOther(chat, message.chatId)
      );

      let firstChat = {};

      if (prevFirstChat) {
        firstChat = { ...prevFirstChat };
      }

      firstChat = {
        ...firstChat,
        entityId: message.entityId,
        entityType: message.entityType,
        id: message.chatId,
        messageCreatedAt: message.createdAt,
        messageId: message.id,
        messageSenderId: message.senderId,
        messageType: message.type,
        name: message.chatName,
      };

      if (opponentInfo) {
        if (message.entityType == STATIC.CHAT_TYPES.ORDER) {
          firstChat["opponentId"] = opponentInfo?.id;
          firstChat["opponentName"] = opponentInfo?.name;
          firstChat["opponentOnline"] = opponentInfo?.online;
          firstChat["opponentPhoto"] = opponentInfo?.photo;
          firstChat["opponentTyping"] = false;
        }
      }

      return [firstChat, ...newChatList];
    });
  };

  return {
    filter,
    setFilter,
    filterChats,
    setFilterChats,
    chats,
    setChats,
    canShowMore,
    setCanShowMore,
    loading,
    setLoading,
    handleShowMore,
    updateChatInfo,
    startTyping,
    finishTyping,
    deleteMessage,
    onGetMessage,
  };
};

export default useChatListBase;
