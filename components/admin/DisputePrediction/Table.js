import React from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import PaginationLoading from "../PaginationLoading";
import EmptyTable from "../EmptyTable";

const DisputePredictionModelsTable = ({
  models,
  orderField,
  orderType,
  onClickTh,
  totalCount,
  loading,
  setModelIdToStop,
  setModelIdToUnstop,
  setModelIdToActivate,
}) => {
  const ths = [
    { title: "Id", value: "id", width: "10%" },
    { title: "Status", value: "success", canOrder: false, width: "15%" },
    { title: "Active", value: "active", canOrder: false, width: "15%" },
    { title: "Fields", value: "fields", canOrder: false, width: "25%" },
    { title: "Accuracy", value: "accuracy", canOrder: false, width: "15%" },
    { title: "Date", value: "create_at", width: "10%" },
    { title: "", value: "actions", width: "10%", canOrder: false },
  ];

  return (
    <div className="base-pagination-table bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          All Models{" "}
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
                models.map((model) => (
                  <TableItem
                    key={model.id}
                    onStopModelClick={() => setModelIdToStop(model.id)}
                    onUnstopModelClick={() => setModelIdToUnstop(model.id)}
                    onActivateModelClick={() => setModelIdToActivate(model.id)}
                    {...model}
                  />
                ))}
            </tbody>
          </table>

          {loading && <PaginationLoading />}

          {!loading && models.length < 1 && <EmptyTable name="models" />}
        </div>
      </div>
    </div>
  );
};

export default DisputePredictionModelsTable;
