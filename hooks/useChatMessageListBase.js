import { useContext, useEffect, useRef, useState } from "react";
import useMediaActions from "./useMediaActions";
import { IndiceContext } from "../contexts";
import { indicateMediaTypeByExtension } from "../utils";

const useChatMessageListBase = ({
  messages: baseMessages,
  canShowMore: baseCanShowMore,
  chatId: baseChatId,
  authToken,
  getMessageList,
  getChatInfo,
  onChangeChat,
  onReset,
}) => {
  const [messages, setMessages] = useState(baseMessages);
  const [canShowMore, setCanShowMore] = useState(baseCanShowMore);
  const [loading, setLoading] = useState(false);
  const chatIdRef = useRef(baseChatId);
  const { sessionUser } = useContext(IndiceContext);

  const {
    createMediaActions,
    onSuccessSendBlobPart,
    onStopSendMedia,
    getChatMessages: getChatLoadingMessages,
    stopAllSendMedia,
  } = useMediaActions();

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

      const result = await getMessageList(
        {
          chatId: chatIdRef.current,
          lastMessageId,
        },
        authToken
      );

      setCanShowMore(result.messagesCanShowMore);
      setMessages([...result.messages, ...messages]);
    } catch (e) {
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
      const result = await getChatInfo(
        {
          chatId: newChatId,
        },
        authToken
      );

      const loadingMessagesParts = getChatLoadingMessages(newChatId);

      const loadingMessages = loadingMessagesParts.map((message) => {
        const messageType = indicateMediaTypeByExtension(message.filetype);

        return {
          chatId: message.chatId,
          type: messageType,
          content: { filename: message.filename, path: message.contentPath },
          senderId: sessionUser?.id,
          tempKey: message.tempKey,
          senderPhoto: sessionUser?.photo,
          isAdminSender: false,
          createdAt: message.createdAt.toISOString(),
        };
      });

      setCanShowMore(result.messagesCanShowMore);
      setMessages([...result.messages, ...loadingMessages]);
      onChangeChat(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCanShowMore(false);
    setMessages([]);
    onReset();
  };

  const appendMessageToChat = (message) => {
    if (chatIdRef.current !== message.chatId) {
      return;
    }

    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const updateMessageByField = (message, fieldValue, field) => {
    if (chatIdRef.current !== message.chatId) {
      return;
    }

    setMessages((prevMessages) => {
      return prevMessages.map((prevMessage) => {
        let newMessage = { ...prevMessage };

        if (prevMessage[field] === fieldValue) {
          newMessage = { ...prevMessage, ...message };
        }

        return newMessage;
      });
    });
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

  const onUpdateMessagePercent = ({ percent, chatId, tempKey }) => {
    updateMessageByTempKey({ percent, chatId }, tempKey);
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

  return {
    chatId: chatIdRef.current,
    messages,
    setMessages,
    canShowMore,
    setCanShowMore,
    loading,
    setLoading,
    handleShowMore,
    handleChangeChat,
    reset,
    updateMessage: updateMessageById,
    successCreatedMessage,
    onUpdateMessagePercent,
    onCancelledMessage,
    deleteMessage,
    appendMessageToChat,
    createMediaActions,
    onSuccessSendBlobPart,
    onStopSendMedia,
    stopAllSendMedia,
  };
};

export default useChatMessageListBase;
