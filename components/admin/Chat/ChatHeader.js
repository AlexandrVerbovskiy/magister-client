import Link from "next/link";
import { getFilePath } from "../../../utils";
import LinkIcon from "../Icons/LinkIcon";
import ActiveSpan from "../Disputes/ActiveSpan";

const ChatHeader = ({
  msgSidebarOpen,
  setMsgSidebarOpen,
  order,
  dispute,
  selectedChat,
}) => {
  const tenant = {
    id: order.tenantId,
    name: order.tenantName,
    photo: order.tenantPhoto,
  };

  const owner = {
    id: order.ownerId,
    name: order.ownerName,
    photo: order.ownerPhoto,
  };

  return (
    <div className="sticky top-16 z-10">
      <div className="flex items-center justify-between bg-white border-b border-slate-200 px-4 sm:px-6 md:px-5 h-12">
        <div className="flex items-center w-full">
          <button
            className="md:hidden text-slate-400 hover:text-slate-500 mr-4"
            onClick={() => setMsgSidebarOpen(!msgSidebarOpen)}
            aria-controls="messages-sidebar"
            aria-expanded={msgSidebarOpen}
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
              href={"/admin/disputes/" + selectedChat.disputeId}
              className="font-semibold flex items-center"
              style={{ color: "var(--mainColor)" }}
            >
              Issus #{selectedChat.disputeId}
              <LinkIcon color="var(--mainColor)" />
            </Link>

            <ActiveSpan
              status={selectedChat.disputeStatus}
              needToolTip={false}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-b border-slate-200 h-12 bg-white">
        <div className="flex items-center h-full">
          <div className="flex h-full ">
            <a
              className="flex items-center border-r border-slate-200 h-full px-4 sm:px-6 md:px-5 bg-slate-100"
              style={{ width: "240px" }}
            >
              <img
                className="rounded-full border-2 border-white dark:border-slate-800 box-content mr-1"
                src={getFilePath(tenant.photo)}
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
            </a>
            {[tenant, owner].map((user) => (
              <a
                key={user.id}
                className="flex items-center border-r border-slate-200 h-full px-2 bg-white"
                href={"/admin/users/edit/" + user.id}
                style={{ width: "200px" }}
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
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
