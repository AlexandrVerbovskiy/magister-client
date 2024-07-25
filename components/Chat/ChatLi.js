import { generateProfileFilePath } from "../../utils";
import OnlineStatus from "./OnlineStatus";
import STATIC from "../../static";

const ChatLi = ({ chat, selected, onClick }) => {
  const isOrder = chat.entityType == STATIC.CHAT_TYPES.ORDER;

  return (
    <li
      className={`cursor-pointer${selected ? " selected" : ""}`}
      onClick={onClick}
      id={`chat-${chat.id}`}
    >
      <div className="d-flex align-items-center">
        <div className="avatar me-2">
          <img
            src={
              isOrder
                ? generateProfileFilePath(chat.opponentPhoto)
                : STATIC.DEFAULTS.ADMIN_CHAT_LOGO
            }
            width="40"
            height="40"
            className="rounded-circle"
            alt="image"
            style={{ width: "40px", height: "40px" }}
          />
          {isOrder && <OnlineStatus online={chat.opponentOnline} />}
        </div>

        <div className="w-100 user-name row-dots-end">
          <h6 className="row-dots-end">
            {isOrder ? chat.opponentName : "SUPPORT"}
          </h6>
          <span className="d-block row-dots-end no-wrap">{chat.name}</span>
        </div>
      </div>
    </li>
  );
};

export default ChatLi;
