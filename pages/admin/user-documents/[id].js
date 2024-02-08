import React, { useState, useEffect, useContext } from "react";
import Router, { useRouter } from "next/router";
import {
  changeVerified,
  getFullUserById,
  getUserDocuments,
} from "../../../services";
import { IndiceContext } from "../../../contexts";
import Sidebar from "../../../partials/admin/Sidebar";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Header from "../../../partials/admin/Header";
import { useAdminPage } from "../../../hooks";
import DocumentList from "../../../components/admin/Users/DocumentList";

const UserDocuments = () => {
  const { error, success } = useContext(IndiceContext);
  const { sidebarOpen, setSidebarOpen } = useAdminPage();

  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  const init = async () => {
    try {
      const gotDocuments = await getUserDocuments(id);
      const gotUser = await getFullUserById(id);
      setDocuments(gotDocuments);
      setUser(gotUser);
    } catch (e) {
      error.set(e.message);
    }
  };

  useEffect(() => {
    if (id) {
      init();
    }
  }, [id]);

  const handleVerifyClick = async () => {
    try {
      const res = await changeVerified(id);
      const verified = res.verified;
      success.set(
        "User " +
          user.name +
          (verified ? " verified" : " unverified") +
          " succesfully"
      );
      setUser((prev) => ({ ...prev, verified }));
    } catch (e) {
      error.set(e.message);
    }
  };

  if (!user) return <div></div>;

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <BreadCrumbs
                links={[
                  { title: "Users", href: "/admin/users" },
                  { title: user.name, href: "/admin/user-edit/" + user.id },
                  { title: "Documents" },
                ]}
              />
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:flex-row md:-mr-px">
                <div className="grow">
                  <DocumentList {...documents} />

                  <footer>
                    <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex self-start">
                        <button
                          type="button"
                          onClick={handleVerifyClick}
                          className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                        >
                          {user.verified ? "Unverify" : "Verify"}
                        </button>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

UserDocuments.getInitialProps = async () => ({
  access: "support",
  type: "admin",
});

export default UserDocuments;
