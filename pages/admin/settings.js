import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import Switch from "../../partials/admin/base/Switch";

import { adminSideProps } from "../../middlewares";
import { useAdminPage } from "../../hooks";
import {
  getUserLogActive as getUserLogActiveRequest,
  setUserLogActive as setUserLogActiveRequest,
} from "../../services";
import { IndiceContext } from "../../contexts";

const Settings = ({ userLogActive: baseUserLogActive }) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [userLogActive, setUserLogActive] = useState(baseUserLogActive);
  const { authToken, success } = useContext(IndiceContext);

  const handleChange = async (value) => {
    const res = await setUserLogActiveRequest(value, authToken);
    success.set("Operation done success");
    setUserLogActive(res);
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <BreadCrumbs links={[{ title: "Settings" }]} />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow">
                    <div className="p-6 space-y-6">
                      <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                        System Settings
                      </h2>

                      <section>
                        <div className="flex flex-wrap mt-2">
                          <div className="mr-6">User Log</div>
                          <Switch
                            id="email-toggle"
                            checked={userLogActive}
                            changeChecked={() => handleChange(!userLogActive)}
                            onText="Active"
                            offText="Inactive"
                          />
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const boostServerSideProps = async ({baseSideProps}) => {
  const userLogActive = await getUserLogActiveRequest(
    baseSideProps.authToken
  );

  return { userLogActive };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default Settings;
