import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import { useAdminPage, usePagination, useTimeTypeFilter } from "../../../hooks";
import UsersTable from "../../../components/admin/Users/Table";
import SearchForm from "../../../partials/admin/actions/SearchForm";
import PaginationNumeric from "../../../components/admin/PaginationNumeric";
import DeleteAccept from "../../../components/admin/DeleteAccept";
import {
  getUserList,
  deleteUser,
  changeActive,
  setRole,
  changeVerified,
  getAdminUserListPageOptions,
} from "../../../services";
import { IndiceContext } from "../../../contexts";
import Link from "next/link";
import { supportSideProps } from "../../../middlewares";
import { baseAdminTimeListPageParams, baseListPageParams } from "../../../utils";
import DateSelect from "../../../components/admin/DateSelect";

const Users = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [toDeleteUserInfo, setToDeleteUserInfo] = useState({});
  const { error, success, authToken, isAdmin } = useContext(IndiceContext);

  const { timeFilterType, geTimeTypeDopProps, handleChangeTimeFilterType } =
    useTimeTypeFilter(pageProps);

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
    getItemsFunc: (data) => getUserList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
    getDopProps: geTimeTypeDopProps,
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
      const res = await changeActive(id, authToken);
      setItemFields({ active: res.active }, id);
      success.set(
        `${name} ${res.active ? "activated" : "deactivated"} successfully!`
      );
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleChangeVerified = async (id, name) => {
    try {
      const res = await changeVerified(id, authToken);
      setItemFields({ verified: res.verified }, id);
      success.set(
        `${name} ${res.active ? "verified" : "unverified"} successfully!`
      );
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleSetRole = async (id, name, role) => {
    try {
      const res = await setRole(id, role, authToken);
      setItemFields({ role: res.role }, id);
      success.set(`${name} role updated to ${res.role} successfully!`);
    } catch (e) {
      error.set(e.message);
    }
  };

  const onDeleteAccept = async () => {
    try {
      const { name, id } = toDeleteUserInfo;
      await deleteUser(id, authToken);
      handleCloseDeleteModal();
      await rebuild();
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

              {isAdmin && (
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <SearchForm value={filter} onInput={changeFilter} />

                  <DateSelect
                    value={timeFilterType}
                    setValue={(value) =>
                      handleChangeTimeFilterType(value, rebuild)
                    }
                  />

                  <Link
                    href="/admin/users/create"
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    <svg
                      className="w-4 h-4 fill-current opacity-50 shrink-0"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="hidden xs:block ml-2">Add Member</span>
                  </Link>
                </div>
              )}
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
              handleChangeVerified={handleChangeVerified}
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

      <DeleteAccept
        title="Delete 1 user?"
        body={`Are you sure you want to remove user ${
          toDeleteUserInfo?.name ?? ""
        } from the system? All information about him will be lost`}
        modalOpen={dangerModalOpen}
        setModalOpen={setDangerModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
        onDeleteAccept={onDeleteAccept}
      />
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const options = await getAdminUserListPageOptions(
    baseAdminTimeListPageParams(context.query),
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  supportSideProps(context, boostServerSideProps);

export default Users;
