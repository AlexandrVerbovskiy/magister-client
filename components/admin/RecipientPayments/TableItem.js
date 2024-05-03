import Link from "next/link";
import TableDateView from "../TableDateView";
import STATIC from "../../../static";

const TypeSpan = ({ type }) => {
  let dopClass =
    "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400";
  let text = "Rental";

  if (type == "returned") {
    dopClass =
      "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400";
    text = "Refund";
  }

  return (
    <div
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1 overflow-separate`}
    >
      {text}
    </div>
  );
};

const StatusSpan = ({ status }) => {
  let dopClass =
    "bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400";
  let text = "Waiting";

  if (status == "failed") {
    dopClass =
      "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";
    text = "Failed";
  }

  if (status == "completed") {
    dopClass =
      "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400";
    text = "Completed";
  }

  if (status == "cancelled") {
    dopClass =
      "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400";
    text = "Cancelled";
  }

  return (
    <div
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1 overflow-separate`}
    >
      {text}
    </div>
  );
};

const TableItem = ({
  id,
  listingId,
  listingName,
  ownerId,
  ownerName,
  tenantId,
  tenantName,
  money,
  status,
  type,
  plannedTime,
  recipientId,
  recipientName,
  orderId,
}) => {
  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <Link href={`/admin/listings/${listingId}`}>{listingName}</Link>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <Link href={`/admin/users/edit/${ownerId}`}>{ownerName}</Link>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <Link href={`/admin/users/edit/${tenantId}`}>{tenantName}</Link>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <Link href={`/admin/users/edit/${recipientId}`}>{recipientName}</Link>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium">${money}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <TypeSpan type={type} />
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <StatusSpan status={status} />
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <TableDateView date={plannedTime} />
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <Link href={`/admin/orders/${orderId}`}>#{orderId}</Link>
      </td>
    </tr>
  );
};

export default TableItem;
