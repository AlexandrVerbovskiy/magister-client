import { useRef, useState } from "react";
import SendFileButton from "./SendFileButton";
import {
  generateRandomString,
  validateBigText,
  autoConvert,
} from "../../utils";
import ErrorSpan from "../ErrorSpan";

const SenderPanel = ({
  chatId,
  sendTextMessage,
  sendMediaMessage,
  startTyping,
  finishTyping,
}) => {
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(null);

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

    const tempKey = generateRandomString();

    sendTextMessage({
      chatId,
      messageType: "text",
      text: trimmedMessage,
      dop: { tempKey },
    });

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
    });
  };

  const handleStartTyping = (e) => {
    startTyping(chatId);
  };

  const handleFinishTyping = (e) => {
    finishTyping(chatId);
  };

  return (
    <form
      className="d-flex align-items-center"
      onSubmit={handleTextMessageSend}
    >
      <div className="btn-box d-flex align-items-center me-2">
        {/* <button
          className="emoji-btn d-inline-block me-1"
          data-toggle="tooltip"
          data-placement="top"
          title="Emoji"
          type="button"
        >
          <i className="bx bx-smile"></i>
        </button> */}

        <SendFileButton handleSendMedia={handleSendMedia} />
      </div>

      <div className="form-group me-2 mb-0 w-100">
        <input
          type="text"
          className={`form-control${messageError ? " is-invalid" : ""}`}
          placeholder="Type your message..."
          value={message}
          onInput={handleInputMessage}
          onKeyDown={handleInputKeyPress}
          onFocus={handleStartTyping}
          onBlur={handleFinishTyping}
        />

        <ErrorSpan error={messageError} />
      </div>

      <button type="submit" className="send-btn d-inline-block">
        Send <i className="bx bx-paper-plane"></i>
      </button>
    </form>
  );
};

export default SenderPanel;
