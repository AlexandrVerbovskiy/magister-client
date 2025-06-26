import { useEffect, useState } from "react";
import { generateProfileFilePath } from "../../../utils";
import SmallLoader from "../SmallLoader";

const ChatLi = ({ selectedChat, chat, handleSelectChat }) => {
  return (
    <li className="-mx-2" id={`chat-${chat.id}`}>
      <button
        className={`flex items-center justify-between w-full p-2 rounded ${
          selectedChat?.id == chat.id
            ? "bg-teal-500/30"
            : "border-b border-slate-300"
        }`}
        onClick={() => handleSelectChat(chat.id)}
      >
        <div className="flex items-center truncate">
          <div className="flex -space-x-3 -ml-px mr-2">
            <a className="block" href="#0">
              <img
                className="rounded-full border-2 border-white dark:border-slate-800 box-content"
                src={generateProfileFilePath(chat.renterPhoto)}
                width="32"
                height="32"
                alt={chat.renterName}
                style={{ width: "32px", height: "32px" }}
              />
            </a>
            <a className="block" href="#0">
              <img
                className="rounded-full border-2 border-white dark:border-slate-800 box-content"
                src={generateProfileFilePath(chat.ownerPhoto)}
                width="32"
                height="32"
                alt={chat.ownerName}
                style={{ width: "32px", height: "32px" }}
              />
            </a>
          </div>

          <div className="truncate">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
              Issue #{chat.disputeId}
            </span>
          </div>
        </div>
      </button>
    </li>
  );
};

const InboxSidebar = ({
  selectedChat,
  chats,
  handleSelectChat,
  filter,
  setFilter,
  loading,
  filterChats,
  canShowMore,
  handleShowMore,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

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
    <div
      id="messages-sidebar"
      className={`w-full md:w-96 md:static md:top-auto md:bottom-auto -mr-px md:translate-x-0 transition-transform duration-200 ease-in-out`}
    >
      <div className="sticky top-0 bg-white dark:bg-slate-900 overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-r border-slate-200 dark:border-slate-700 h-[calc(100dvh-64px)]">
        <div className="px-5 py-4">
          <form className="relative -mx-2" onSubmit={handleSubmit}>
            <label htmlFor="msg-search" className="sr-only">
              Search
            </label>
            <input
              id="msg-search"
              className="form-input w-full pl-9 bg-white dark:bg-slate-800"
              type="search"
              placeholder="Search…"
              value={filter}
              onInput={(e) => setFilter(e.target.value)}
            />
            <button
              className="absolute inset-0 right-auto group"
              type="submit"
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 shrink-0 fill-current text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 ml-3 mr-2"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
              </svg>
            </button>
          </form>
          <div className="mt-2 md:mt-4">
            {loading && <SmallLoader />}

            {!loading && filter.length > 0 && (
              <>
                {filterChats.length > 0 ? (
                  <ul className="list-group list-group-user list-unstyled mb-0">
                    {filterChats.map((chat) => (
                      <ChatLi
                        key={chat.id}
                        selectedChat={selectedChat}
                        chat={chat}
                        handleSelectChat={handleSelectChat}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="w-full flex justify-center">
                    <div className="bg-gray-100 text-gray-600 rounded-full px-4 py-2 mb-3 text-sm">
                      No chat found
                    </div>
                  </div>
                )}
              </>
            )}

            {!loading && filter.length < 1 && (
              <>
                {chats.length > 0 ? (
                  <ul className="mb-6">
                    {chats.map((chat) => (
                      <ChatLi
                        key={chat.id}
                        selectedChat={selectedChat}
                        chat={chat}
                        handleSelectChat={handleSelectChat}
                      />
                    ))}
                    <li className="-mx-2">
                      {canShowMore && (
                        <div
                          className="transition text-teal-400 hover:text-teal-600 flex items-center justify-center cursor-pointer py-2 chat-list-show-more text-sm"
                          onClick={handleShowMoreClick}
                        >
                          Show more
                        </div>
                      )}
                    </li>
                  </ul>
                ) : (
                  <div
                    className="flex items-center justify-center w-full"
                    style={{
                      position: "absolute",
                      top: "50%",
                      transform: "translate(0, -50%)",
                      marginLeft:"-1.25rem"
                    }}
                  >
                    <div className="text-center w-fit inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-teal-500 text-white duration-150 ease-in-out">
                      No chat has been created yet
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

export default InboxSidebar;
