import { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../contexts";
import { getChatBaseInfo, getChatMessageList } from "../services/chat";

const useChatMessageList = ({
  messages: baseMessages,
  canShowMore: baseCanShowMore,
  chatId: baseChatId,
  authToken,
  entity: baseEntity = null,
}) => {
  const { io } = useContext(IndiceContext);

  const stateRef = useRef({
    messages: baseMessages,
    canShowMore: baseCanShowMore,
    entity: baseEntity,
    chatId: baseChatId,
  });

  const [, rewriteState] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!io) {
      return;
    }
  });

  const setStateRef = (newState) => {
    stateRef.current = { ...stateRef.current, ...newState };
    rewriteState((prev) => !prev);
  };

  useEffect(() => {
    setStateRef({ chatId: baseChatId });
  }, [baseChatId]);

  const handleShowMore = async () => {
    if (loading || !stateRef.current.canShowMore) {
      return;
    }

    setLoading(true);

    try {
      if (!stateRef.current.messages.length) {
        return;
      }

      const lastMessageId = stateRef.current.messages[0].id;

      const result = await getChatMessageList(
        {
          chatId: stateRef.current.chatId,
          lastMessageId,
        },
        authToken
      );

      setStateRef({
        canShowMore: result.messagesCanShowMore,
        messages: [...result.messages, ...stateRef.current.messages],
      });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleChangeChat = async (newChatId) => {
    if (newChatId == stateRef.current.chatId) {
      return;
    }

    try {
      const result = await getChatBaseInfo(
        {
          chatId: newChatId,
        },
        authToken
      );

      setStateRef({
        canShowMore: result.messagesCanShowMore,
        messages: [...result.messages],
        entity: result.entity,
      });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStateRef({
      entity: null,
      canShowMore: false,
      messages: [],
    });
  };

  const appendMessageToChat = (message) => {
    if (stateRef.current.chatId != message.chatId) {
      return;
    }

    setStateRef({
      messages: [...stateRef.current.messages, message],
    });
  };

  const updateMessageByField = (message, fieldValue, field) => {
    if (stateRef.current.chatId != message.chatId) {
      return;
    }

    const newMessages = [];

    stateRef.current.messages.forEach((prevMessage) => {
      if (prevMessage[field] == fieldValue) {
        prevMessage = { ...prevMessage, ...message };
      }

      newMessages.push(prevMessage);
    });

    setStateRef({
      messages: newMessages,
    });
  };

  const updateMessageByTempKey = (message, tempKey) =>
    updateMessageByField(message, tempKey, "tempKey");

  const updateMessageById = (message, id) =>
    updateMessageByField(message, id, "id");

  const successCreatedMessage = (message, tempKey) =>
    updateMessageByTempKey({ ...message, tempKey: null }, tempKey);

  const onUpdateMessagePercent = (percent, tempKey) =>
    updateMessageByTempKey({ percent }, tempKey);

  const onCancelledMessage = (tempKey) => {
    const newMessages = [
      ...stateRef.current.messages.filter(
        (message) => message.tempKey != tempKey
      ),
    ];

    setStateRef({
      messages: newMessages,
    });
  };

  const deleteMessage = (messageChatId, messageId, replacementMessage) => {
    if (stateRef.current.chatId != messageChatId) {
      return;
    }

    const filteredMessages = [
      ...stateRef.current.messages.filter((message) => message.id != messageId),
    ];

    let newMessages = [];

    if (replacementMessage) {
      const chatHasMessage = !!stateRef.current.messages.find(
        (message) => message.id == replacementMessage.id
      );

      if (chatHasMessage) {
        newMessages = filteredMessages;
      } else {
        newMessages = [replacementMessage, ...filteredMessages];
      }
    } else {
      newMessages = filteredMessages;
    }

    setStateRef({
      messages: newMessages,
    });
  };

  return {
    loading,
    entity: stateRef.current.entity,
    messages: stateRef.current.messages,
    canShowMore: stateRef.current.canShowMore,
    handleShowMore,
    handleChangeChat,
    reset,
    appendMessageToChat,
    successCreatedMessage,
    onUpdateMessagePercent,
    onCancelledMessage,
    updateMessage: updateMessageById,
    deleteMessage,
  };
};

export default useChatMessageList;
