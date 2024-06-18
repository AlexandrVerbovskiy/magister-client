import BaseChat from "../../../components/Chat";
import useChatList from "../../../hooks/useChatList";
import { getUserChatOptions } from "../../../services";

const Chat = ({ chats, canShowMore }) => {
  const listProps = useChatList({
    chats,
    canShowMore,
  });

  return <BaseChat listProps={listProps} />;
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const options = await getUserChatOptions(
    context.params.id,
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default Chat;
