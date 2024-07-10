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
