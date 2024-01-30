import React, { useEffect, useState } from "react";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import "tailwindcss/tailwind.css";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import { usePagination } from "../../hooks";
import UsersTable from "../../components/admin/UsersTable";
import SearchForm from "../../partials/admin/actions/SearchForm";
import PaginationNumeric from "../../components/admin/PaginationNumeric";

const Users = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    page,
    countPages,
    moveToPage,
    filterValue,
    setFilterValue,
    orderField,
    orderType,
    handleChangeOrder,
    canMoveNextPage,
    canMovePrevPage,
    items: users,
  } = usePagination();

  const handleChangeFilter = (value) => {
    setFilterValue(value);
  };

  useEffect(() => {
    document
      .querySelector("body")
      .classList.add(
        "font-inter",
        "antialiased",
        "bg-slate-100",
        "dark:bg-slate-900",
        "text-slate-600",
        "dark:text-slate-400",
        "sidebar-expanded"
      );

    return () => {
      document
        .querySelector("body")
        .classList.remove(
          "font-inter",
          "antialiased",
          "bg-slate-100",
          "dark:bg-slate-900",
          "text-slate-600",
          "dark:text-slate-400",
          "sidebar-expanded"
        );
    };
  }, []);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <BreadCrumbs links={[{ title: "Users", href: "/admin/users" }]} />

              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <SearchForm value={filterValue} onInput={handleChangeFilter} />

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
              orderField={orderField}
              orderType={orderType}
              onClickTh={handleChangeOrder}
            />

            <div className="mt-8">
              <PaginationNumeric
                page={page}
                countPages={countPages}
                move={moveToPage}
                canNext={canMoveNextPage}
                canPrev={canMovePrevPage}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

Users.getInitialProps = async () => ({
  access: "admin",
});

export default Users;
