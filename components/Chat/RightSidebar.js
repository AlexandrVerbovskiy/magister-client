import ChatHeader from "./ChatHeader";
import DateLi from "./DateLi";
import SenderPanel from "./SenderPanel";

const RightSidebar = ({ chat, messages, setListWindow }) => {
  if (!chat) {
    return (
      <div className="content-right h-100">
        <div className="chat-area h-100">
          <div className="chat-list-wrapper h-100">
            <div className="chat-list h-100">
              <div className="chat-container h-100">
                <div className="chat-content  w-100 h-100 d-flex justify-content-center align-items-center">
                  <div className="badge badge-pill badge-light my-3 main">
                    Select a chat to start messaging
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-right">
      <div className="chat-area">
        <div className="chat-list-wrapper">
          <div className="chat-list">
            <ChatHeader handleGoBackClick={setListWindow} />

            <div className="chat-container" data-simplebar>
              <div className="chat-content">
                <DateLi date={new Date()} />
              </div>
            </div>

            <div className="chat-list-footer">
              <SenderPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
