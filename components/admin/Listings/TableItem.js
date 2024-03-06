import React, { useContext, useEffect, useState } from "react";
import Tooltip from "../../../components/admin/Tooltip";
import View from "../FastActions/View";
import Edit from "../FastActions/Edit";
import Delete from "../FastActions/Delete";

const ActiveSpan = ({ active, onClick }) => {
  const text = active ? "YES" : "NO";
  let dopClass = active
    ? "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
    : "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1`}
    >
      {text}
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
  onClickListingApprove,
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
        {city}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        {userName}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        {categoryName}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        {countStoredItems}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        {pricePerDay}
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <ActiveSpan onClick={onClickListingApprove} active={approved} />
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex text-left">
          <View href={`/listing/${id}`} />
          <Edit href={`/admin/listings-edit/${id}`} />
          <Delete onDeleteClick={onClickDelete} />
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
