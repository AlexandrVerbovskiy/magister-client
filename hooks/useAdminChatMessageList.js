import { useEffect, useRef, useState } from "react";
import {
  getAdminChatBaseInfo,
  getAdminChatMessageList,
} from "../services/chat";

const useAdminChatMessageList = ({
  messages: baseMessages,
  canShowMore: baseCanShowMore,
  chatId: baseChatId,
  authToken,
  order: baseOrder = null,
  dispute: baseDispute = null,
  dopInfo: baseDopInfo = null,
}) => {
  const [messages, setMessages] = useState(baseMessages);
  const [canShowMore, setCanShowMore] = useState(baseCanShowMore);
  const [order, setOrder] = useState(baseOrder);
  const [dispute, setDispute] = useState(baseDispute);
  const [dopInfo, setDopInfo] = useState(baseDopInfo);
  const [loading, setLoading] = useState(false);
  const chatIdRef = useRef(baseChatId);

  useEffect(() => {
    chatIdRef.current = baseChatId;
  }, [baseChatId]);

  const handleShowMore = async () => {
    if (loading || !canShowMore) {
      return;
    }

    setLoading(true);

    try {
      if (!messages.length) {
        return;
      }

      const lastMessageId = messages[0].id;

      const result = await getAdminChatMessageList(
        {
          chatId: chatIdRef.current,
          lastMessageId,
        },
        authToken
      );

      setCanShowMore(result.messagesCanShowMore);
      setMessages([...result.messages, ...messages]);
    } catch (e) {
      // Обробка помилок
    } finally {
      setLoading(false);
    }
  };

  const handleChangeChat = async (newChatId) => {
    if (newChatId === chatIdRef.current) {
      return;
    }

    setLoading(true);

    try {
      const result = await getAdminChatBaseInfo(
        {
          chatId: newChatId,
        },
        authToken
      );

      setCanShowMore(result.messagesCanShowMore);
      setMessages([...result.messages]);
      setOrder(result.order);
      setDispute(result.dispute);
      setDopInfo(result.dopInfo);
    } catch (e) {
      // Обробка помилок
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    order,
    dispute,
    messages,
    canShowMore,
    dopInfo,
    handleShowMore,
    handleChangeChat,
  };
};

export default useAdminChatMessageList;
