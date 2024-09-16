import Link from "next/link";
import View from "../FastActions/View";

const TableItem = ({ index, otherCategoryName, listingsCount }) => {
  const editLink = `/admin/others-listing-categories/create/?name=${otherCategoryName}`;

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium text-sky-500">#{index}</div>
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <Link href={editLink}>{otherCategoryName}</Link>
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        {listingsCount}
      </td>

      <td className="last:pr-5 px-2 py-3 whitespace-nowrap overflow-separate align-top">
        <div className="flex items-center justify-start gap-2 flex-wrap">
          <View href={editLink} />
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
