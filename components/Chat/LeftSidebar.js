import SmallLoader from "../_App/SmallLoader";
import ChatLi from "./ChatLi";
import SearchHeader from "./SearchHeader";
import STATIC from "../../static";
import { useEffect, useState } from "react";

const LeftSidebar = ({
  loading,
  type,
  chats,
  handleChangeType,
  filter,
  setFilter,
  canShowMore,
  setChatWindow,
  handleShowMore,
  selectedChat,
  handleSelectChat,
  filterChats,
}) => {
  const emptyListMessage =
    type == STATIC.CHAT_TYPES.DISPUTE
      ? "You don't have any dispute chats yet"
      : "You don't have any order chats yet";

  const [lastShowedChatId, setLastShowedChatId] = useState(null);

  useEffect(() => {
    if (lastShowedChatId) {
      setTimeout(() => {
        const lastChat = document.querySelector("#chat-" + lastShowedChatId);

        if (lastChat) {
          lastChat.scrollIntoView({ behavior: "instant", block: "end" });
        }
      }, 0);

      setLastShowedChatId(null);
    }
  }, [JSON.stringify(chats)]);

  const handleShowMoreClick = () => {
    setLastShowedChatId(chats[chats.length - 1].id);
    handleShowMore();
  };

  return (
    <div className="sidebar-left h-100">
      <div className="sidebar h-100">
        <SearchHeader filter={filter} setFilter={setFilter} />

        <div className="sidebar-content d-flex chat-sidebar" data-simplebar>
          <div className="chat-menu w-100">
            <div className="d-flex">
              <label
                className={`d-block w-50 list-group-label mt-0 ${
                  type == STATIC.CHAT_TYPES.ORDER ? "active" : ""
                }`}
                onClick={() => handleChangeType(STATIC.CHAT_TYPES.ORDER)}
              >
                Orders
              </label>
              <label
                className={`d-block w-50 list-group-label mt-0 ms-4 ${
                  type == STATIC.CHAT_TYPES.DISPUTE ? "active" : ""
                }`}
                onClick={() => handleChangeType(STATIC.CHAT_TYPES.DISPUTE)}
              >
                Disputes
              </label>
            </div>

            {loading && <SmallLoader />}

            {!loading && filter.length > 0 && (
              <>
                {filterChats.length > 0 ? (
                  <ul className="list-group list-group-user list-unstyled mb-0">
                    {filterChats.map((chat) => (
                      <ChatLi
                        key={chat.id}
                        chat={chat}
                        selected={selectedChat?.id == chat.id}
                        onClick={() => {
                          handleSelectChat(chat.id);
                          setChatWindow();
                        }}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="w-100 d-flex justify-content-center">
                    <div className="badge badge-pill badge-light mb-3 gray empty-chat-list">
                      No chat found
                    </div>
                  </div>
                )}
              </>
            )}

            {!loading && filter.length < 1 && (
              <>
                {chats.length > 0 ? (
                  <>
                    <ul className="list-group list-group-user list-unstyled mb-0">
                      {chats.map((chat) => (
                        <ChatLi
                          key={chat.id}
                          chat={chat}
                          selected={selectedChat?.id == chat.id}
                          onClick={() => {
                            handleSelectChat(chat.id);
                            setChatWindow();
                          }}
                        />
                      ))}
                    </ul>

                    {canShowMore && (
                      <div
                        className="d-flex align-items-center justify-content-center cursor-pointer chat-list-show-more"
                        onClick={handleShowMoreClick}
                      >
                        Show more
                      </div>
                    )}
                    <div className="left-sidebar-bottom"></div>
                  </>
                ) : (
                  <div className="w-100 d-flex justify-content-center">
                    <div className="badge badge-pill badge-light mb-3 gray empty-chat-list">
                      {emptyListMessage}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
