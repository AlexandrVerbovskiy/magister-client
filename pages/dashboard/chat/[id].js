import BaseChat from "../../../components/Chat";
import useChatList from "../../../hooks/useChatList";
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
  const chatType = context.query["chat-type"] === "disputes" ? "disputes" : "orders";

  const options = await getUserChatOptions(
    { chatType, id: context.params.id },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default Chat;
