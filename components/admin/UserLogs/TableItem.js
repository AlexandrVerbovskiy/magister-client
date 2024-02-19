import Link from "next/link";
import { timeConverter, getFilenameByPath } from "../../../utils";
import { useContext } from "react";
import { IndiceContext } from "../../../contexts";

const TableItem = ({
  id,
  userId,
  userEmail,
  userRole,
  eventName,
  createdAt,
}) => {
  const { user } = useContext(IndiceContext);

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium">{eventName}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium">
          {user.id != userId && (
            <Link href={`/admin/user-edit/${userId}`}>{userEmail}</Link>
          )}
          {user.id == userId && userEmail}
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
