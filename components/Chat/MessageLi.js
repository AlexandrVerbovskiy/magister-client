import { useContext, useRef, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  formatTimeWithAmPm,
  generateProfileFilePath,
  getRelativeCoordinates,
} from "../../utils";
import MessageContent from "./MessageContent";
import DropdownMenu from "../_App/DropdownMenu";
import STATIC from "../../static";
import useMessage from "../../hooks/useMessage";

const MessageLi = ({
  id,
  tempKey = null,
  type,
  content,
  senderPhoto = null,
  createdAt,
  senderId,
  percent = 0,
  stopSendMediaMessage,
  handleChangeUpdatingMessageId,
  handleDeleteMessage,
  chatId,
  entity,
  popupsData = null,
  adminSend,
  needUserPhoto,
  extensionPopupsData = null,
}) => {
  const { sessionUser } = useContext(IndiceContext);
  const isAuthor = senderId == sessionUser?.id;
  const chatClassName = `chat dropdown${isAuthor ? "" : " chat-left"}`;
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
    messageRef,
    messageParentRef,
    popupMarginRight: 21.28,
    popupMarginBottom: 15,
  });

  return (
    <div id={`message-${id}`} className={chatClassName} ref={messageParentRef}>
      <div className="chat-avatar">
        <a className="d-inline-block">
          <img
            src={
              adminSend
                ? STATIC.DEFAULTS.ADMIN_CHAT_LOGO
                : generateProfileFilePath(senderPhoto)
            }
            width="40"
            height="40"
            className="rounded-circle"
            alt="User photo"
            style={{ width: "40px", height: "40px" }}
          />
        </a>
      </div>

      <div className="chat-body">
        <div
          className="chat-message"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          onContextMenu={handleActivateEditPopup}
          ref={messageRef}
        >
          <MessageContent
            entity={entity}
            isTemp={isTemp}
            type={type}
            content={content}
            popupsData={popupsData}
            senderId={senderId}
            extensionPopupsData={extensionPopupsData}
          />

          {isTemp ? (
            <span
              className="time d-flex cursor-pointer"
              onClick={() => stopSendMediaMessage(tempKey)}
            >
              <i
                className="lni lni-alarm-clock"
                style={{ marginRight: "2px" }}
              ></i>
              {!isText && (
                <>
                  {Number(percent).toFixed(2)}%
                  <i className="bx bx-x" style={{ fontSize: "18px" }}></i>
                </>
              )}
            </span>
          ) : (
            <span className="time d-block">
              {formatTimeWithAmPm(createdAt)}
            </span>
          )}
        </div>
      </div>

      {!isTemp && isAuthor && isManuallySent && (
        <DropdownMenu
          activePopup={activePopup}
          closePopup={closePopup}
          style={popupCoords}
        >
          {isText && (
            <button
              type="button"
              className="dropdown-item d-flex align-items-center"
              onClick={handleEditClick}
            >
              <i className="bx bxs-pen"></i> Edit
            </button>
          )}
          <button
            type="button"
            className="dropdown-item d-flex align-items-center"
            onClick={handleDeleteClick}
          >
            <i className="bx bxs-trash"></i> Delete
          </button>
        </DropdownMenu>
      )}
    </div>
  );
};

export default MessageLi;
