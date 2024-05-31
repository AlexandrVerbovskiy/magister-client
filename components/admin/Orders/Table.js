import React, { useContext } from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";

const Table = ({
  orders,
  orderField,
  orderType,
  totalCount,
  onClickTh,
  openDeleteModal,
}) => {
  const ths = [
    { title: "Rental Id", value: "id", width: "15%" },
    { title: "Item", value: "listings.name", width: "20%" },
    { title: "Rental Start", value: "tenants.start_date", width: "15%" },
    { title: "Rental End", value: "owners.end_date", width: "15%" },
    {
      title: "Total Amount",
      value: "owners.total_amount",
      canOrder: false,
      width: "15%",
    },
    { title: "Status", value: "orders.status", width: "15%" },
    { title: "", canOrder: false, value: "orders.actions", width: "5%" },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Orders{" "}
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            {totalCount}
          </span>
        </h2>
      </header>

      <div>
        <div className="overflow-x-auto">
          <table className="admin-table table-fixed  w-full dark:text-slate-300">
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
              {orders.map((order) => (
                <TableItem
                  key={order.id}
                  {...order}
                  onDeleteClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(order.id);
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

export default Table;
