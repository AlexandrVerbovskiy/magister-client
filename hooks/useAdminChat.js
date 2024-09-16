import { useEffect, useRef, useState } from "react";
import useAdminChatList from "./useAdminChatList";
import useAdminChatMessageList from "./useAdminChatMessageList";
import useChatBase from "./useChatBase";
import { useRouter } from "next/router";
import useChatWindowsChanger from "./useChatWindowsChanger";

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
  const router = useRouter();
  const firstUpdateChatRef = useRef(true);
  const [selectedChatId, setSelectedChatId] = useState(baseChatId);
  const [mainSelectedChatId, setMainSelectedChatId] =
    useState(baseMainSearchChatId);
  const windowProps = useChatWindowsChanger(selectedChatId);

  const onChatIdUpdate = async (chatId) => {
    let mainSelectedChatInfo = chats.find((chat) =>
      [chat.id, chat.ownerChatId, chat.tenantChatId].includes(chatId)
    );

    if (mainSelectedChatInfo) {
      setSelectedChatId(chatId);
      setMainSelectedChatId(mainSelectedChatInfo.id);
      await bodyProps.handleChangeChat(chatId);
    } else {
      setSelectedChatId(null);
      setMainSelectedChatId(null);
    }
  };

  useEffect(() => {
    if (firstUpdateChatRef.current) {
      firstUpdateChatRef.current = false;
    } else {
      if (baseChatId) {
        onChatIdUpdate(baseChatId);
      }
    }
  }, [baseChatId]);

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

  useEffect(() => {
    if (!selectedChatId) {
      return;
    }

    windowProps.scrollBodyBottom();
  }, [selectedChatId]);

  const scrollBodyBottom = () => windowProps.scrollBodyBottom();

  const handleSelectChat = async (chatId) => {
    router.push(`/admin/chats/${chatId}/`);
  };

  const handleSelectSubChat = async (chatId) => {
    router.push(`/admin/chats/${chatId}/`);
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
    bodyProps,
    order: bodyProps.order,
    dispute: bodyProps.dispute,
    selectedChatId,
    actions: { ...chatActions },
    updateDisputeStatus,
    windowProps,
  };
};

export default useAdminChat;
