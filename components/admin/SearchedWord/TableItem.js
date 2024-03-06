import React from "react";
import Tooltip from "../../../components/admin/Tooltip";
import View from "../FastActions/View";
import Moderate from "../FastActions/Moderate";

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
        {listingCategoriesId ? (
          <View href={`/admin/create-category-by-search/${id}`} />
        ) : (
          <Moderate href={`/admin/create-category-by-search/${id}`} />
        )}
      </td>
    </tr>
  );
};

export default TableItem;
