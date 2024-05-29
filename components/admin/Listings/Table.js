import React from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";

const ListingsTable = ({
  listings,
  orderField,
  orderType,
  onClickTh,
  totalCount,
  onClickDelete,
  onClickChangeActive,
}) => {
  const ths = [
    { title: "Id", value: "id", width: "8%" },
    { title: "Name", value: "name", width: "14%" },
    { title: "City", value: "city", width: "10%" },
    { title: "Owner", value: "users.name", width: "14%" },
    { title: "Category", value: "listing_categories.name", width: "10%" },
    { title: "Count Stored", value: "count_stored_items", width: "10%" },
    { title: "Per Day", value: "price_per_day", width: "10%" },
    { title: "Approved", value: "approved", canOrder: false, width: "10%" },
    { title: "Active", value: "active", canOrder: false, width: "10%" },
    { title: "", value: "actions", width: "4%", canOrder: false },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Listings{" "}
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
              {listings.map((listing) => (
                <TableItem
                  key={listing.id}
                  {...listing}
                  onClickDelete={(e) => {
                    e.stopPropagation();
                    onClickDelete(listing.id, listing.name);
                  }}
                  onChangeActive={(e) =>
                    onClickChangeActive(listing.id, listing.name)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListingsTable;
