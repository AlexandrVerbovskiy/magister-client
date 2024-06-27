import { useRef, useState, useEffect } from "react";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import { useAdminPage } from "../../../hooks";
import { adminSideProps } from "../../../middlewares";
import ChatHeader from "../../../components/admin/Chat/Header";

const Chats = () => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();

  const contentArea = useRef(null);

  const [msgSidebarOpen, setMsgSidebarOpen] = useState(true);

  useEffect(() => {
    contentArea.current.scrollTop = msgSidebarOpen ? 0 : 99999999;
  }, [msgSidebarOpen]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
        ref={contentArea}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div
              className={`grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out ${
                msgSidebarOpen ? "translate-x-1/3" : "translate-x-0"
              }`}
            >
              <ChatHeader
                msgSidebarOpen={msgSidebarOpen}
                setMsgSidebarOpen={setMsgSidebarOpen}
                users={[]}
                dispute={{ id: "12", status: "open" }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export const getServerSideProps = adminSideProps;

export default Chats;
