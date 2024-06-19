import BaseChat from "../../../components/Chat";
import { useChatList } from "../../../hooks";
import { authSideProps } from "../../../middlewares";
import { getUserChatOptions } from "../../../services";

const Chat = ({ chats, chatsCanShowMore, options }) => {
  const listProps = useChatList({
    chats,
    canShowMore: chatsCanShowMore,
    options,
  });

  return <BaseChat listProps={listProps} />;
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
