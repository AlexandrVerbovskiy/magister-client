import BaseChat from "../../../components/Chat";
import useChat from "../../../hooks/useChat";
import { authSideProps } from "../../../middlewares";
import { getUserChatOptions } from "../../../services";

const Chat = (props) => {
  const chatProps = useChat(props);
  return <BaseChat {...chatProps} />;
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const chatType =
    context.query["chat-type"] === "disputes" ? "disputes" : "orders";

  const options = await getUserChatOptions(
    { chatType },
    baseSideProps.authToken
  );

  return { ...options };
};
export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default Chat;
