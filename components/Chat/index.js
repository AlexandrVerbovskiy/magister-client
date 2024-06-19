import { useRouter } from "next/router";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import DashboardNavbar from "../Dashboard/DashboardNavbar";
import NavbarThree from "../_App/NavbarThree";
import { useChatWindowsChanger } from "../../hooks";

const Chat = ({ listProps, bodyProps }) => {
  const router = useRouter();
  const { chatId = null } = router.query;
  const { bodyRef, setListWindow, setChatWindow } = useChatWindowsChanger();

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />
        <div className="chat-content-area" ref={bodyRef}>
          <LeftSidebar {...listProps} setChatWindow={setChatWindow} />
          <RightSidebar {...bodyProps} setListWindow={setListWindow} />
        </div>
      </div>
    </>
  );
};

export default Chat;
