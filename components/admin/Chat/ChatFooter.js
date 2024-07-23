import React from "react";
import ErrorSpan from "../ErrorSpan";
import SendFileButton from "./SendFileButton";

function ChatFooter(props) {
  const {
    message,
    messageInputRef,
    messageError,
    handleTextMessageSend,
    handleInputMessage,
    handleInputKeyPress,
    handleStartTyping,
    handleFinishTyping,
    fileInputRef,
    handleFileInputChange,
    updatingMessage,
    stopUpdatingMessage,
  } = props;

  return (
    <div className="message-footer relative bottom-0">
      {updatingMessage && (
        <div className="text-sm absolute top-0 w-full flex items-center mb-2 editable-message-panel -translate-y-full border-t h-10 px-4 sm:px-6 md:px-5 bg-white">
          <div className="flex items-center w-full text-gray-600">
            <div className="whitespace-nowrap">
              <b>Edit Message:</b>
            </div>
            <div className="ml-1 w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
              {updatingMessage.content.text}
            </div>
            <div className="ml-1" onClick={stopUpdatingMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-x cursor-pointer stroke-gray-600 hover:stroke-black transition duration-150"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 md:px-5 h-16">
        <SendFileButton
          fileInputRef={fileInputRef}
          handleFileInputChange={handleFileInputChange}
        />

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
