import React from "react";
import Tooltip from "../../../components/admin/Tooltip";
import View from "../FastActions/View";
import Edit from "../FastActions/Edit";
import Delete from "../FastActions/Delete";

const ActiveSpan = ({ active }) => {
  const text = active ? "YES" : "NO";
  let dopClass = active
    ? "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
    : "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";

  return (
    <div
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1`}
    >
      <Tooltip
        title={
          active
            ? "The instrument is approved, so it can be rented"
            : "The tool is not approved, so it cannot be rented"
        }
      >
        <span className="overflow-separate">{text}</span>
      </Tooltip>
    </div>
  );
};

const TableItem = ({
  id,
  name,
  city,
  userName,
  categoryName,
  countStoredItems,
  pricePerDay,
  approved,
  onClickDelete,
}) => {
  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {name}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {city}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {userName}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {categoryName}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {countStoredItems}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {pricePerDay}
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <ActiveSpan active={approved} />
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="flex text-left">
          <div className="mr-2 flex items-center">
            <View href={`/listing/${id}`} />
          </div>

          <div className="mr-2 flex items-center">
            <Edit href={`/admin/listings/edit/${id}`} />
          </div>

          <Delete onDeleteClick={onClickDelete} />
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
