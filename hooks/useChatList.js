import { getChatList } from "../services/chat";
import STATIC from "../static";
import useChatListBase from "./useChatListBase";
import { useRouter } from "next/router";

const useChatList = (props) => {
  const { authToken, typeRef } = props;
  const router = useRouter();

  const onChatTypeUpdate = async (newType) => {
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
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const chatListActions = useChatListBase({
    ...props,
    getChatList,
    getDopOptions: () => ({ chatType: typeRef.current }),
    chatHasRelationToOther: (chat, chatId) => chat.id === chatId,
    checkMainRelationToOther: (chat, chatId) => chat.id === chatId,
    ignoreNewMessageCondition: (message) =>
      message.entityType != typeRef.current,
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

  const changeType = async (newType) => {
    if (loading) {
      return;
    }

    let newPath = `/dashboard/chats/`;

    if (newType === STATIC.CHAT_TYPES.DISPUTE) {
      newPath += "?chat-type=" + newType;
    }

    router.push(newPath);
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
    onChatTypeUpdate,
  };
};

export default useChatList;
