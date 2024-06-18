import { generateProfileFilePath } from "../../utils";

const ChatLi = ({ chat }) => {
  return (
    <li>
      <div className="d-flex align-items-center">
        <div className="avatar me-2">
          <img
            src={generateProfileFilePath(chat.userPhoto)}
            width="50"
            height="50"
            className="rounded-circle"
            alt="image"
          />
          {chat.userOnline ? (
            <span className="status-online"></span>
          ) : (
            <span className="status-busy"></span>
          )}
        </div>

        <div className="user-name row-dots-end">
          <h6 className="row-dots-end">{chat.userName}</h6>
          <span className="d-block row-dots-end no-wrap">{chat.name}</span>
        </div>
      </div>
    </li>
  );
};

export default ChatLi;
