import Link from "next/link";
import { timeConverter } from "../../../utils";
import Edit from "../FastActions/Edit";

const TableItem = ({ id, userName, userEmail, userId, createdAt }) => {
  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div>
          <Link href={`/admin/users/edit/${userId}`}>{userName}</Link>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div>
          <Link href={`/admin/users/edit/${userId}`}>{userEmail}</Link>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium text-sky-500">
          <div>{timeConverter(createdAt)}</div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="flex text-left">
          <Edit href={`/admin/user-verify-requests/${id}`} />
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
