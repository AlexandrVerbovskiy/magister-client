import DisputeChatHeader from "./DisputeChatHeader";
import SenderPanel from "./SenderPanel";
import MessageLi from "./MessageLi";
import { dateName } from "../../utils";
import STATIC from "../../static";

const DisputeChatBody = ({
  handleScrollBody,
  stopUpdatingMessage,
  handleChangeUpdatingMessageId,
  messagesToView,
  updatingMessage,
  entity: order,
  setListWindow,
  selectedChat,
  actions,
  windowProps,
}) => {
  return (
    <>
      <div className="chat-list">
        <DisputeChatHeader entity={order} handleGoBackClick={setListWindow} />

        <div
          className="chat-container"
          data-simplebar
          onScroll={handleScrollBody}
        >
          <div className="chat-content">
            {messagesToView.map((message) => {
              if (message.type == "date") {
                return (
                  <div className="w-100 my-3" key={message.tempKey}>
                    <div className="badge badge-pill badge-light">
                      {dateName(message.content)}
                    </div>
                  </div>
                );
              }

              if (message.type == STATIC.MESSAGE_TYPES.RESOLVED_DISPUTE) {
                return (
                  <div className="w-100 my-3" key={message.id}>
                    <div className="badge badge-light gray badge-pill chat-message">
                      Dispute resolved
                    </div>
                  </div>
                );
              }

              if (message.type == STATIC.MESSAGE_TYPES.STARTED_DISPUTE) {
                return (
                  <div className="w-100 my-3" key={message.id}>
                    <div className="badge badge-light gray badge-pill chat-message">
                      <div className="mb-2">
                        <b>Dispute created</b>
                      </div>
                      <div className="w-100 text-start mb-1">
                        <b>Created by: </b>
                        {message.content.senderName}
                      </div>
                      <div className="w-100 text-start mb-1">
                        <b>Type: </b>
                        {message.content.type}
                      </div>
                      <div className="w-100 text-start mb-1">
                        <b>Description: </b>
                        {message.content.description}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <MessageLi
                  key={message.id ?? message.tempKey}
                  {...message}
                  stopSendMediaMessage={actions.stopSendMediaMessage}
                  handleChangeUpdatingMessageId={handleChangeUpdatingMessageId}
                  handleDeleteMessage={actions.deleteMessage}
                  entity={order}
                />
              );
            })}
            <div
              ref={windowProps.bodyTriggerRef}
              className="right-sidebar-bottom"
            ></div>
          </div>
        </div>

        <div className="chat-list-footer">
          <SenderPanel
            stopUpdatingMessage={stopUpdatingMessage}
            updatingMessage={updatingMessage}
            chatId={selectedChat.id}
            {...actions}
          />
        </div>
      </div>
    </>
  );
};

export default DisputeChatBody;
