import React from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";

const UsersTable = ({
  users,
  orderField,
  orderType,
  onClickTh,
  openDeleteModal,
  handleSetRole,
  handleChangeActive,
  totalCount,
}) => {
  const ths = [
    { title: "Id", value: "id" },
    { title: "Name", value: "name" },
    { title: "Email", value: "email" },
    { title: "Phone", value: "phone" },
    { title: "Active", value: "active" },
    { title: "Role", value: "role" },
    { title: "Actions", value: "actions" },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Users{" "}
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            {totalCount}
          </span>
        </h2>
      </header>

      <div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
              <tr>
                {ths.map((th) => (
                  <Th
                    title={th.title}
                    key={th.value}
                    value={th.value}
                    orderType={orderField == th.value ? orderType : null}
                    onClick={onClickTh}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700">
              {users.map((user) => (
                <TableItem
                  key={user.id}
                  {...user}
                  onChangeRole={(role) =>
                    handleSetRole(user.id, user.name, role)
                  }
                  onChangeActive={() => handleChangeActive(user.id, user.name)}
                  onDeleteClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(user.name, user.id);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
