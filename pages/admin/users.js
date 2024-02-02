import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import { useAdminPage, usePagination } from "../../hooks";
import UsersTable from "../../components/admin/Users/Table";
import SearchForm from "../../partials/admin/actions/SearchForm";
import PaginationNumeric from "../../components/admin/PaginationNumeric";
import ModalBlank from "../../components/admin/ModalBlank";
import { getList, deleteUser, changeActive, setRole } from "../../services";
import { IndiceContext } from "../../contexts";

const Users = () => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [toDeleteUserInfo, setToDeleteUserInfo] = useState({});
  const { error, success } = useContext(IndiceContext);

  const {
    page,
    countItems,
    countPages,
    moveToPage,
    filter,
    changeFilter,
    order,
    orderType,
    currentTo,
    currentFrom,
    handleChangeOrder,
    canMoveNextPage,
    canMovePrevPage,
    items: users,
    rebuild,
    setItemFields,
  } = usePagination({
    getItemsFunc: getList,
    onError: (e) => error.set(e.message),
  });

  const handleCloseDeleteModal = () => {
    setToDeleteUserInfo(null);
    setDangerModalOpen(false);
  };

  const handleOpenDeleteModal = (id, name) => {
    setToDeleteUserInfo({ name, id });
    setDangerModalOpen(true);
  };

  const handleChangeActive = async (id, name) => {
    try {
      const res = await changeActive(id);
      setItemFields({ active: res.active }, id);
      success.set(
        `${name} ${res.active ? "activated" : "deactivated"} successfully!`
      );
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleSetRole = async (id, name, role) => {
    try {
      const res = await setRole(id, role);
      setItemFields({ role: res.role }, id);
      success.set(`${name} role updated to ${res.role} successfully!`);
    } catch (e) {
      error.set(e.message);
    }
  };

  const onDeleteAccept = async () => {
    try {
      const { name, id } = toDeleteUserInfo;
      await deleteUser(id);
      handleCloseDeleteModal();
      rebuild();
      success.set(`${name} deleted successfully!`);
    } catch (e) {
      error.set(e.message);
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <BreadCrumbs links={[{ title: "Users" }]} />

              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <SearchForm value={filter} onInput={changeFilter} />

                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                  <svg
                    className="w-4 h-4 fill-current opacity-50 shrink-0"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="hidden xs:block ml-2">Add Member</span>
                </button>
              </div>
            </div>

            <UsersTable
              users={users}
              orderField={order}
              orderType={orderType}
              onClickTh={handleChangeOrder}
              openDeleteModal={handleOpenDeleteModal}
              handleSetRole={handleSetRole}
              handleChangeActive={handleChangeActive}
              totalCount={countItems}
            />

            <div className="mt-8">
              <PaginationNumeric
                page={page}
                countPages={countPages}
                move={moveToPage}
                canNext={canMoveNextPage}
                canPrev={canMovePrevPage}
                to={currentTo}
                from={currentFrom}
                totalCount={countItems}
              />
            </div>
          </div>
        </main>
      </div>

      <ModalBlank
        id="danger-modal"
        modalOpen={dangerModalOpen}
        setModalOpen={setDangerModalOpen}
      >
        <div className="p-5 flex space-x-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-100 dark:bg-rose-500/30">
            <svg
              className="w-4 h-4 shrink-0 fill-current text-rose-500"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
            </svg>
          </div>
          {/* Content */}
          <div>
            {/* Modal header */}
            <div className="mb-2">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Delete 1 user?
              </div>
            </div>
            {/* Modal content */}
            <div className="text-sm mb-10">
              <div className="space-y-2">
                <p>
                  Are you sure you want to remove user{" "}
                  {toDeleteUserInfo?.name ?? ""} from the system? All
                  information about him will be lost
                </p>
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseDeleteModal();
                }}
              >
                Cancel
              </button>
              <button
                onClick={onDeleteAccept}
                className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
              >
                Yes, Delete it
              </button>
            </div>
          </div>
        </div>
      </ModalBlank>
    </div>
  );
};

Users.getInitialProps = async () => ({
  access: "admin",
  type: "admin",
});

export default Users;
