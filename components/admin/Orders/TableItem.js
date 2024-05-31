import { useContext, useState } from "react";
import Delete from "../FastActions/Delete";
import View from "../FastActions/View";
import CancelStatus from "./CancelStatus";
import Status from "./Status";
import ShowMore from "../FastActions/ShowMore";
import TableDateView from "../../admin/TableDateView";
import { getDaysDifference } from "../../../utils";
import Link from "next/link";
import { IndiceContext } from "../../../contexts";
import SubInfoRow from "../SubInfoRow";

const ItemTitle = ({ title, href, canMove = true }) => {
  return (
    <Link
      href={href}
      className="font-semibold flex items-center"
      onClick={(e) => (canMove ? {} : e.preventDefault())}
      style={canMove ? {} : { cursor: "auto" }}
    >
      {title}
      <svg
        width="19"
        height="18"
        viewBox="0 0 19 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ml-1"
      >
        <path
          d="M10.6875 7.875L16.625 2.25M16.625 2.25H12.6667M16.625 2.25V6M16.625 10.5V14.25C16.625 14.6478 16.4582 15.0294 16.1613 15.3107C15.8643 15.592 15.4616 15.75 15.0417 15.75H3.95833C3.53841 15.75 3.13568 15.592 2.83875 15.3107C2.54181 15.0294 2.375 14.6478 2.375 14.25V3.75C2.375 3.35218 2.54181 2.97064 2.83875 2.68934C3.13568 2.40804 3.53841 2.25 3.95833 2.25H7.91667"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
};

const TableItem = (props) => {
  const {
    id,
    listingName,
    tenantName,
    tenantEmail,
    tenantPhone,
    ownerName,
    ownerEmail,
    ownerPhone,
    listingId,
    tenantId,
    ownerId,
    status,
    cancelStatus,
    onDeleteClick,
    offerStartDate,
    offerEndDate,
    offerPricePerDay,
    listingAddress,
    listingCategoryName,
    payedType,
    payedAdminApproved,
  } = props;

  const { sessionUser } = useContext(IndiceContext);

  const [descriptionOpen, setDescriptionOpen] = useState(false);

  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-sky-500">#{id}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          {listingName}
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <TableDateView date={offerStartDate} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <TableDateView date={offerEndDate} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-green-600">
            $
            {getDaysDifference(offerStartDate, offerEndDate) * offerPricePerDay}
          </div>
        </td>
        <td>
          {cancelStatus ? (
            <CancelStatus
              status={cancelStatus}
              baseClass="px-3 rounded-full shadow-2xl w-max"
            />
          ) : (
            <Status
              status={status}
              baseClass="px-3 rounded-full shadow-2xl w-max"
            />
          )}
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
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
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r">
          <div>
            <ItemTitle
              title="Item Details"
              href={"/admin/listings/edit/" + listingId}
            />
            <SubInfoRow label="Name" value={listingName} />
            <SubInfoRow label="Category" value={listingCategoryName} />
            <SubInfoRow label="Location" value={listingAddress} />
            <SubInfoRow label="Times rented" value={0} />
            <SubInfoRow label="Rating" value={0} />
          </div>
        </td>

        <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
          <div>
            <ItemTitle
              title="Owner"
              href={"/admin/users/edit/" + ownerId}
              canMove={sessionUser.id != ownerId}
            />
            <SubInfoRow label="Name" value={ownerName} />
            <SubInfoRow label="Email" value={ownerEmail} />
            <SubInfoRow
              label="Phone"
              value={ownerPhone.length ? ownerPhone.length : "-"}
            />
            <SubInfoRow label="Rating" value={0} />
          </div>
        </td>

        <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
          <div>
            <ItemTitle
              title="Renter"
              href={"/admin/users/edit/" + tenantId}
              canMove={sessionUser.id != tenantId}
            />
            <SubInfoRow label="Name" value={tenantName} />
            <SubInfoRow label="Email" value={tenantEmail} />
            <SubInfoRow
              label="Phone"
              value={tenantPhone.length ? tenantPhone : "-"}
            />
            <SubInfoRow label="Rating" value={0} />
          </div>
        </td>

        <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
          <div>
            <div className="font-semibold">Item checklist</div>
          </div>
        </td>

        <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
          <div>
            <div className="font-semibold">Payment</div>
            <SubInfoRow
              label="Method"
              value={
                payedType == "paypal"
                  ? "Paypal"
                  : payedType == "credit-card"
                  ? "Transfer"
                  : "-"
              }
            />
            <div className="mt-1 flex">
              <span className="text-black">Status: </span>{" "}
              {payedAdminApproved ? (
                <div
                  className={`ml-1 px-3 rounded-full shadow-2xl bg-emerald-100 text-emerald-500`}
                >
                  Yes
                </div>
              ) : (
                <div
                  className={`ml-1 px-3 rounded-full shadow-2xl bg-rose-100 text-rose-500`}
                >
                  No
                </div>
              )}
            </div>
          </div>
        </td>

        <td
          colSpan={2}
          className="last:pr-5 px-2 py-3 whitespace-nowrap overflow-separate align-top"
        >
          <div className="flex items-center justify-start gap-2 flex-wrap">
            <View href={`/admin/orders/${id}`} />
            <Delete onDeleteClick={onDeleteClick} />
          </div>
        </td>
      </tr>
    </>
  );
};

export default TableItem;
