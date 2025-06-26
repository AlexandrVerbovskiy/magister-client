import Link from "next/link";
import { getFilePath } from "../../../utils";
import LinkIcon from "../Icons/LinkIcon";
import ActiveSpan from "../Disputes/ActiveSpan";
import STATIC from "../../../static";
import { useState } from "react";
import Transition from "../../../utils/transition";

const SubChatSelect = ({
  selectedChat,
  selectedChatId,
  onSelectSubChat,
  renter,
  owner,
  align = "right",
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative inline-flex md:hidden border-x border-slate-200 ">
      <button
        className="inline-flex justify-center items-center group "
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        {selectedChat.id == selectedChatId && (
          <div
            className={`flex items-center h-full px-4 sm:px-6 md:px-5 bg-white`}
          >
            <img
              className="rounded-full border-2 border-white dark:border-slate-800 box-content mr-1"
              src={getFilePath(renter.photo)}
              width="32"
              height="32"
              style={{ width: "32px", height: "32px" }}
            />

            <img
              className="rounded-full border-2 border-white dark:border-slate-800 box-content mr-1 -ml-4"
              src={getFilePath(owner.photo)}
              width="32"
              height="32"
              style={{ width: "32px", height: "32px" }}
            />

            <div className="truncate">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                Inner Chat
              </span>
            </div>
          </div>
        )}

        {selectedChat.renterChatId == selectedChatId && (
          <div
            className={`flex items-center h-full px-4 sm:px-6 md:px-5 bg-white`}
            href={"/admin/users/edit/" + renter.id}
            onClick={() => onSelectSubChat(selectedChat.renterChatId)}
          >
            <img
              className="rounded-full border-2 border-white dark:border-slate-800 box-content mr-1"
              src={getFilePath(renter.photo)}
              width="32"
              height="32"
              style={{ width: "32px", height: "32px" }}
            />

            <div className="truncate">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {renter.name}
              </span>
            </div>
          </div>
        )}

        {selectedChat.ownerChatId == selectedChatId && (
          <div
            className={`flex items-center h-full px-4 sm:px-6 md:px-5 bg-white`}
            href={"/admin/users/edit/" + owner.id}
            onClick={() => onSelectSubChat(selectedChat.ownerChatId)}
          >
            <img
              className="rounded-full border-2 border-white dark:border-slate-800 box-content mr-1"
              src={getFilePath(owner.photo)}
              width="32"
              height="32"
              style={{ width: "32px", height: "32px" }}
            />

            <div className="truncate">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {owner.name}
              </span>
            </div>
          </div>
        )}

        <svg
          className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 mr-4 sm:mr-6 md:mr-5"
          viewBox="0 0 12 12"
        >
          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
        </svg>
      </button>

      <Transition
        className={`w-full origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-slate-800 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="mb-1">
            <button
              type="button"
              className={`flex items-center h-full px-4 sm:px-6 md:px-5 w-full`}
              onClick={() => {
                onSelectSubChat(selectedChat.id);
                setDropdownOpen(false);
              }}
            >
              <img
                className="rounded-full border-2 border-white dark:border-slate-800 box-content mr-1"
                src={getFilePath(renter.photo)}
                width="32"
                height="32"
                style={{ width: "32px", height: "32px" }}
              />

              <img
                className="rounded-full border-2 border-white dark:border-slate-800 box-content mr-1 -ml-4"
                src={getFilePath(owner.photo)}
                width="32"
                height="32"
                style={{ width: "32px", height: "32px" }}
              />

              <div className="truncate">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  Inner Chat
                </span>
              </div>
            </button>

            <button
              key={renter.id}
              type="button"
              className={`flex items-center h-full px-4 sm:px-6 md:px-5 w-full`}
              onClick={() => {
                onSelectSubChat(selectedChat.renterChatId);
                setDropdownOpen(false);
              }}
            >
              <img
                className="rounded-full border-2 border-white dark:border-slate-800 box-content mr-1"
                src={getFilePath(renter.photo)}
                width="32"
                height="32"
                style={{ width: "32px", height: "32px" }}
              />

              <div className="truncate">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {renter.name}
                </span>
              </div>
            </button>

            <button
              key={owner.id}
              type="button"
              className={`flex items-center h-full px-4 sm:px-6 md:px-5 w-full`}
              onClick={() => {
                onSelectSubChat(selectedChat.ownerChatId);
                setDropdownOpen(false);
              }}
            >
              <img
                className="rounded-full border-2 border-white dark:border-slate-800 box-content mr-1"
                src={getFilePath(owner.photo)}
                width="32"
                height="32"
                style={{ width: "32px", height: "32px" }}
              />

              <div className="truncate">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {owner.name}
                </span>
              </div>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
};

const HeaderTab = ({ user, chatId, selectedChatId, onSelectSubChat }) => {
  return (
    <button
      key={user.id}
      type="button"
      className={`flex items-center border-r border-slate-200 h-full px-2 ${
        chatId == selectedChatId ? "bg-slate-100" : "bg-white"
      }`}
      href={"/admin/users/edit/" + user.id}
      style={{ width: "200px" }}
      onClick={() => onSelectSubChat(chatId)}
    >
      <img
        className="rounded-full border-2 border-white dark:border-slate-800 box-content mr-1"
        src={getFilePath(user.photo)}
        width="32"
        height="32"
        style={{ width: "32px", height: "32px" }}
      />

      <div className="truncate">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
          {user.name}
        </span>
      </div>
    </button>
  );
};

const ChatHeader = ({
  order,
  dispute,
  selectedChat,
  selectedChatId,
  onSelectSubChat,
  activateUnsolvePopup,
  activateSolvePopup,
  statusPopupActive,
  setStatusPopupActive,
  showChatListWindow,
}) => {
  const renter = {
    id: order.renterId,
    name: order.renterName,
    photo: order.renterPhoto,
  };

  const owner = {
    id: order.ownerId,
    name: order.ownerName,
    photo: order.ownerPhoto,
  };

  return (
    <div className="sticky top-0 z-10">
      <div className="flex items-center justify-between bg-white border-b border-slate-200 px-4 sm:px-6 md:px-5 h-12">
        <div className="flex items-center w-full">
          <button
            className="md:hidden text-slate-400 hover:text-slate-500 mr-4"
            onClick={() => showChatListWindow()}
            aria-controls="messages-sidebar"
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>

          <div className="flex -space-x-3 -ml-px justify-between w-full">
            <Link
              href={`/admin/orders/${selectedChat.orderId}/`}
              className="font-semibold flex items-center"
              style={{ color: "var(--mainColor)" }}
            >
              Issue #{selectedChat.disputeId}
              <LinkIcon color="var(--mainColor)" />
            </Link>

            <SubChatSelect
              selectedChat={selectedChat}
              selectedChatId={selectedChatId}
              onSelectSubChat={onSelectSubChat}
              renter={renter}
              owner={owner}
            />

            <div>
              <ActiveSpan
                status={selectedChat.disputeStatus}
                needToolTip={false}
                onClick={() => setStatusPopupActive(true)}
              />

              <div
                className={`right-0 table-change-role-popup bg-white dark:bg-slate-800 shadow-lg rounded-sm px-2 py-1 ${
                  statusPopupActive ? "active" : ""
                }`}
              >
                {selectedChat.disputeStatus !=
                  STATIC.DISPUTE_STATUSES.SOLVED && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      activateSolvePopup();
                    }}
                    className="text-xs inline-flex font-medium bg-emerald-100 text-emerald-500 rounded-full text-center px-2.5 py-1 cursor-pointer"
                  >
                    Solve
                  </button>
                )}

                {selectedChat.disputeStatus ===
                  STATIC.DISPUTE_STATUSES.OPEN && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      activateUnsolvePopup();
                    }}
                    className="text-xs inline-flex font-medium bg-rose-100 text-rose-500 rounded-full text-center px-2.5 py-1 cursor-pointer"
                  >
                    Unsolve
                  </button>
                )}
              </div>

              {statusPopupActive && (
                <div
                  className="hidden-popup"
                  onClick={() => setStatusPopupActive(false)}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex items-center justify-between border-b border-slate-200 h-12 bg-white">
        <div className="flex items-center h-full">
          <div className="flex h-full ">
            <button
              type="button"
              className={`flex items-center border-r border-slate-200 h-full px-4 sm:px-6 md:px-5 ${
                selectedChat.id == selectedChatId ? "bg-slate-100" : "bg-white"
              }`}
              style={{ width: "240px" }}
              onClick={() => onSelectSubChat(selectedChat.id)}
            >
              <img
                className="rounded-full border-2 border-white dark:border-slate-800 box-content mr-1"
                src={getFilePath(renter.photo)}
                width="32"
                height="32"
                style={{ width: "32px", height: "32px" }}
              />

              <img
                className="rounded-full border-2 border-white dark:border-slate-800 box-content mr-1 -ml-4"
                src={getFilePath(owner.photo)}
                width="32"
                height="32"
                style={{ width: "32px", height: "32px" }}
              />

              <div className="truncate">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  Inner Chat
                </span>
              </div>
            </button>
            <HeaderTab
              user={renter}
              chatId={selectedChat.renterChatId}
              selectedChatId={selectedChatId}
              onSelectSubChat={onSelectSubChat}
            />
            <HeaderTab
              user={owner}
              chatId={selectedChat.ownerChatId}
              selectedChatId={selectedChatId}
              onSelectSubChat={onSelectSubChat}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
