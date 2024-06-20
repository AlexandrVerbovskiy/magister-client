import { useContext, useEffect, useRef, useState } from "react";
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

  const stateRef = useRef({
    chats: baseChats,
    canShowMore: baseCanShowMore,
  });

  const [, rewriteState] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!io) {
      return;
    }
  });

  const setStateRef = (newState) => {
    stateRef.current = newState;
    rewriteState((prev) => !prev);
  };

  const changeType = async (newType) => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (newType != "disputes") {
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

      setStateRef({
        canShowMore: result.chatsCanShowMore,
        chats: [...result.chats],
      });

      setFilter("");
      setFilterChats([]);

      if (newType == "disputes") {
        changeLocation(`/dashboard/chat?chat-type=${newType}`);
      } else {
        changeLocation(`/dashboard/chat`);
      }
    } catch (e) {
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
      if (!stateRef.current.chats.length) {
        return;
      }

      const lastChatId =
        stateRef.current.chats[stateRef.current.chats.length - 1].id;

      const result = await getChatList(
        {
          chatType: type,
          lastChatId,
        },
        authToken
      );

      setStateRef({
        canShowMore: result.chatsCanShowMore,
        chats: [...prev, ...result.chats],
      });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const getFilterChats = async (filter) => {
    if (loading || !stateRef.current.canShowMore) {
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

      setFilterChats([...result.chats]);
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
    const newChatList = [];

    stateRef.current.chats.forEach((chat) => {
      if (chat.id === chatId) {
        chat = { ...chat, ...chatInfo };
      }

      newChatList.push(chat);
    });

    newChatList.sort((a, b) => a.messageCreatedAt - b.messageCreatedAt);

    setStateRef({
      ...stateRef.current,
      chats: [...newChatList],
    });
  };

  const startTyping = (chatId) => updateChatInfo(chatId, { typing: true });

  const finishTyping = (chatId) => updateChatInfo(chatId, { typing: false });

  const opponentOnline = (chatId) => {
    updateChatInfo(chatId, { opponentOnline: true });
  };

  const opponentOffline = (chatId) =>
    updateChatInfo(chatId, { opponentOnline: false });

  return {
    type,
    chats: stateRef.current.chats,
    changeType,
    filter,
    setFilter,
    filterChats,
    canShowMore: stateRef.current.canShowMore,
    handleShowMore,
    updateChatInfo,
    startTyping,
    finishTyping,
    opponentOnline,
    opponentOffline,
  };
};

export default useChatList;
