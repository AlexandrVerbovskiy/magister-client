import { useRef, useState } from "react";
import SendFileButton from "./SendFileButton";

const SenderPanel = () => {
  const [message, setMessage] = useState("");

  const handleTextMessageSend = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (trimmedMessage.length < 1) {
      return;
    }

    console.log(trimmedMessage);
    return;
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

        <SendFileButton />
      </div>

      <input
        type="text"
        className="form-control me-2"
        placeholder="Type your message..."
        value={message}
        onInput={(e) => setMessage(e.target.value)}
      />

      <button type="submit" className="send-btn d-inline-block">
        Send <i className="bx bx-paper-plane"></i>
      </button>
    </form>
  );
};

export default SenderPanel;
