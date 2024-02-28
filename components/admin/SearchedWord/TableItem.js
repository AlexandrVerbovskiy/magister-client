import React, { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../../../contexts";
import Tooltip from "../../../components/admin/Tooltip";
import Link from "next/link";

const ActiveSpan = ({ active, tooltipTextActive, tooltipTextInactive }) => {
  const text = active ? "YES" : "NO";
  let dopClass = active
    ? "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
    : "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";

  return (
    <div
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1`}
    >
      <Tooltip title={active ? tooltipTextActive : tooltipTextInactive}>
        {text}
      </Tooltip>
    </div>
  );
};

const TableItem = ({
  id,
  name,
  searchCount,
  adminViewed,
  listingCategoriesId,
}) => {
  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        {name}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-semibold">{searchCount}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <ActiveSpan
          active={adminViewed}
          tooltipTextActive="You have viewed this search request before"
          tooltipTextInactive="You haven't viewed this search request before"
        />
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <ActiveSpan
          active={listingCategoriesId}
          tooltipTextActive="You have accepted this search request before"
          tooltipTextInactive="You have accepted this search request before"
        />
      </td>
      <td>
        <Link
          href={`/admin/create-category-by-search/${id}`}
          className="flex text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
        >
          {listingCategoriesId ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 stroke-current"
              strokeWidth="1.5"
              stroke="#2c3e50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
              <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 stroke-current"
              strokeWidth="1.5"
              stroke="#2c3e50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5" />
            </svg>
          )}
        </Link>
      </td>
    </tr>
  );
};

export default TableItem;
