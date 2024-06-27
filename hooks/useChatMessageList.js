import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../contexts";
import { getChatBaseInfo, getChatMessageList } from "../services/chat";

const useChatMessageList = ({
  messages: baseMessages,
  canShowMore: baseCanShowMore,
  chatId: baseChatId,
  authToken,
  entity: baseEntity = null,
  dopEntityInfo: baseDopEntityInfo = null,
}) => {
  const { io } = useContext(IndiceContext);

  const [messages, setMessages] = useState(baseMessages);
  const [canShowMore, setCanShowMore] = useState(baseCanShowMore);
  const [entity, setEntity] = useState(baseEntity);
  const [dopEntityInfo, setDopEntityInfo] = useState(baseDopEntityInfo);
  const [loading, setLoading] = useState(false);
  const chatIdRef = useRef(baseChatId);

  useEffect(() => {
    if (!io) {
      return;
    }
  }, [io]);

  useEffect(() => {
    chatIdRef.current = baseChatId;
  }, [baseChatId]);

  const updateEntity = (part) => {
    setEntity((prev) => ({ ...prev, ...part }));
  };

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

      const result = await getChatMessageList(
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
      const result = await getChatBaseInfo(
        {
          chatId: newChatId,
        },
        authToken
      );

      setCanShowMore(result.messagesCanShowMore);
      setMessages([...result.messages]);
      setEntity(result.entity);
      setDopEntityInfo(result.dopEntityInfo);
    } catch (e) {
      // Обробка помилок
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setEntity(null);
    setCanShowMore(false);
    setDopEntityInfo(null);
    setMessages([]);
  };

  const appendMessageToChat = (message) => {
    console.log(chatIdRef.current, message.chatId);

    if (chatIdRef.current !== message.chatId) {
      return;
    }

    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const updateMessageByField = (message, fieldValue, field) => {
    if (chatIdRef.current !== message.chatId) {
      return;
    }

    setMessages((prevMessages) =>
      prevMessages.map((prevMessage) =>
        prevMessage[field] === fieldValue
          ? { ...prevMessage, ...message }
          : prevMessage
      )
    );
  };

  const updateMessageByTempKey = (message, tempKey) => {
    updateMessageByField(message, tempKey, "tempKey");
  };

  const updateMessageById = (message, id) => {
    updateMessageByField(message, id, "id");
  };

  const successCreatedMessage = (message, tempKey) => {
    updateMessageByTempKey({ ...message, tempKey: null }, tempKey);
  };

  const onUpdateMessagePercent = (percent, tempKey) => {
    updateMessageByTempKey({ percent }, tempKey);
  };

  const onCancelledMessage = (tempKey) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.tempKey !== tempKey)
    );
  };

  const deleteMessage = (messageChatId, messageId, replacementMessage) => {
    if (chatIdRef.current !== messageChatId) {
      return;
    }

    setMessages((prevMessages) => {
      const filteredMessages = prevMessages.filter(
        (message) => message.id !== messageId
      );

      if (replacementMessage) {
        const chatHasMessage = prevMessages.some(
          (message) => message.id === replacementMessage.id
        );
        return chatHasMessage
          ? filteredMessages
          : [replacementMessage, ...filteredMessages];
      }

      return filteredMessages;
    });
  };

  const handleOrderUpdate = (orderPart) => {
    if (orderPart.id === entity?.id) {
      setEntity((prevEntity) => ({ ...prevEntity, ...orderPart }));
    }
  };

  return {
    loading,
    updateEntity,
    entity,
    messages,
    canShowMore,
    dopEntityInfo,
    handleShowMore,
    handleChangeChat,
    reset,
    appendMessageToChat,
    successCreatedMessage,
    onUpdateMessagePercent,
    onCancelledMessage,
    updateMessage: updateMessageById,
    deleteMessage,
    handleOrderUpdate,
  };
};

export default useChatMessageList;
