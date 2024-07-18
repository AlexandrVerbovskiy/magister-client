import Link from "next/link";
import View from "../FastActions/View";
import {
  generateProfileFilePath,
  getFilePath,
  moneyFormat,
} from "../../../utils";
import { IndiceContext } from "../../../contexts";
import { useContext, useState } from "react";
import STATIC from "../../../static";
import ShowMore from "../FastActions/ShowMore";
import SubInfoRow from "../SubInfoRow";
import SubInfoTitle from "../SubInfoTitle";

const TypeSpan = ({ type }) => {
  let dopClass =
    "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400";
  let text = "Rental";

  if (type == "returned") {
    dopClass =
      "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400";
    text = "Refund";
  }

  return (
    <div
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1 overflow-separate`}
    >
      {text}
    </div>
  );
};

const StatusSpan = ({ status }) => {
  let dopClass =
    "bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400";
  let text = "Waiting";

  if (status == "failed") {
    dopClass =
      "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";
    text = "Failed";
  }

  if (status == "completed") {
    dopClass =
      "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400";
    text = "Completed";
  }

  if (status == "cancelled") {
    dopClass =
      "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400";
    text = "Cancelled";
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
  tenantId,
  tenantName,
  tenantEmail,
  tenantPhone,
  tenantPhoto,
  money,
  status,
  recipientType,
  plannedTime,
  recipientId,
  recipientName,
  recipientEmail,
  recipientPhone,
  recipientPhoto,
  viewPath,
  listingId,
  listingName,
  listingAddress,
  listingCity,
  listingPricePerDay,
  listingMinRentalDays,
  listingCountStoredItems,
  handleApproveClick,
}) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const { sessionUser, isAdmin } = useContext(IndiceContext);

  const canMoveToTenant = isAdmin && sessionUser?.id != tenantId;
  const canMoveToRecipient = isAdmin && sessionUser?.id != recipientId;

  const fullRecipientPhotoPath = generateProfileFilePath(recipientPhoto);

  const fullTenantPhotoPath = generateProfileFilePath(tenantPhoto);

  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-sky-500">#{id}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <Link
            href={`/admin/users/edit/${tenantId}/`}
            onClick={(e) => (canMoveToTenant ? {} : e.preventDefault())}
            className="flex items-center"
          >
            <img
              className="w-8 h-8 rounded-full mr-1"
              src={fullTenantPhotoPath}
              width="32"
              height="32"
              alt="Renter"
            />
            {tenantName}
          </Link>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <Link
            href={`/admin/users/edit/${recipientId}/`}
            onClick={(e) => (canMoveToRecipient ? {} : e.preventDefault())}
            className="flex items-center"
          >
            <img
              className="w-8 h-8 rounded-full mr-1"
              src={fullRecipientPhotoPath}
              width="32"
              height="32"
              alt="Recipient"
            />
            {recipientName}
          </Link>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-green-600">
            ${moneyFormat(money)}
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <TypeSpan type={recipientType} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <StatusSpan status={status} />
        </td>
        <td>
          <div className="flex text-left">
            <ShowMore
              showMoreClick={() => setDescriptionOpen(!descriptionOpen)}
              showMore={descriptionOpen}
              ariaControls={`order-${id}`}
            />
          </div>
        </td>
      </tr>

      <tr
        id={`order-${id}`}
        role="region"
        className={`${
          !descriptionOpen && "hidden"
        }  bg-slate-50 dark:bg-slate-900/30 dark:text-slate-400`}
      >
        <td colSpan={5} className="overflow-separate border-r align-top">
          <table>
            <thead>
              <tr>
                <th style={{ width: "calc(100% / 3)", padding: 0 }}></th>
                <th style={{ width: "calc(100% / 3)", padding: 0 }}></th>
                <th style={{ width: "calc(100% / 3)", padding: 0 }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{ overflow: "hidden" }}
                  className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top"
                >
                  <SubInfoTitle
                    title="Renter"
                    href={`/admin/users/edit/${tenantId}`}
                    canMove={canMoveToRecipient}
                  />
                  <SubInfoRow label="Name" value={tenantName} />
                  <SubInfoRow label="Email" value={tenantEmail} />
                  <SubInfoRow
                    label="Phone"
                    value={
                      tenantPhone && tenantPhone.length ? tenantPhone : "-"
                    }
                  />
                </td>
                <td
                  style={{ overflow: "hidden" }}
                  className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top"
                >
                  <SubInfoTitle
                    title="Recipient"
                    href={`/admin/users/edit/${recipientId}`}
                    canMove={canMoveToRecipient}
                  />
                  <SubInfoRow label="Name" value={recipientName} />
                  <SubInfoRow label="Email" value={recipientEmail} />
                  <SubInfoRow
                    label="Phone"
                    value={
                      recipientPhone && recipientPhone.length
                        ? recipientPhone
                        : "-"
                    }
                  />
                </td>
                <td
                  style={{ overflow: "hidden" }}
                  className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate align-top"
                >
                  <SubInfoTitle
                    title="Item Details"
                    href={`/admin/listings/edit/${listingId}`}
                  />
                  <SubInfoRow label="Name" value={listingName} />
                  <SubInfoRow label="Address" value={listingAddress} />
                  <SubInfoRow label="City" value={listingCity} />
                  <SubInfoRow
                    label="Price Per Day"
                    value={listingPricePerDay}
                  />
                  <SubInfoRow
                    label="Minimum Rental Days"
                    value={listingMinRentalDays}
                  />
                  <SubInfoRow
                    label="Count Stored Items"
                    value={listingCountStoredItems}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        <td
          colSpan={2}
          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate"
        >
          <div className="flex text-left gap-2 flex-wrap">
            {status != "completed" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproveClick(id);
                }}
                className="bg-emerald-100 hover:bg-emerald-200 flex items-center text-emerald-500 hover:text-emerald-600 rounded-full py-2 px-4"
              >
                Accept
              </button>
            )}

            <View href={`/admin${viewPath}/${id}/`} />
          </div>
        </td>
      </tr>
    </>
  );
};

export default TableItem;
