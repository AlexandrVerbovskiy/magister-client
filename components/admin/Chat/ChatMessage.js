import { useContext, useRef } from "react";
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
}) => {
  const { sessionUser } = useContext(IndiceContext);
  const isAuthor = senderId == sessionUser?.id || adminSend;
  const messageClassName = isAuthor
    ? "text-sm bg-indigo-500 text-white p-3 rounded-lg rounded-tl-none border border-transparent shadow-md mb-1"
    : "text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-md mb-1";

  const messageRef = useRef(null);
  const messageParentRef = useRef(null);

  const {
    activePopup,
    popupCoords,
    isTemp,
    isText,
    isManuallySent,
    closePopup,
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
    popupMarginRight: 21.28,
    popupMarginBottom: 15,
  });

  return (
    <div
      id={`message-${id}`}
      className="flex items-start mb-4 last:mb-0"
      ref={messageParentRef}
    >
      <img
        className="rounded-full mr-4"
        src={
          senderPhoto
            ? generateProfileFilePath(senderPhoto)
            : STATIC.ADMIN_CHAT_LOGO
        }
        width="40"
        height="40"
        alt="User photo"
        style={{ width: "40px", height: "40px" }}
      />
      <div ref={messageRef}>
        <ChatMessageContent
          order={order}
          dispute={dispute}
          isTemp={isTemp}
          type={type}
          content={content}
          messageClassName={messageClassName}
        />

        {isTemp ? (
          <div className="flex items-center justify-between cursor-pointer">
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
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              {formatTimeWithAmPm(createdAt)}
            </div>
          </div>
        )}

        {!isTemp && isAuthor && isManuallySent && (
          <DropdownMenu
            activePopup={activePopup}
            closePopup={closePopup}
            style={popupCoords}
            className=""
          >
            {isText && (
              <button type="button" onClick={handleEditClick}>
                Edit
              </button>
            )}
            <button type="button" onClick={handleDeleteClick}>
              Delete
            </button>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
