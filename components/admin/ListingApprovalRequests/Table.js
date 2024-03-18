import React from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";

const RequestsTable = ({
  listingApprovalRequests,
  orderField,
  orderType,
  onClickTh,
  totalCount,
}) => {
  const ths = [
    { title: "Id", value: "listing_approval_requests.id", width: "10%" },
    { title: "Name", value: "listings.name", width: "15%" },
    { title: "City", value: "listings.city", width: "15%" },
    { title: "User", value: "users.name", width: "15%" },
    { title: "Category", value: "listing_categories.name", width: "15%" },
    {
      title: "Approved",
      value: "listing_approval_requests.approved",
      canOrder: false,
      width: "10%",
    },
    {
      title: "Created At",
      value: "listing_approval_requests.created_at",
      width: "10%",
    },
    { title: "Actions", value: "actions", canOrder: false, width: "10%" },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Requests{" "}
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
              {listingApprovalRequests.map((request) => (
                <TableItem key={request.id} {...request} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestsTable;
