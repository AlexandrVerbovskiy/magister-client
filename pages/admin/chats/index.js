import { useRef, useState, useEffect } from "react";
import { useAdminPage } from "../../../hooks";
import { adminSideProps } from "../../../middlewares";
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
  const options = await getAdminChatOptions(
    { id: null },
    baseSideProps.authToken
  );

  return { ...options, chatId: null };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default Chats;