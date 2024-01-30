import React, { useState } from "react";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import WelcomeBanner from "../../partials/admin/dashboard/WelcomeBanner";
import "tailwindcss/tailwind.css";

const AdminIndex = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <WelcomeBanner />
          </div>
        </main>
      </div>
    </div>
  );
};

AdminIndex.getInitialProps = async () => ({
  access: "admin",
});

export default AdminIndex;
