import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import DashboardNavbar from "../Dashboard/DashboardNavbar";
import NavbarThree from "../_App/NavbarThree";

const Chat = ({
  listProps,
  bodyProps,
  selectedChat,
  handleSelectChat,
  handleChangeType,
  actions,
  windowProps,
}) => {
  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />
        <div className="chat-content-area" ref={windowProps.chatRef}>
          <LeftSidebar
            selectedChat={selectedChat}
            handleSelectChat={handleSelectChat}
            {...listProps}
            setChatWindow={windowProps.setChatWindow}
            handleChangeType={handleChangeType}
          />
          <RightSidebar
            selectedChat={selectedChat}
            {...bodyProps}
            setListWindow={windowProps.setListWindow}
            actions={actions}
            handleSelectChat={handleSelectChat}
            windowProps={windowProps}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
