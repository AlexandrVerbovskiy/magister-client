import Delete from "../FastActions/Delete";
import View from "../FastActions/View";
import Status from "./Status";

const TableItem = ({
  id,
  listingName,
  tenantName,
  ownerName,
  requestFactTotalPrice,
  factTotalPrice,
  status,
  onDeleteClick
}) => {
  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {listingName}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {tenantName}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {ownerName}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <Status status={status} baseClass="px-2 rounded shadow-2xl w-max"/>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        ${requestFactTotalPrice ?? factTotalPrice}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="flex text-left">
          <div className="mr-2 flex items-center">
            <View href={`/admin/bookings/${id}`} />
          </div>

          <Delete onDeleteClick={onDeleteClick} />
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
