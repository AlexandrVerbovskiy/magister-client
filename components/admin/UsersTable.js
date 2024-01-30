import React from "react";
import PaginationNumeric from "./PaginationNumeric";
import Th from "../../partials/admin/base/Th";

const UsersTable = ({ users, orderField, orderType, onClickTh }) => {
  const ths = [
    { title: "Id", key: "id" },
    { title: "Name", key: "name" },
    { title: "Email", key: "email" },
    { title: "Active", key: "active" },
    { title: "Role", key: "role" },
    { title: "Actions", key: "actions" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900">
      <div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            <thead className="text-xs font-semibold uppercase text-slate-500 border-t border-b border-slate-200 dark:border-slate-700">
              <tr>
                {ths.map((th) => (
                  <Th
                    title={th.title}
                    key={th.key}
                    orderType={orderField == th.key ? orderType : null}
                    onClick={onClickTh}
                  />
                ))}
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
