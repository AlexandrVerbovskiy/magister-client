import React, { useContext } from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import { IndiceContext } from "../../../contexts";

const Table = ({ bookings, orderField, onClickTh, orderType, totalCount }) => {
  const ths = [
    { title: "Id", value: "id", width: "10%" },
    { title: "Listing", value: "listings.name", width: "20%" },
    { title: "Tenant", value: "tenants.name", width: "10%" },
    { title: "Owner", value: "owners.name", width: "10%" },
    { title: "Status", value: "orders.status", width: "15%" },
    { title: "Total Price", value: "fact_total_price", width: "10%" },
    { title: "Actions", value: "actions", width: "10%", canOrder: false },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Bookings{" "}
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
              {bookings.map((booking) => (
                <TableItem {...booking} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
