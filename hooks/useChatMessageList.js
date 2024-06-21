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
  });

  const [, rewriteState] = useState(false);
  const [chatId, setChatId] = useState(baseChatId);
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
          chatId,
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
    if (newChatId == chatId) {
      return;
    }

    try {
      const result = await getChatBaseInfo(
        {
          chatId: newChatId,
        },
        authToken
      );

      console.log(result.entity);

      setStateRef({
        canShowMore: result.messagesCanShowMore,
        messages: [...result.messages],
        entity: result.entity,
      });

      setChatId(newChatId);
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
    setChatId(null);
  };

  const appendMessageToChat = (message) => {
    setStateRef({
      messages: [...stateRef.current.messages, message],
    });
  };

  const updateMessageByTempKey = (message, tempKey) => {
    const newMessages = [];

    stateRef.current.messages.forEach((prevMessage) => {
      if (prevMessage.tempKey == tempKey) {
        prevMessage = { ...prevMessage, ...message };
      }

      newMessages.push(prevMessage);
    });

    setStateRef({
      messages: newMessages,
    });
  };

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

  return {
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
  };
};

export default useChatMessageList;
