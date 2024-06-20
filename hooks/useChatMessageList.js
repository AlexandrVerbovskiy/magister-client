import { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../contexts";
import { getChatMessageList } from "../services/chat";

const useChatMessageList = ({
  messages: baseMessages,
  canShowMore: baseCanShowMore,
  chatId: baseChatId,
  authToken,
}) => {
  const { io } = useContext(IndiceContext);

  const stateRef = useRef({
    messages: baseMessages,
    canShowMore: baseCanShowMore,
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
    stateRef.current = newState;
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
      const result = await getChatMessageList(
        {
          chatId: newChatId,
        },
        authToken
      );

      setStateRef({
        canShowMore: result.messagesCanShowMore,
        messages: [...result.messages],
      });
      setChatId(newChatId);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStateRef({
      canShowMore: false,
      messages: [],
    });
    setChatId(null);
  };

  const appendMessageToChat = (message) => {
    setStateRef({
      ...stateRef.current,
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
      ...stateRef.current,
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
      ...stateRef.current,
      messages: newMessages,
    });
  };

  return {
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
