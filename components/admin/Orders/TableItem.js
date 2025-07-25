import { useContext, useState } from "react";
import View from "../FastActions/View";
import CancelStatus from "./CancelStatus";
import Status from "./Status";
import ShowMore from "../FastActions/ShowMore";
import TableDateView from "../../admin/TableDateView";
import { getPaymentNameByType, moneyFormatVisual } from "../../../utils";
import { IndiceContext } from "../../../contexts";
import SubInfoRow from "../SubInfoRow";
import SubInfoTitle from "../SubInfoTitle";
import SingleRatingStar from "../SingleRatingStar";
import SubInfoRowWithChild from "../SubInfoRowWithChild";

const TableItem = (props) => {
  const {
    id,
    listingName,
    renterName,
    renterEmail,
    renterPhone,
    ownerName,
    ownerEmail,
    ownerPhone,
    listingId,
    renterId,
    ownerId,
    status,
    cancelStatus,
    offerStartDate,
    offerFinishDate,
    offerPrice,
    listingAddress,
    listingCategoryName = null,
    listingOtherCategory = null,
    payedType,
    payedAdminApproved,
    payedWaitingApproved,
    listingRentalCount,
    renterAverageRating,
    ownerAverageRating,
    renterCommentCount,
    ownerCommentCount,
    payedId,
  } = props;
  const { sessionUser, isAdmin } = useContext(IndiceContext);

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
          <TableDateView date={offerFinishDate} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-green-600">
            {moneyFormatVisual(offerPrice)}
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          {cancelStatus ? (
            <CancelStatus
              status={cancelStatus}
              baseClass="px-3 rounded-full shadow-2xl w-fit overflow-separate"
            />
          ) : (
            <Status
              status={status}
              payedId={payedId}
              payedAdminApproved={payedAdminApproved}
              payedWaitingApproved={payedWaitingApproved}
              baseClass="px-3 rounded-full shadow-2xl w-fit overflow-separate"
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
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap align-top overflow-separate border-r">
          <div>
            <SubInfoTitle
              title="Item Details"
              href={`/admin/listings/edit/${listingId}`}
              canMove={isAdmin}
            />
            <SubInfoRow label="Name" value={listingName} />
            <SubInfoRow
              label="Category"
              value={listingCategoryName ?? listingOtherCategory}
            />
            <SubInfoRow label="Location" value={listingAddress} />
            <SubInfoRow label="Times rented" value={listingRentalCount} />
            <SubInfoRowWithChild label="Rating">
              <SingleRatingStar
                value={ownerAverageRating}
                count={ownerCommentCount}
              />
            </SubInfoRowWithChild>
          </div>
        </td>

        <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
          <div>
            <SubInfoTitle
              title="Owner"
              href={`/admin/users/edit/${ownerId}`}
              canMove={isAdmin && sessionUser?.id != ownerId}
            />
            <SubInfoRow label="Name" value={ownerName} />
            <SubInfoRow label="Email" value={ownerEmail} />
            <SubInfoRow
              label="Phone"
              value={ownerPhone && ownerPhone.length ? ownerPhone.length : "-"}
            />
            <SubInfoRowWithChild label="Rating">
              <SingleRatingStar
                value={ownerAverageRating}
                ownerCommentCount={ownerCommentCount}
                commentName="owner"
              />
            </SubInfoRowWithChild>
          </div>
        </td>

        <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
          <div>
            <SubInfoTitle
              title="Renter"
              href={`/admin/users/edit/${renterId}`}
              canMove={isAdmin && sessionUser?.id != renterId}
            />
            <SubInfoRow label="Name" value={renterName} />
            <SubInfoRow label="Email" value={renterEmail} />
            <SubInfoRow
              label="Phone"
              value={renterPhone && renterPhone.length ? renterPhone : "-"}
            />
            <SubInfoRowWithChild label="Rating">
              <SingleRatingStar
                value={renterAverageRating}
                count={renterCommentCount}
                commentName="renter"
              />
            </SubInfoRowWithChild>
          </div>
        </td>

        <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
          <div>
            <div className="font-semibold">Payment</div>
            <SubInfoRow
              label="Method"
              value={getPaymentNameByType(payedType)}
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
            <View href={`/admin/orders/${id}/`} />
          </div>
        </td>
      </tr>
    </>
  );
};

export default TableItem;
