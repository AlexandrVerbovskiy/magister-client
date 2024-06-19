import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { formatTimeWithAmPm, generateProfileFilePath } from "../../utils";
import MessageContent from "./MessageContent";

const MessageLi = ({ type, content, userPhoto, createdAt, userId }) => {
  const { sessionUser } = useContext(IndiceContext);
  const chatClassName = `chat${
    userId == sessionUser?.userId ? " chat-left" : ""
  }`;

  return (
    <div className={chatClassName}>
      <div className="chat-avatar">
        <a className="d-inline-block">
          <img
            src={generateProfileFilePath(userPhoto)}
            width="50"
            height="50"
            className="rounded-circle"
            alt="image"
          />
        </a>
      </div>

      <div className="chat-body">
        <div className="chat-message">
          <MessageContent type={type} content={content} />
          <span className="time d-block">{formatTimeWithAmPm(createdAt)}</span>
        </div>
      </div>
    </div>
  );
  return;
};

export default MessageLi;
