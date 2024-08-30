import { useContext, useRef, useState } from "react";
import { IndiceContext } from "../../../contexts";
import useMessage from "../../../hooks/useMessage";
import { formatTimeWithAmPm, generateProfileFilePath } from "../../../utils";
import DropdownMenu from "../../_App/DropdownMenu";
import ChatMessageContent from "./ChatMessageContent";
import STATIC from "../../../static";

const ChatMessage = ({
  id,
  type,
  content,
  tempKey = null,
  senderPhoto = null,
  createdAt,
  senderId,
  adminSend,
  percent = 0,
  stopSendMediaMessage,
  handleChangeUpdatingMessageId,
  handleDeleteMessage,
  chatId,
  order,
  dispute,
  hidden,
  contentStory,
  handleOpenContentStoryPopup,
  isSubChat,
}) => {
  const { sessionUser } = useContext(IndiceContext);
  const isAuthor = senderId == sessionUser?.id || adminSend;
  const messageClassName = isAuthor
    ? "text-sm bg-indigo-500 text-white p-3 rounded-lg rounded-tl-none border border-transparent shadow-md mb-1"
    : "text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-md mb-1";

  const messageRef = useRef(null);
  const messageParentRef = useRef(null);

  const {
    activePopup: activeEditablePopup,
    popupCoords,
    isTemp,
    isText,
    isManuallySent,
    closePopup: closeEditablePopup,
    handleActivateEditPopup,
    handleEditClick,
    handleDeleteClick,
  } = useMessage({
    id,
    type,
    tempKey,
    chatId,
    handleDeleteMessage,
    handleChangeUpdatingMessageId,
    isAuthor,
    senderPhoto,
    messageRef,
    messageParentRef,
    popupMarginBottom: 12,
    authorMessageLocation: STATIC.AUTHOR_MESSAGE_LOCATIONS.LEFT,
  });

  return (
    <div
      id={`message-${id}`}
      className="flex items-start mb-4 last:mb-0 chat-message"
      ref={messageParentRef}
    >
      <img
        className="rounded-full mr-4"
        src={
          senderPhoto
            ? generateProfileFilePath(senderPhoto)
            : STATIC.DEFAULTS.ADMIN_CHAT_LOGO
        }
        width="40"
        height="40"
        alt="User photo"
        style={{ width: "40px", height: "40px" }}
      />
      <div
        ref={messageRef}
        onContextMenu={handleActivateEditPopup}
        className="relative message-body"
      >
        <ChatMessageContent
          order={order}
          dispute={dispute}
          isTemp={isTemp}
          type={type}
          content={content}
          messageClassName={messageClassName}
          senderId={senderId}
        />

        {isTemp ? (
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => stopSendMediaMessage(tempKey)}
          >
            <div className="text-xs text-slate-500 font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-alarm"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="rgb(100 116 139)"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 13m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M12 10l0 3l2 0" />
                <path d="M7 4l-2.75 2" />
                <path d="M17 4l2.75 2" />
              </svg>
              {!isText && <>{Number(percent).toFixed(2)}%</>}
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="text-xs text-slate-500 font-medium">
              {formatTimeWithAmPm(createdAt)}
            </div>

            {!isSubChat && contentStory && contentStory.length && (
              <div
                onClick={(e) => handleOpenContentStoryPopup(e, contentStory)}
                className="cursor-pointer text-xs text-emerald-500 font-medium bg-emerald-100 py-0.5 px-2 rounded-lg ml-2"
              >
                Edited
              </div>
            )}

            {!isSubChat && hidden && (
              <div className="text-xs text-rose-500 font-medium bg-rose-100 py-0.5 px-2 rounded-lg ml-2">
                Deleted
              </div>
            )}
          </div>
        )}

        {!isTemp && isAuthor && isManuallySent && (
          <DropdownMenu
            activePopup={activeEditablePopup}
            closePopup={closeEditablePopup}
            style={popupCoords}
            className="message-actions text-sm bg-white text-slate-800 rounded-lg border border-slate-200 shadow-md mb-1 flex items-center justify-center z-10 flex-col overflow-hidden"
          >
            {isText && (
              <button
                className="w-full hover:bg-indigo-500/30 transition duration-150 p-3 pb-2 flex"
                type="button"
                onClick={handleEditClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-edit mr-1"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="rgb(30, 41, 59)"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                  <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                  <path d="M16 5l3 3" />
                </svg>

                <span>Edit</span>
              </button>
            )}
            <button
              className="w-full hover:bg-indigo-500/30 transition duration-150 p-3 pt-2 flex"
              type="button"
              onClick={handleDeleteClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-trash mr-1"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="rgb(30, 41, 59)"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 7l16 0" />
                <path d="M10 11l0 6" />
                <path d="M14 11l0 6" />
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
              </svg>

              <span>Delete</span>
            </button>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
