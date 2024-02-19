import Link from "next/link";
import { timeConverter, getFilenameByPath } from "../../../utils";

const StatusSpan = ({ status }) => {
  let className = "font-medium text-left";

  if (status) {
    className += " text-emerald-500";
  } else {
    className += " text-rose-500";
  }

  return <div className={className}>{status ? "Success" : "Failed"}</div>;
};

const TableItem = ({
  id,
  userId,
  userEmail,
  userRole,
  eventName,
  createdAt,
}) => {
  return (
    <tr
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium">{eventName}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium">
          <Link href={`/admin/user-edit/${userId}`}>{userEmail}</Link>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium">{userRole}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-sky-500">
          <div className="font-medium">{timeConverter(createdAt)}</div>
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
