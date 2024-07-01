import { useEffect, useRef, useState } from "react";
import { getChatList } from "../services/chat";
import { changeLocation } from "../utils";
import STATIC from "../static";
import useChatListBase from "./useChatListBase";

const useChatList = (props) => {
  const { options, authToken } = props;

  const chatListActions = useChatListBase({
    ...props,
    getChatList,
    getDopOptions: () => ({ chatType: typeRef.current }),
    chatHasRelationToOther: (chat, chatId) => chat.id === chatId,
    checkMainRelationToOther: (chat, chatId) => chat.id === chatId,
  });

  const {
    loading,
    updateChatInfo,
    setLoading,
    setCanShowMore,
    setChats,
    setFilter,
    setFilterChats,
  } = chatListActions;

  const typeRef = useRef(options.chatType ?? STATIC.CHAT_TYPES.ORDER);

  const changeType = async (newType) => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (newType !== STATIC.CHAT_TYPES.DISPUTE) {
        newType = STATIC.CHAT_TYPES.ORDER;
      }

      typeRef.current = newType;

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

      if (newType === STATIC.CHAT_TYPES.DISPUTE) {
        changeLocation(`/dashboard/chats?chat-type=${newType}`);
      } else {
        changeLocation(`/dashboard/chats`);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const opponentOnline = (chatId) =>
    updateChatInfo(chatId, { opponentOnline: true });

  const opponentOffline = (chatId) =>
    updateChatInfo(chatId, { opponentOnline: false });

  return {
    loading,
    type: typeRef.current,
    changeType,
    setFilter,
    updateChatInfo,
    opponentOnline,
    opponentOffline,
    ...chatListActions,
    ignoreNewMessageCondition: (message) =>
      message.entityType != typeRef.current,
  };
};

export default useChatList;
