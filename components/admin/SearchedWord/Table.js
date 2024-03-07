import React, { useContext } from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";

const SearchedWordTable = ({
  searchedWords,
  orderField,
  orderType,
  onClickTh,
  totalCount,
}) => {
  const ths = [
    { title: "Id", value: "id" },
    { title: "Search String", value: "name" },
    { title: "Search Count", value: "search_count" },
    { title: "Viewed", value: "admin_viewed", canOrder: false },
    { title: "Accepted", value: "listing_categories_id", canOrder: false },
    { title: "Actions", value: "actions", canOrder: false },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Searches not founds{" "}
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
              {searchedWords.map((searchedWord) => (
                <TableItem key={searchedWord.id} {...searchedWord} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SearchedWordTable;
