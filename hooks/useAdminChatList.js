import { getAdminChatList } from "../services/chat";
import useChatListBase from "./useChatListBase";

const useAdminChatList = (props) => {
  const chatListActions = useChatListBase({
    ...props,
    getChatList: getAdminChatList,
    chatHasRelationToOther: (chat, chatId) =>
      [chat.id, chat.ownerChatId, chat.renterChatId].includes(chatId),
    checkMainRelationToOther: (chat, chatId) => chat.id === chatId,
  });

  return {
    ...chatListActions,
  };
};

export default useAdminChatList;
