import Delete from "../FastActions/Delete";
import View from "../FastActions/View";
import Status from "./Status";
import CancelStatus from "./CancelStatus";
import { useState } from "react";
import ShowMore from "../FastActions/ShowMore";

const TableItem = ({
  id,
  listingName,
  tenantName,
  ownerName,
  status,
  cancelStatus,
  onDeleteClick,
}) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-sky-500">#{id}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          {listingName}
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          {tenantName}
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          {ownerName}
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          {cancelStatus ? (
            <CancelStatus
              status={cancelStatus}
              baseClass="px-2 rounded shadow-2xl w-max"
            />
          ) : (
            <Status status={status} baseClass="px-2 rounded shadow-2xl w-max" />
          )}
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="flex text-left">
            <ShowMore
              showMoreClick={() => setDescriptionOpen(!descriptionOpen)}
              showMore={descriptionOpen}
              ariaControls={`booking-${id}`}
            />
          </div>
        </td>
      </tr>

      <tr
        id={`booking-${id}`}
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
          {/*            <div className="mr-2 flex items-center">
              <View href={`/admin/bookings/${id}`} />
            </div>

            <Delete onDeleteClick={onDeleteClick} />*/}
        </td>
      </tr>
    </>
  );
};

export default TableItem;
