import { generateProfileFilePath, getFilePath } from "../../../utils";

const InboxSidebar = ({
  msgSidebarOpen,
  setMsgSidebarOpen,
  selectedChat,
  chats,
  handleSelectChat,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div
      id="messages-sidebar"
      className={`absolute z-20 top-0 bottom-0 w-full md:w-auto md:static md:top-auto md:bottom-auto -mr-px md:translate-x-0 transition-transform duration-200 ease-in-out ${
        msgSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="sticky top-16 bg-white dark:bg-slate-900 overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-r border-slate-200 dark:border-slate-700 md:w-72 xl:w-80 h-[calc(100dvh-64px)]">
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
          <div className="mt-4">
            <ul className="mb-6">
              {chats.map((chat) => (
                <li key={chat.id} className="-mx-2">
                  <button
                    className={`flex items-center justify-between w-full p-2 rounded ${
                      selectedChat?.id == chat.id
                        ? "bg-indigo-500/30"
                        : "border-b border-slate-300"
                    }`}
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    <div className="flex items-center truncate">
                      <div className="flex -space-x-3 -ml-px mr-2">
                        <a className="block" href="#0">
                          <img
                            className="rounded-full border-2 border-white dark:border-slate-800 box-content"
                            src={generateProfileFilePath(chat.tenantPhoto)}
                            width="32"
                            height="32"
                            alt={chat.tenantName}
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
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboxSidebar;
