import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { formatTimeWithAmPm, generateProfileFilePath } from "../../utils";
import MessageContent from "./MessageContent";

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
  const chatClassName = `chat${
    senderId == sessionUser?.id ? "" : " chat-left"
  }`;

  const isTemp = !!tempKey;
  const isNotText = type != "text";

  return (
    <div className={chatClassName}>
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
        <div className="chat-message">
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
              {isNotText && (
                <>
                  {Number(percent).toFixed(2)}%
                  <i
                    className="bx bx-x"
                    style={{ fontSize: "18px" }}
                  ></i>
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
    </div>
  );
};

export default MessageLi;
