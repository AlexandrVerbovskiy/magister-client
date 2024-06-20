import { useState } from "react";
import { generateProfileFilePath } from "../../utils";
import OnlineStatus from "./OnlineStatus";
import DropdownMenu from "./DropdownMenu";

const ChatHeader = ({
  opponentName,
  opponentOnline,
  opponentPhoto,
  handleGoBackClick,
}) => {
  const [activePopup, setActivePopup] = useState(false);

  return (
    <div className="chat-list-header d-flex align-items-center">
      <div className="chat-toggle-btn" onClick={handleGoBackClick}>
        <div>
          <i className="bx bx-menu-alt-left" />
        </div>
      </div>
      <div className="header-left d-flex align-items-center me-2">
        <div className="avatar me-2">
          <img
            src={generateProfileFilePath(opponentPhoto)}
            width="70"
            height="70"
            className="rounded-circle"
            alt="image"
          />
          <OnlineStatus online={opponentOnline} />
        </div>
        <h6 className="mb-0">{opponentName}</h6>
      </div>
      <div className="header-right text-right w-100">
        <ul className="list-unstyled mb-0">
          <li>
            <div className="dropdown">
              <button
                className="dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePopup(true);
                }}
              >
                <i className="bx bx-dots-vertical-rounded"></i>
              </button>

              <DropdownMenu
                activePopup={activePopup}
                closePopup={() => setActivePopup(false)}
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatHeader;
