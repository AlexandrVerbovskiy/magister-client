import React from "react";
import ErrorSpan from "../ErrorSpan";
import SendFileButton from "./SendFileButton";
import {useChatSenderPanel} from "../../../hooks";

function ChatFooter(props) {
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

  return (
    <div className="sticky bottom-0">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 md:px-5 h-16">
        <SendFileButton handleSendMedia={handleSendMedia} />

        <form className="grow flex" onSubmit={handleTextMessageSend}>
          <div className="grow mr-3">
            <label htmlFor="message-input" className="sr-only">
              Type a message
            </label>
            <input
              id="message-input"
              className="form-input w-full bg-slate-100 dark:bg-slate-800 border-transparent dark:border-transparent focus:bg-white dark:focus:bg-slate-800 placeholder-slate-500"
              type="text"
              ref={messageInputRef}
              placeholder="Type your message..."
              value={message}
              onInput={handleInputMessage}
              onKeyDown={handleInputKeyPress}
              onFocus={handleStartTyping}
              onBlur={handleFinishTyping}
            />

            <ErrorSpan error={messageError} />
          </div>
          <button
            type="submit"
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap"
          >
            Send -&gt;
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatFooter;
