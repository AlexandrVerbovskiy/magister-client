import ChatLi from "./ChatLi";
import SearchHeader from "./SearchHeader";

const LeftSidebar = ({
  type,
  chats,
  handleChangeType,
  filter,
  setFilter,
  canShowMore,
  setChatWindow,
  handleShowMore,
}) => {
  const emptyListMessage =
    type == "orders"
      ? "You don't have any order chats yet"
      : "You don't have any dispute chats yet";

  return (
    <div className="sidebar-left h-100">
      <div className="sidebar h-100">
        <SearchHeader filter={filter} setFilter={setFilter} />

        <div className="sidebar-content d-flex chat-sidebar" data-simplebar>
          <div className="chat-menu w-100">
            <div className="d-flex">
              <label
                className={`d-block w-50 list-group-label mt-0 ${
                  type == "orders" ? "active" : ""
                }`}
                onClick={() => {
                  handleChangeType("orders");
                  setChatWindow();
                }}
              >
                Orders
              </label>
              <label
                className={`d-block w-50 list-group-label mt-0 ms-4 ${
                  type == "disputes" ? "active" : ""
                }`}
                onClick={() => {
                  handleChangeType("disputes");
                  setChatWindow();
                }}
              >
                Disputes
              </label>
            </div>

            {chats.length > 0 ? (
              <>
                <ul className="list-group list-group-user list-unstyled mb-0">
                  {chats.map((chat) => (
                    <ChatLi key={chat.id} chat={chat} />
                  ))}
                </ul>

                {canShowMore && (
                  <div
                    className="d-flex align-items-center justify-content-center cursor-pointer mt-1"
                    style={{ color: "#71738d" }}
                    onClick={handleShowMore}
                  >
                    Show more
                  </div>
                )}
              </>
            ) : (
              <div className="badge badge-pill badge-light mb-3 gray empty-chat-list">
                {emptyListMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
