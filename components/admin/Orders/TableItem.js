import { useContext, useState } from "react";
import Delete from "../FastActions/Delete";
import View from "../FastActions/View";
import CancelStatus from "./CancelStatus";
import Status from "./Status";
import ShowMore from "../FastActions/ShowMore";
import TableDateView from "../../admin/TableDateView";
import { getDaysDifference } from "../../../utils";
import { IndiceContext } from "../../../contexts";
import SubInfoRow from "../SubInfoRow";
import SubInfoTitle from "../SubInfoTitle";

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
    listingRentalCount,
    orderCheckLists,
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
            <SubInfoTitle
              title="Item Details"
              href={"/admin/listings/edit/" + listingId}
            />
            <SubInfoRow label="Name" value={listingName} />
            <SubInfoRow label="Category" value={listingCategoryName} />
            <SubInfoRow label="Location" value={listingAddress} />
            <SubInfoRow label="Times rented" value={listingRentalCount} />
            <SubInfoRow label="Rating" value={0} />
          </div>
        </td>

        <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
          <div>
            <SubInfoTitle
              title="Owner"
              href={"/admin/users/edit/" + ownerId}
              canMove={sessionUser?.id != ownerId}
            />
            <SubInfoRow label="Name" value={ownerName} />
            <SubInfoRow label="Email" value={ownerEmail} />
            <SubInfoRow
              label="Phone"
              value={ownerPhone && ownerPhone.length ? ownerPhone.length : "-"}
            />
            <SubInfoRow label="Rating" value={0} />
          </div>
        </td>

        <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
          <div>
            <SubInfoTitle
              title="Renter"
              href={"/admin/users/edit/" + tenantId}
              canMove={sessionUser?.id != tenantId}
            />
            <SubInfoRow label="Name" value={tenantName} />
            <SubInfoRow label="Email" value={tenantEmail} />
            <SubInfoRow
              label="Phone"
              value={tenantPhone && tenantPhone.length ? tenantPhone : "-"}
            />
            <SubInfoRow label="Rating" value={0} />
          </div>
        </td>

        <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
          <div>
            <div className="font-semibold">Item checklist</div>

            <div
              className="mt-1"
              style={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >
              <span className="text-gray-400" style={{ textWrap: "wrap" }}>
                {orderCheckLists.length
                  ? orderCheckLists.map((check) => check).join(", ")
                  : "-"}
              </span>
            </div>
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
            {/*<Delete onDeleteClick={onDeleteClick} />*/}
          </div>
        </td>
      </tr>
    </>
  );
};

export default TableItem;
