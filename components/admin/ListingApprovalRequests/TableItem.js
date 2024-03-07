import Link from "next/link";
import { timeConverter } from "../../../utils";
import View from "../FastActions/View";
import Moderate from "../FastActions/Moderate";
import Tooltip from "../Tooltip";

const ActiveSpan = ({ active }) => {
  const text = active ? "YES" : "NO";
  let dopClass = active
    ? "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
    : "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";

  return (
    <div
      className={`cursor-pointer text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1`}
    >
      <Tooltip
        title={
          active
            ? "The instrument is approved, so it can be rented"
            : "The tool is not approved, so it cannot be rented"
        }
      >
        {text}
      </Tooltip>
    </div>
  );
};

const TableItem = ({
  id,
  name,
  city,
  userName,
  userId,
  categoryName,
  categoryId,
  approved,
  createdAt,
}) => {
  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div>
          <Link href={`/admin/listing-approval-requests/${id}`}>{name}</Link>
        </div>
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium">{city}</div>
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div>
          <Link href={`/admin/user-edit/${userId}`}>{userName}</Link>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium">{categoryName}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <ActiveSpan active={approved} />
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-sky-500">
          <div>{timeConverter(createdAt)}</div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex text-left">
          {approved === null ? (
            <Moderate href={`/admin/listing-approval-requests/${id}`} />
          ) : (
            <View href={`/admin/listing-approval-requests/${id}`} />
          )}
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
