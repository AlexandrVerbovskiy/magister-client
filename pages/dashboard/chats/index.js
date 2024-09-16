import BaseChat from "../../../components/Chat";
import useChat from "../../../hooks/useChat";
import { authSideProps } from "../../../middlewares";
import { getUserChatOptions } from "../../../services";
import STATIC from "../../../static";

const Chat = (props) => {
  const chatProps = useChat(props);
  return <BaseChat {...chatProps} />;
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const chatType =
    context.query["chat-type"] === STATIC.CHAT_TYPES.DISPUTE
      ? STATIC.CHAT_TYPES.DISPUTE
      : STATIC.CHAT_TYPES.ORDER;

  const options = await getUserChatOptions(
    { chatType },
    baseSideProps.authToken
  );

  return { ...options };
};
export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Chats" },
  });

export default Chat;
