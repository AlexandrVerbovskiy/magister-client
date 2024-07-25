import { getFilenameByPath } from "../../../utils";
import TableDateView from "../../admin/TableDateView";

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
  message,
  success,
  file,
  line,
  createdAt,
  onSelectPanelItem,
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
        <StatusSpan success={success} />
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div>{message}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium">{getFilenameByPath(file)}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium">{line}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <TableDateView date={createdAt} />
      </td>
    </tr>
  );
};

export default TableItem;
