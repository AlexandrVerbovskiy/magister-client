import { useRouter } from "next/router";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import DashboardNavbar from "../Dashboard/DashboardNavbar";
import NavbarThree from "../_App/NavbarThree";

const Chat = ({ listProps }) => {
  const router = useRouter();
  const { chatId = null } = router.query;

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />
        <div className="chat-content-area">
          <LeftSidebar {...listProps} />
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Chat;
