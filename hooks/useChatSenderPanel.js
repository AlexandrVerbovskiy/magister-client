import { useEffect, useRef, useState } from "react";
import { generateRandomString, validateBigText, autoConvert } from "../utils";

const useChatSenderPanel = ({
  stopUpdatingMessage,
  updatingMessage,
  updateMessage,
  chatId,
  sendTextMessage,
  sendMediaMessage,
  startTyping,
  finishTyping,
}) => {
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    setMessage("");
    setMessageError(null);
  }, [chatId]);

  useEffect(() => {
    if (updatingMessage) {
      setMessage(updatingMessage.content.text);
      messageInputRef.current.focus();
    } else {
      setMessage("");
    }

    setMessageError(null);
  }, [JSON.stringify(updatingMessage)]);

  const handleTextMessageSend = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (trimmedMessage.length < 1) {
      return;
    }

    if (validateBigText(trimmedMessage) !== true) {
      setMessageError(validateBigText(trimmedMessage));
      return;
    }

    if (updatingMessage) {
      updateMessage(updatingMessage.id, trimmedMessage);
      stopUpdatingMessage();
    } else {
      const tempKey = generateRandomString();

      sendTextMessage({
        chatId,
        messageType: "text",
        text: trimmedMessage,
        dop: { tempKey },
      });
    }

    setMessage("");
  };

  const handleInputMessage = (e) => {
    setMessage(e.target.value);
    setMessageError(null);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleTextMessageSend(e);
    }
  };

  const handleSendMedia = async (file) => {
    if (!file.src) {
      return;
    }

    const { data, dataType } = await autoConvert(file.src);

    sendMediaMessage({
      chatId,
      data,
      dataType,
      filetype: file.type,
      filename: file.name,
      fileSrc: file.src,
    });
  };

  const handleStartTyping = (e) => {
    startTyping(chatId);
  };

  const handleFinishTyping = (e) => {
    finishTyping(chatId);
  };

  return {
    message,
    messageInputRef,
    messageError,
    handleTextMessageSend,
    handleInputMessage,
    handleInputKeyPress,
    handleSendMedia,
    handleStartTyping,
    handleFinishTyping,
  };
};

export default useChatSenderPanel;
