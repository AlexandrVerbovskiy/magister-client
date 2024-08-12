import React, { useState, useContext } from "react";
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
import { baseAdminTimeListPageParams } from "../../../utils";
import DateSelect from "../../../components/admin/DateSelect";
import BaseListSubHeaderDropdown from "../../../components/admin/BaseListSubHeaderDropdown";

const Users = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [toDeleteUserInfo, setToDeleteUserInfo] = useState({});
  const { error, success, authToken, isAdmin } = useContext(IndiceContext);
  const [activeFilter, setActiveFilter] = useState(pageProps.active ?? "all");
  const [roleFilter, setRoleFilter] = useState(pageProps.role ?? "all");
  const [verifiedFilter, setVerifiedFilter] = useState(
    pageProps.verified ?? "all"
  );

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
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: (data) => getUserList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
    getDopProps: () => ({
      ...geTimeTypeDopProps(),
      verified: {
        value: verifiedFilter,
        hidden: (value) => value == "all",
      },
      active: {
        value: activeFilter,
        hidden: (value) => value == "all",
      },
      role: {
        value: roleFilter,
        hidden: (value) => value == "all",
      },
    }),
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

  const handleChangeActiveFilter = (newActive) => {
    setActiveFilter(newActive);
    rebuild({ active: newActive });
  };

  const handleChangeVerifiedFilter = (newVerified) => {
    setVerifiedFilter(newVerified);
    rebuild({ verified: newVerified });
  };

  const handleChangeRoleFilter = (newRole) => {
    setRoleFilter(newRole);
    rebuild({ role: newRole });
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="md:flex md:justify-between md:items-center mb-8">
              <BreadCrumbs links={[{ title: "Users" }]} />

              <div className="flex md:auto-cols-max justify-start md:justify-end gap-2 mt-2 md:mt-0 flex-col md:flex-row">
                <div className="flex gap-2 flex-col xs:flex-row">
                  <SearchForm value={filter} onInput={changeFilter} />

                  <div className="flex gap-2">
                    <DateSelect
                      value={timeFilterType}
                      setValue={(value) =>
                        handleChangeTimeFilterType(value, rebuild)
                      }
                    />

                    <BaseListSubHeaderDropdown
                      listFilters={[
                        {
                          name: "active",
                          label: "Active",
                          options: [
                            {
                              value: "active",
                              title: "Active",
                            },
                            {
                              value: "inactive",
                              title: "Inactive",
                            },
                            { value: "all", title: "All" },
                          ],
                          value: activeFilter,
                          onChange: handleChangeActiveFilter,
                        },
                        {
                          name: "verified",
                          label: "Verified",
                          options: [
                            {
                              value: "verified",
                              title: "Verified",
                            },
                            {
                              value: "unverified",
                              title: "Unverified",
                            },
                            { value: "all", title: "All" },
                          ],
                          value: verifiedFilter,
                          onChange: handleChangeVerifiedFilter,
                        },
                        {
                          name: "role",
                          label: "Role",
                          options: [
                            {
                              value: "user",
                              title: "User",
                            },
                            {
                              value: "support",
                              title: "Support",
                            },
                            {
                              value: "admin",
                              title: "Admin",
                            },
                            { value: "all", title: "All" },
                          ],
                          value: roleFilter,
                          onChange: handleChangeRoleFilter,
                        },
                      ]}
                    />
                  </div>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin/users/create/"
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    <svg
                      className="w-4 h-4 fill-current opacity-50 shrink-0"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="ml-2">Add Member</span>
                  </Link>
                )}
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
              loading={paginationLoading}
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
    {
      ...baseAdminTimeListPageParams(context.query),
      active: context.query["active"],
      verified: context.query["verified"],
      role: context.query["role"],
    },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  supportSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Users" },
  });

export default Users;
