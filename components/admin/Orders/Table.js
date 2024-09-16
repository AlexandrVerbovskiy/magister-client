import React from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import PaginationLoading from "../PaginationLoading";
import EmptyTable from "../EmptyTable";

const Table = ({
  orders,
  orderField,
  orderType,
  totalCount,
  onClickTh,
  type = "orders",
  loading,
}) => {
  const ths = [
    { title: "Rental Id", value: "id", width: "15%" },
    { title: "Item", value: "listings.name", width: "20%" },
    { title: "Rental Start", value: "orders.start_date", width: "15%" },
    { title: "Rental End", value: "orders.end_date", width: "15%" },
    {
      title: "Total Amount",
      value: "owners.total_amount",
      canOrder: false,
      width: "15%",
    },
    { title: "Status", canOrder: false, value: "orders.status", width: "15%" },
    { title: "", canOrder: false, value: "orders.actions", width: "5%" },
  ];

  return (
    <div className="base-pagination-table bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          All {type == "orders" ? "Orders" : "Bookings"}{" "}
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
                orders.map((order) => (
                  <TableItem
                    key={order.id}
                    {...order}
                  />
                ))}
            </tbody>
          </table>

          {loading && <PaginationLoading />}

          {!loading && orders.length < 1 && <EmptyTable name="orders" />}
        </div>
      </div>
    </div>
  );
};

export default Table;
