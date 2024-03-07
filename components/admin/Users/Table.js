import React, { useContext } from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import { IndiceContext } from "../../../contexts";

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
}) => {
  const { isAdmin } = useContext(IndiceContext);

  const ths = [
    { title: "Id", value: "id" },
    { title: "Name", value: "name" },
    { title: "Email", value: "email" },
    { title: "Phone", value: "phone" },
    { title: "Verified", value: "verified", canOrder: false },
  ];

  if (isAdmin) {
    ths.push({ title: "Active", value: "active", canOrder: false });
  }

  ths.push({ title: "Role", value: "role" });
  ths.push({ title: "Actions", value: "actions", canOrder: false });

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
                    key={th.value}
                    {...th}
                    orderType={orderField == th.value ? orderType : null}
                    onClick={onClickTh}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700">
              {users.map((user) => {
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
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
