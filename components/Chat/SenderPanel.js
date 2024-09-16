import SendFileButton from "./SendFileButton";
import ErrorSpan from "../ErrorSpan";
import { useChatSenderPanel } from "../../hooks";

const SenderPanel = (props) => {
  const { stopUpdatingMessage, updatingMessage } = props;
  const {
    message,
    messageInputRef,
    messageError,
    handleTextMessageSend,
    handleInputMessage,
    handleInputKeyPress,
    handleSendMedia,
    handleStartTyping,
    handleFinishTyping,
  } = useChatSenderPanel(props);

  const onFocusInput = () => {
    if (!updatingMessage) {
      handleStartTyping();
    }
  };

  const onBlurInput = () => {
    if (!updatingMessage) {
      handleFinishTyping();
    }
  };

  return (
    <>
      {updatingMessage && (
        <div className="d-flex align-items-center mb-2 editable-message-panel">
          <div
            className="btn-box d-flex align-items-center w-100"
            style={{ color: "#999999" }}
          >
            <i className="bx bx-pencil me-2"></i>
            <div style={{ textWrap: "nowrap" }}>Edit Message:</div>
            <div
              className="ms-1 w-100 overflow-hidden"
              style={{ textOverflow: "ellipsis", textWrap: "nowrap" }}
            >
              {updatingMessage.content.text}
            </div>
            <div className="ms-1" onClick={stopUpdatingMessage}>
              <i
                className="bx bx-plus me-2"
                style={{
                  transform: "rotate(45deg)",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              ></i>
            </div>
          </div>{" "}
        </div>
      )}

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
            ref={messageInputRef}
            type="text"
            className={`form-control${messageError ? " is-invalid" : ""}`}
            placeholder="Type your message..."
            value={message}
            onInput={handleInputMessage}
            onKeyDown={handleInputKeyPress}
            onFocus={onFocusInput}
            onBlur={onBlurInput}
          />

          <ErrorSpan error={messageError} />
        </div>

        <button type="submit" className="send-btn d-inline-block">
          Send <i className="bx bx-paper-plane"></i>
        </button>
      </form>
    </>
  );
};

export default SenderPanel;
