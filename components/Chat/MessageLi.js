import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  formatTimeWithAmPm,
  generateProfileFilePath,
  getRelativeCoordinates,
} from "../../utils";
import MessageContent from "./MessageContent";
import DropdownMenu from "../_App/DropdownMenu";

const MessageLi = ({
  id,
  tempKey = null,
  type,
  content,
  senderPhoto,
  createdAt,
  senderId,
  percent = 0,
  stopSendMediaMessage,
}) => {
  const { sessionUser } = useContext(IndiceContext);
  const [activePopup, setActivePopup] = useState(false);
  const [popupCoords, setPopupCoords] = useState({ bottom: 0, left: 0 });

  const isAuthor = senderId == sessionUser?.id;

  const chatClassName = `chat dropdown${isAuthor ? "" : " chat-left"}`;

  const isTemp = !!tempKey;
  const isText = type == "text";

  const isManuallySent = ["text", "image", "file", "video", "audio"].includes(
    type
  );

  const handleActivateEditPopup = (e) => {
    if (!isAuthor) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    const parent = document.querySelector(`#message-${id}`);

    let chatMessage = e.target;

    if (!chatMessage.classList.contains("chat-message")) {
      chatMessage = chatMessage.closest(".chat-message");
    }

    if (!chatMessage) {
      return;
    }

    const messageCoords = getRelativeCoordinates(chatMessage, parent);
    const popupRight = messageCoords.right - 21.28;

    setPopupCoords({
      bottom: "15px",
      right: popupRight + "px",
      transform: "translate(-100%, 100%)",
    });

    setActivePopup(true);
  };

  return (
    <div id={`message-${id}`} className={chatClassName}>
      <div className="chat-avatar">
        <a className="d-inline-block">
          <img
            src={generateProfileFilePath(senderPhoto)}
            width="50"
            height="50"
            className="rounded-circle"
            alt="image"
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
        >
          <MessageContent isTemp={isTemp} type={type} content={content} />

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

      {isAuthor && isManuallySent && (
        <DropdownMenu
          activePopup={activePopup}
          closePopup={() => setActivePopup(false)}
          style={popupCoords}
        >
          {isText && (
            <button className="dropdown-item d-flex align-items-center">
              <i className="bx bxs-pen"></i> Edit
            </button>
          )}
          <button className="dropdown-item d-flex align-items-center">
            <i className="bx bxs-trash"></i> Delete
          </button>
        </DropdownMenu>
      )}
    </div>
  );
};

export default MessageLi;
