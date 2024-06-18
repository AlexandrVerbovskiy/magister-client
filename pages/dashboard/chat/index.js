import BaseChat from "../../../components/Chat";
import { useChatList } from "../../../hooks";
import { authSideProps } from "../../../middlewares";
import { getUserChatOptions } from "../../../services";

const Chat = () => {
  const listProps = useChatList({
    chats: [],
    canShowMore: true,
  });

  return <BaseChat listProps={listProps} />;
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const options = await getUserChatOptions(null, baseSideProps.authToken);

  return { ...options };
};
export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default Chat;
