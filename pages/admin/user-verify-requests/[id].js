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
import ModalBlank from "../../../components/admin/ModalBlank";
import { supportSideProps } from "../../../middlewares";
import ErrorSpan from "../../../components/admin/ErrorSpan";

const UserVerifyRequest = ({ info }) => {
  const { error, success, authToken } = useContext(IndiceContext);
  const { sidebarOpen, setSidebarOpen } = useAdminPage();

  const [accessDeclineModalOpen, setAccessDeclineModalOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const [declineDescription, setDeclineDescription] = useState("");
  const [declineDescriptionError, setDeclineDescriptionError] = useState(null);

  const handleInputDeclineDescription = (e) => {
    setDeclineDescription(e.target.value);
    setDeclineDescriptionError(null);
  };

  const handleBaseVerifyChangeClick = async (verified, description = null) => {
    try {
      await userVerifyRequestUpdate({ id, verified, description }, authToken);
      const message = verified
        ? "Verified successfully"
        : "Declined successfully";
      success.set(message);
      router.push("/admin/user-documents/" + info.userId);
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleAcceptClick = async () => {
    await handleBaseVerifyChangeClick(true);
  };

  const handleDeclineClick = (e) => {
    e.stopPropagation();
    setAccessDeclineModalOpen(true);
  };

  const handleAcceptDeclineClick = async () => {
    setDeclineDescriptionError(null);

    if (declineDescription.length < 1) {
      setDeclineDescriptionError(
        "You must enter the reason for the rejection of the verification"
      );
      return;
    }

    setAccessDeclineModalOpen(false);
    await handleBaseVerifyChangeClick(false, declineDescription);
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
                    href: "/admin/user-edit/" + info.userId,
                  },
                  { title: "Verify Request" },
                ]}
              />
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:flex-row md:-mr-px">
                <div className="grow">
                  <DocumentList {...info} />

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
                </div>
              </div>
            </div>
          </div>
        </main>

        <ModalBlank
          id="access-decline"
          modalOpen={accessDeclineModalOpen}
          setModalOpen={setAccessDeclineModalOpen}
        >
          <div className="p-5 flex space-x-4">
            <div style={{ width: "100%" }}>
              <div className="mb-2">
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Are you sure you want decline this request?
                </div>
              </div>
              <div className="text-sm mb-2">
                <div className="space-y-2">
                  <p>Enter the reason for the rejection</p>
                </div>
              </div>

              <div className="mb-2">
                <textarea
                  className="form-input w-full"
                  rows="6"
                  value={declineDescription}
                  onChange={handleInputDeclineDescription}
                />
                <ErrorSpan error={declineDescriptionError} />
              </div>

              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  onClick={() => setAccessDeclineModalOpen(false)}
                  className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptDeclineClick}
                  className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </ModalBlank>
      </div>
    </div>
  );
};

const boostServerSideProps = async ({baseSideProps, context}) => {
  const id = context.params.id;

  const info = await getUserVerifyRequestById(
    id,
    baseSideProps.authToken
  );

  return { info };
};

export const getServerSideProps = (context) =>
  supportSideProps(context, boostServerSideProps);


export default UserVerifyRequest;
