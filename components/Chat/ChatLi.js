import { generateProfileFilePath } from "../../utils";
import OnlineStatus from "./OnlineStatus";

const ChatLi = ({ chat, selected, onClick }) => {
  return (
    <li
      className={`cursor-pointer${selected ? " selected" : ""}`}
      onClick={onClick}
    >
      <div className="d-flex align-items-center">
        <div className="avatar me-2">
          <img
            src={generateProfileFilePath(chat.opponentPhoto)}
            width="50"
            height="50"
            className="rounded-circle"
            alt="image"
          />
          <OnlineStatus online={chat.opponentOnline} />
        </div>

        <div className="user-name row-dots-end">
          <h6 className="row-dots-end">{chat.opponentName}</h6>
          <span className="d-block row-dots-end no-wrap">{chat.name}</span>
        </div>
      </div>
    </li>
  );
};

export default ChatLi;
