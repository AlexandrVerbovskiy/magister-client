import { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../contexts";
import { getChatBaseInfo, getChatMessageList } from "../services/chat";
import useSingleOrderActions from "./useSingleOrderActions";

const useChatMessageList = ({
  messages: baseMessages,
  canShowMore: baseCanShowMore,
  chatId: baseChatId,
  authToken,
  entity: baseEntity = null,
  dopEntityInfo: baseDopEntityInfo = null,
}) => {
  const { io } = useContext(IndiceContext);

  const stateRef = useRef({
    messages: baseMessages,
    canShowMore: baseCanShowMore,
    entity: baseEntity,
    chatId: baseChatId,
    dopEntityInfo: baseDopEntityInfo,
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
        dopEntityInfo: result.dopEntityInfo,
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
      dopEntityInfo: null,
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

  const handleOrderUpdate = (order) => {
    if (order.id == stateRef.current.entity?.id) {
      setStateRef({ entity: { ...stateRef.current.entity, ...order } });
    }
  };

  return {
    loading,
    setEntity: setStateRef,
    entity: stateRef.current.entity,
    messages: stateRef.current.messages,
    canShowMore: stateRef.current.canShowMore,
    dopEntityInfo: stateRef.current.dopEntityInfo,
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
