import ChatLi from "./ChatLi";
import SearchHeader from "./SearchHeader";

const LeftSidebar = ({
  type,
  chats,
  handleChangeType,
  filter,
  setFilter,
  canShowMore,
}) => {
  return (
    <div className="sidebar-left">
      <div className="sidebar">
        <SearchHeader filter={filter} setFilter={setFilter} />

        <div className="sidebar-content d-flex chat-sidebar" data-simplebar>
          <div className="chat-menu w-100">
            <div className="d-flex">
              <label
                className={`d-block w-50 list-group-label mt-0 ${
                  type == "orders" ? "active" : ""
                }`}
                onClick={() => handleChangeType("orders")}
              >
                Orders
              </label>
              <label
                className={`d-block w-50 list-group-label mt-0 ms-4 ${
                  type == "disputes" ? "active" : ""
                }`}
                onClick={() => handleChangeType("disputes")}
              >
                Disputes
              </label>
            </div>

            <ul className="list-group list-group-user list-unstyled mb-0">
              {chats.map((chat) => (
                <ChatLi chat={chat} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
