import Link from "next/link";
import { useContext } from "react";
import { IndiceContext } from "../../../contexts";
import TableDateView from "../TableDateView";

const RoleSpan = ({ role }) => {
  let dopClassName =
    "bg-sky-100 dark:bg-sky-500/30 text-sky-600 dark:text-sky-400";
  let text = "User";

  if (role == "admin") {
    dopClassName =
      "bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400";
    text = "Admin";
  }

  if (role == "support") {
    dopClassName =
      "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";
    text = "Support";
  }

  return (
    <div
      className={`text-xs inline-flex font-medium  rounded-full text-center px-2.5 py-1 ${dopClassName}`}
    >
      {text}
    </div>
  );
};

const TableItem = ({
  id,
  userId,
  userEmail,
  userRole,
  eventName,
  createdAt,
}) => {
  const { sessionUser } = useContext(IndiceContext);

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {eventName}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {sessionUser?.id != userId && (
          <Link href={`/admin/users/edit/${userId}/`}>{userEmail}</Link>
        )}
        {sessionUser?.id == userId && userEmail}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-semibold">
          <RoleSpan role={userRole} />
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <TableDateView date={createdAt} />
      </td>
    </tr>
  );
};

export default TableItem;
