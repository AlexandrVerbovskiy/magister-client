import { useState } from "react";
import { generateProfileFilePath } from "../../utils";
import OnlineStatus from "./OnlineStatus";
import DropdownMenu from "../_App/DropdownMenu";
import OrderHeaderActions from "./OrderHeaderActions";
import DisputeHeaderActions from "./DisputeHeaderActions";
import STATIC from "../../static";

const DisputeChatHeader = ({ entity, handleGoBackClick }) => {
  const [activePopup, setActivePopup] = useState(false);

  return (
    <div className="chat-list-header d-flex align-items-center">
      <div className="chat-toggle-btn" onClick={handleGoBackClick}>
        <div>
          <i className="bx bx-menu-alt-left" />
        </div>
      </div>
      <div className="header-left d-flex align-items-center me-2 w-100 row-dots-end">
        <div className="avatar me-2">
          <img
            src={STATIC.DEFAULTS.ADMIN_CHAT_LOGO}
            width="40"
            height="40"
            className="rounded-circle"
            alt="image"
            style={{ width: "40px", height: "40px" }}
          />
        </div>
        <h6 className="mb-0 row-dots-end">RENT ABOUT SUPPORT CHAT</h6>
      </div>
      <div className="header-right text-right">
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
                entity={entity}
                activePopup={activePopup}
                closePopup={() => setActivePopup(false)}
              >
                {entity.type == STATIC.CHAT_TYPES.DISPUTE && (
                  <DisputeHeaderActions dispute={entity} />
                )}
              </DropdownMenu>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DisputeChatHeader;
