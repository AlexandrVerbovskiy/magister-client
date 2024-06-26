import BaseChat from "../../../components/Chat";
import useChat from "../../../hooks/useChat";
import { authSideProps } from "../../../middlewares";
import { getUserChatOptions } from "../../../services";

const Chat = (props) => {
  const {
    listProps,
    bodyProps,
    handleSelectChat,
    selectedChat,
    handleChangeType,
    actions,
    windowProps,
    stopSendMediaMessage,
  } = useChat(props);

  return (
    <BaseChat
      listProps={listProps}
      bodyProps={bodyProps}
      handleSelectChat={handleSelectChat}
      selectedChat={selectedChat}
      handleChangeType={handleChangeType}
      actions={actions}
      windowProps={windowProps}
      stopSendMediaMessage={stopSendMediaMessage}
    />
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const chatType =
    context.query["chat-type"] === "disputes" ? "disputes" : "orders";
  const chatId = +context.params.id;

  const options = await getUserChatOptions(
    { chatType, id: chatId },
    baseSideProps.authToken
  );

  return { ...options, chatId };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default Chat;
