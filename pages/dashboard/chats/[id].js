import BaseChat from "../../../components/Chat";
import useChat from "../../../hooks/useChat";
import { authSideProps } from "../../../middlewares";
import { getUserChatOptions } from "../../../services";

const Chat = (props) => {
  const chatProps = useChat(props);
  return <BaseChat {...chatProps} />;
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const chatType = context.query["chat-type"];
  const chatId = +context.params.id;

  const options = await getUserChatOptions(
    { chatType, id: chatId },
    baseSideProps.authToken
  );

  return { ...options, chatId };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Chats" },
  });

export default Chat;
