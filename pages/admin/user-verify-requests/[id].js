import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import {
  getUserVerifyRequestById,
  userVerifyRequestUpdate,
} from "../../../services";
import { IndiceContext } from "../../../contexts";
import Sidebar from "../../../partials/admin/Sidebar";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Header from "../../../partials/admin/Header";
import { useAdminPage } from "../../../hooks";
import DocumentList from "../../../components/admin/Users/DocumentList";
import { supportSideProps } from "../../../middlewares";
import DeclineModal from "../../../components/admin/UserVerifyRequests/DeclineModal";
import ApproveModal from "../../../components/admin/UserVerifyRequests/ApproveModal";
import {useIdPage} from "../../../hooks";

const UserVerifyRequest = (baseProps) => {
  const { props, authToken } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getUserVerifyRequestById(field, authToken),
    onUpdate: (newProps) => setInfo(newProps.info),
  });

  const router = useRouter();
  const { id } = router.query;

  const [info, setInfo] = useState(props.info);
  const { success } = useContext(IndiceContext);
  const { sidebarOpen, setSidebarOpen } = useAdminPage();

  const [accessDeclineModalOpen, setAccessDeclineModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);

  const handleBaseVerifyChangeClick = async (verified, description = null) => {
    await userVerifyRequestUpdate({ id, verified, description }, authToken);
    const message = verified
      ? "Verified successfully"
      : "Declined successfully";
    success.set(message);

    setInfo((prev) => ({
      ...prev,
      hasResponse: true,
      failedDescription: description,
    }));
  };

  const handleApproveAcceptClick = async () => {
    await handleBaseVerifyChangeClick(true);
  };

  const handleDeclineClick = (e) => {
    e.stopPropagation();
    setAccessDeclineModalOpen(true);
  };

  const handleAcceptClick = (e) => {
    e.stopPropagation();
    setApproveModalOpen(true);
  };

  const handleAcceptDeclineClick = async (description) => {
    await handleBaseVerifyChangeClick(false, description);
    setAccessDeclineModalOpen(false);
  };

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
                  {
                    title: info.userName,
                    href: "/admin/users/edit/" + info.userId,
                  },
                  { title: "Verify Request" },
                ]}
              />
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:flex-row md:-mr-px">
                <div className="grow">
                  <DocumentList {...info} />

                  {!info.hasResponse && (
                    <footer>
                      <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex self-start">
                          <button
                            type="button"
                            onClick={handleDeclineClick}
                            className="btn bg-red-500 hover:bg-red-600 text-white"
                          >
                            Decline
                          </button>

                          <button
                            type="button"
                            onClick={handleAcceptClick}
                            className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-2"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </footer>
                  )}

                  {info.hasResponse && (
                    <footer>
                      <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                        <section className="flex gap-x-4 flex-row">
                          {info.failedDescription ? (
                            <div
                              className="w-full fade text-sm show bg-rose-500 text-white px-4 py-3 rounded relative"
                              role="alert"
                            >
                              <span className="block sm:inline">
                                <b>Rejected: </b>
                                {info.failedDescription}
                              </span>
                            </div>
                          ) : (
                            <div
                              className="w-full fade text-sm show bg-emerald-500 text-white px-4 py-3 rounded relative"
                              role="alert"
                            >
                              <span className="block sm:inline">
                                <b>Accepted</b>
                              </span>
                            </div>
                          )}
                        </section>
                      </div>
                    </footer>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <DeclineModal
          active={accessDeclineModalOpen}
          close={() => setAccessDeclineModalOpen(false)}
          onAcceptClick={handleAcceptDeclineClick}
        />

        <ApproveModal
          active={approveModalOpen}
          close={() => setApproveModalOpen(false)}
          onAcceptClick={handleApproveAcceptClick}
        />
      </div>
    </div>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const info = await getUserVerifyRequestById(id, baseSideProps.authToken);
  return { info, pageTitle: `User verify request #${id}` };
};

export const getServerSideProps = (context) =>
  supportSideProps({context, callback: boostServerSideProps});

export default UserVerifyRequest;
