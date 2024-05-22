import Link from "next/link";
import View from "../FastActions/View";
import { moneyFormat, timeConverter } from "../../../utils";

const TypeSpan = ({ type }) => {
  let dopClass =
    "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400";
  let text = "Card";

  if (type == "paypal") {
    dopClass =
      "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400";
    text = "Paypal";
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
  money,
  type,
  createdAt,
  recipientId,
  recipientName,
  data,
}) => {
  let recipientNumber = "-";

  if (data) {
    if (type == "paypal") {
      recipientNumber = data.paypalId;
    }

    if (type == "card") {
      recipientNumber = data.cardNumber;
    }
  }

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <Link href={`/admin/users/edit/${recipientId}`}>{recipientName}</Link>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium">${moneyFormat(money)}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <TypeSpan type={type} />
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {recipientNumber}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium text-sky-500 overflow-separate">
          <div>{timeConverter(createdAt)}</div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="mr-2 flex items-center">
          <View href={`/admin/payments/waiting-refunds/${id}`} />
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
