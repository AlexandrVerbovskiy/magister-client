import React from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";

const LogsTable = ({
  logs,
  orderField,
  orderType,
  onClickTh,
  totalCount,
  onSelectPanelItem,
}) => {
  const ths = [
    { title: "Id", value: "id", width: "10%" },
    { title: "Status", value: "success", canOrder: false, width: "15%" },
    { title: "Message", value: "message", width: "45%" },
    { title: "File", value: "file", width: "10%" },
    { title: "Line", value: "line", width: "10%" },
    { title: "Date", value: "create_at", width: "10%" },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Logs{" "}
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            {totalCount}
          </span>
        </h2>
      </header>

      <div>
        <div className="overflow-x-auto">
          <table className="admin-table table-fixed w-full dark:text-slate-300">
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
              {logs.map((log) => (
                <TableItem
                  key={log.id}
                  {...log}
                  onSelectPanelItem={onSelectPanelItem}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogsTable;
