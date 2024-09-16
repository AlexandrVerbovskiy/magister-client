import { useRef, useState, useEffect } from "react";
import { useAdminPage } from "../../../hooks";
import { supportSideProps } from "../../../middlewares";
import BaseChat from "../../../components/admin/Chat/BaseChat";
import useAdminChat from "../../../hooks/useAdminChat";
import { getAdminChatOptions } from "../../../services";

const Chats = (props) => {
  const contentArea = useRef(null);
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [msgSidebarOpen, setMsgSidebarOpen] = useState(true);

  useEffect(() => {
    contentArea.current.scrollTop = msgSidebarOpen ? 0 : 99999999;
  }, [msgSidebarOpen]);

  const chatOptions = useAdminChat(props);

  return (
    <BaseChat
      sidebarOpen={sidebarOpen}
      contentArea={contentArea}
      msgSidebarOpen={msgSidebarOpen}
      setSidebarOpen={setSidebarOpen}
      setMsgSidebarOpen={setMsgSidebarOpen}
      {...props}
      {...chatOptions}
    />
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const chatId = +context.params.id;
  const options = await getAdminChatOptions(
    { id: chatId },
    baseSideProps.authToken
  );

  return { ...options, chatId };
};

export const getServerSideProps = (context) =>
  supportSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Chats" },
  });

export default Chats;
