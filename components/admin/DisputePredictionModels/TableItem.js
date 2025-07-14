import Link from "next/link";
import TableDateView from "../../admin/TableDateView";

const StatusSpan = ({ started, stopped, finished }) => {
  let text = "Pending Started";
  let className = "bg-orange-100 text-orange-500";

  if (finished) {
    className += "bg-emerald-100 text-emerald-500";
    text = "Finished";
  }

  if (stopped) {
    className += "bg-rose-100 text-rose-500";
    text = "Stopped";
  }

  if (started) {
    className += "bg-yellow-100 text-yellow-500";
    text = "Started";
  }

  return <div className={className}>{text}</div>;
};

const TableItem = ({
  id,
  accuracy,
  active,
  started,
  stopped,
  finished,
  body,
  createdAt,
  onStopModelClick,
  onUnstopModelClick,
  onActivateModelClick,
}) => {
  return (
    <tr
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onSelectPanelItem(id);
      }}
    >
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <StatusSpan started={started} stopped={stopped} finished={finished} />
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div
          className={
            active
              ? "bg-emerald-100 text-emerald-500"
              : "bg-rose-100 text-rose-500"
          }
        >
          {active ? "Active" : "Not Active"}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium">
          {body.map((field) => field.pseudonym).join(", ")}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium">{accuracy ? `${accuracy}%` : "-"}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <TableDateView date={createdAt} />
      </td>
      <td>
        {!active && finished && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onActivateModelClick();
            }}
            className="bg-emerald-100 hover:bg-emerald-200 flex items-center text-emerald-500 hover:text-emerald-600 rounded-full py-2 px-4"
          >
            Activate
          </button>
        )}

        {!finished && !stopped && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStopModelClick();
            }}
            className="bg-emerald-100 hover:bg-emerald-200 flex items-center text-emerald-500 hover:text-emerald-600 rounded-full py-2 px-4"
          >
            Stop
          </button>
        )}

        {!finished && stopped && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUnstopModelClick();
            }}
            className="bg-rose-100 hover:bg-rose-200 flex items-center text-rose-500 hover:text-rose-600 rounded-full py-2 px-4"
          >
            Continue
          </button>
        )}

        <Link
          href={`/admin/dispute-predictions/create?id=${id}/`}
          className="bg-blue-100 hover:bg-blue-200 flex items-center text-blue-500 hover:text-blue-600 rounded-full py-2 px-4"
        >
          Clone
        </Link>

        {finished && (
          <Link
            href={`/admin/dispute-predictions/edit/${id}/`}
            className="bg-blue-100 hover:bg-blue-200 flex items-center text-blue-500 hover:text-blue-600 rounded-full py-2 px-4"
          >
            Edit
          </Link>
        )}
      </td>
    </tr>
  );
};

export default TableItem;
