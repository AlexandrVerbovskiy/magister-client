import Link from "next/link";
import TableDateView from "../TableDateView";
import STATIC from "../../../static";
import { moneyFormat } from "../../../utils";

const TableItem = ({
  id,
  orderId,
  listingId,
  listingName,
  ownerId,
  ownerName,
  payerId,
  payerName,
  money,
  createdAt,
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
        <Link href={`/admin/users/edit/${payerId}`}>{payerName}</Link>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium">${moneyFormat(money)}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <TableDateView date={createdAt} />
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <Link href={`/admin/orders/${orderId}`}>#{orderId}</Link>
      </td>
    </tr>
  );
};

export default TableItem;
