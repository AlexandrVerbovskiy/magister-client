import React from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import PaginationLoading from "../PaginationLoading";
import EmptyTable from "../EmptyTable";

const UsersTable = ({
  users,
  orderField,
  orderType,
  onClickTh,
  openDeleteModal,
  handleSetRole,
  handleChangeActive,
  handleChangeVerified,
  totalCount,
  loading,
}) => {
  const ths = [
    { title: "User", value: "name", width: "25%" },
    { title: "Email", value: "email", width: "20%" },
    { title: "Registration", value: "users.created_at", width: "10%" },
    { title: "Rentals", value: "rentals", width: "10%", canOrder: false },
    {
      title: "Total Spent",
      canOrder: false,
      value: "total-spent",
      width: "10%",
    },
    { title: "Role", value: "role", width: "10%" },
    { title: "Status", canOrder: false, value: "status", width: "10%" },
    {
      title: "",
      value: "actions",
      canOrder: false,
      width: "5%",
    },
  ];

  return (
    <div className="base-pagination-table bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Users{" "}
          {!loading && (
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              {totalCount}
            </span>
          )}
        </h2>
      </header>

      <div>
        <div className="overflow-x-auto">
          <table className="admin-table table-fixed dark:text-slate-300">
            <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
              <tr>
                {ths.map((th) => (
                  <Th
                    key={th.value}
                    {...th}
                    orderType={orderField == th.value ? orderType : null}
                    onClick={onClickTh}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700">
              {!loading &&
                users.map((user) => {
                  return (
                    <TableItem
                      key={user.id}
                      {...user}
                      onChangeRole={(role) =>
                        handleSetRole(user.id, user.name, role)
                      }
                      onChangeActive={() =>
                        handleChangeActive(user.id, user.name)
                      }
                      onDeleteClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(user.id, user.name);
                      }}
                      onChangeVerified={() =>
                        handleChangeVerified(user.id, user.name)
                      }
                    />
                  );
                })}
            </tbody>
          </table>

          {loading && <PaginationLoading />}

          {!loading && users.length < 1 && <EmptyTable name="users" />}
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
