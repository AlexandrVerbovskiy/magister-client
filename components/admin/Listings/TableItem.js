import React, { useState } from "react";
import Tooltip from "../../../components/admin/Tooltip";
import View from "../FastActions/View";
import Edit from "../FastActions/Edit";
import Delete from "../FastActions/Delete";
import ShowMore from "../FastActions/ShowMore";

const ActiveSpan = ({ active, activeText, inactiveText, onClick = null }) => {
  const text = active ? "YES" : "NO";
  let dopClass = active
    ? "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
    : "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1`}
      style={onClick ? { cursor: "pointer" } : {}}
      onClick={handleClick}
    >
      <Tooltip title={active ? activeText : inactiveText}>
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
  active,
  onClickDelete,
  onChangeActive,
}) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  return (
    <>
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
          <ActiveSpan
            active={approved}
            activeText="The instrument is approved, so it can be rented"
            inactiveText="The tool is not approved, so it cannot be rented"
          />
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <ActiveSpan
            active={active}
            activeText="Users can rent it"
            inactiveText="Users can't rent it"
            onClick={onChangeActive}
          />
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="flex text-left">
            <ShowMore
              showMoreClick={() => setDescriptionOpen(!descriptionOpen)}
              showMore={descriptionOpen}
              ariaControls={`listing-${id}`}
            />
          </div>
        </td>
      </tr>

      <tr
        id={`listing-${id}`}
        role="region"
        className={`${!descriptionOpen && "hidden"}`}
      >
        <td colSpan="6" className="px-2 first:pl-5 last:pr-5 py-3">
          <div className="flex items-center bg-slate-50 dark:bg-slate-900/30 dark:text-slate-400 p-3 -mt-3">
            <svg className="w-4 h-4 shrink-0 fill-current text-slate-400 dark:text-slate-500 mr-2">
              <path d="M1 16h3c.3 0 .5-.1.7-.3l11-11c.4-.4.4-1 0-1.4l-3-3c-.4-.4-1-.4-1.4 0l-11 11c-.2.2-.3.4-.3.7v3c0 .6.4 1 1 1zm1-3.6l10-10L13.6 4l-10 10H2v-1.6z" />
            </svg>
            <div className="italic">Test</div>
          </div>
          {/*<div className="mr-2 flex items-center">
        <View href={`/listing/${id}`} />
      </div>

      <div className="mr-2 flex items-center">
        <Edit href={`/admin/listings/edit/${id}`} />
      </div>*/}
        </td>
      </tr>
    </>
  );
};

export default TableItem;
