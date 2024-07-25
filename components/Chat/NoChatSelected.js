const NoChatSelected = () => {
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
};

export default NoChatSelected;
