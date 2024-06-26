import { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../contexts";
import { getChatList } from "../services/chat";
import { changeLocation } from "../utils";

const useChatList = ({
  chats: baseChats,
  canShowMore: baseCanShowMore,
  options,
  authToken,
}) => {
  const { io } = useContext(IndiceContext);
  const [type, setType] = useState(options.chatType ?? "orders");
  const [filter, setFilter] = useState("");
  const [filterChats, setFilterChats] = useState([]);
  const [chats, setChats] = useState(baseChats);
  const [canShowMore, setCanShowMore] = useState(baseCanShowMore);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!io) {
      return;
    }
    // Додаткові дії, якщо потрібні
  }, [io]);

  const changeType = async (newType) => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (newType !== "disputes") {
        newType = "orders";
      }

      setType(newType);

      const result = await getChatList(
        {
          chatType: newType,
          lastChatId: null,
        },
        authToken
      );

      setCanShowMore(result.chatsCanShowMore);
      setChats(result.chats);
      setFilter("");
      setFilterChats([]);

      if (newType === "disputes") {
        changeLocation(`/dashboard/chat?chat-type=${newType}`);
      } else {
        changeLocation(`/dashboard/chat`);
      }
    } catch (e) {
      // Обробка помилок
    } finally {
      setLoading(false);
    }
  };

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
        {
          chatType: type,
          lastChatId,
        },
        authToken
      );

      setCanShowMore(result.chatsCanShowMore);
      setChats([...chats, ...result.chats]);
    } catch (e) {
      // Обробка помилок
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
          chatType: type,
          chatFilter: filter,
        },
        authToken
      );

      setFilterChats(result.chats);
    } catch (e) {
      // Обробка помилок
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
        chat.id === chatId ? { ...chat, ...chatInfo } : chat
      );

      newChatList.sort((a, b) => b.messageCreatedAt - a.messageCreatedAt);
      return newChatList;
    });
  };

  const startTyping = (chatId) => updateChatInfo(chatId, { typing: true });

  const finishTyping = (chatId) => updateChatInfo(chatId, { typing: false });

  const opponentOnline = (chatId) =>
    updateChatInfo(chatId, { opponentOnline: true });

  const opponentOffline = (chatId) =>
    updateChatInfo(chatId, { opponentOnline: false });

  const deleteMessage = (messageChatId, messageId, previousMessage) => {
    setChats((prevChats) => {
      const newChatList = prevChats.map((chat) =>
        chat.id === messageChatId && chat.messageId === messageId
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

  const onGetMessage = (message, opponent = null) => {
    setChats((prevChats) => {
      const prevFirstChat = prevChats.find(
        (chat) => chat.id === message.chatId
      );

      const newChatList = prevChats.filter(
        (chat) => chat.id !== message.chatId
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

      if (opponent) {
        firstChat["opponentId"] = opponent?.id;
        firstChat["opponentName"] = opponent?.name;
        firstChat["opponentOnline"] = opponent?.online;
        firstChat["opponentPhoto"] = opponent?.photo;
        firstChat["opponentTyping"] = false;
      }

      return [firstChat, ...newChatList];
    });
  };

  return {
    loading,
    type,
    chats,
    changeType,
    filter,
    setFilter,
    filterChats,
    canShowMore,
    handleShowMore,
    updateChatInfo,
    startTyping,
    finishTyping,
    opponentOnline,
    opponentOffline,
    deleteMessage,
    onGetMessage,
  };
};

export default useChatList;
