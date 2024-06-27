import { useContext, useState } from "react";
import { IndiceContext } from "../../../contexts";
import STATIC from "../../../static";
import ShowMore from "../FastActions/ShowMore";
import LinkIcon from "../Icons/LinkIcon";
import SubInfoRow from "../SubInfoRow";
import SubInfoRowWithChild from "../SubInfoRowWithChild";
import TableDateView from "../TableDateView";
import {
  generateProfileFilePath,
  getListingImageByType,
} from "../../../utils";
import Link from "next/link";
import SubInfoTitle from "../SubInfoTitle";
import ActiveSpan from "./ActiveSpan";

const TableItem = ({
  ownerId,
  ownerName,
  ownerPhoto,
  ownerEmail,
  ownerPhone,
  tenantId,
  tenantName,
  tenantPhoto,
  tenantEmail,
  tenantPhone,
  listingId,
  listingName,
  id,
  images,
  offerStartDate,
  offerEndDate,
  createdAt,
  status,
  type,
  solution,
  description,
  handleSolveClick,
  handleUnsolveClick,
}) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const { sessionUser, isAdmin } = useContext(IndiceContext);

  const canMoveToOwner = isAdmin && sessionUser?.id != ownerId;
  const canMoveToTenant = isAdmin && sessionUser?.id != tenantId;

  const fullOwnerPhotoPath = generateProfileFilePath(ownerPhoto);

  const fullTenantPhotoPath = generateProfileFilePath(tenantPhoto);

  const fullListingPhotoPath = images[0]
    ? getListingImageByType(images[0].link, images[0].type)
    : STATIC.DEFAULT_PHOTO_LINK;

  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-sky-500">#{id}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <ActiveSpan status={status} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <Link
            href={`/admin/users/edit/${ownerId}`}
            className="flex items-center"
            onClick={(e) => (canMoveToOwner ? {} : e.preventDefault())}
            style={canMoveToOwner ? {} : { cursor: "auto" }}
          >
            <img
              className="w-8 h-8 rounded-full mr-1"
              src={fullOwnerPhotoPath}
              width="32"
              height="32"
              alt="User"
            />
            {ownerName} <LinkIcon />
          </Link>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <Link
            href={`/admin/users/edit/${tenantId}`}
            className="flex items-center"
            onClick={(e) => (canMoveToTenant ? {} : e.preventDefault())}
            style={canMoveToTenant ? {} : { cursor: "auto" }}
          >
            <img
              className="w-8 h-8 rounded-full mr-1"
              src={fullTenantPhotoPath}
              width="32"
              height="32"
              alt="User"
            />
            {tenantName} <LinkIcon />
          </Link>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <Link
            href={`/listing/${listingId}`}
            className="flex items-center"
            onClick={(e) => (isAdmin ? {} : e.preventDefault())}
            style={isAdmin ? {} : { cursor: "auto" }}
          >
            <img
              className="w-8 h-8 rounded-full mr-1"
              src={fullListingPhotoPath}
              width="32"
              height="32"
              alt="User"
            />
            {listingName} <LinkIcon />
          </Link>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <TableDateView date={offerStartDate} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <TableDateView date={offerEndDate} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <TableDateView date={createdAt} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="flex text-left">
            <ShowMore
              showMoreClick={() => setDescriptionOpen(!descriptionOpen)}
              showMore={descriptionOpen}
              ariaControls={`dispute-${id}`}
            />
          </div>
        </td>
      </tr>

      <tr
        id={`dispute-${id}`}
        role="region"
        className={`${
          !descriptionOpen && "hidden"
        }  bg-slate-50 dark:bg-slate-900/30 dark:text-slate-400`}
      >
        <td
          colSpan={2}
          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top"
        >
          <div>
            <span className="font-semibold flex items-center">Issue</span>
            <SubInfoRow value={STATIC.DISPUTE_TYPE_TITLE[type]} />

            {solution && (
              <>
                <span className="font-semibold flex items-center">
                  Solution
                </span>
                <SubInfoRowWithChild>
                  <span className="text-emerald-600">{solution}</span>
                </SubInfoRowWithChild>
              </>
            )}
          </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
          <div>
            <SubInfoTitle
              title="Owner"
              href={"/admin/users/edit/" + ownerId}
              canMove={canMoveToOwner}
            />
            <SubInfoRow label="Name" value={ownerName} />
            <SubInfoRow label="Email" value={ownerEmail} />
            <SubInfoRow
              label="Phone"
              value={ownerPhone && ownerPhone.length ? ownerPhone.length : "-"}
            />
          </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
          <div>
            <SubInfoTitle
              title="Renter"
              href={"/admin/users/edit/" + tenantId}
              canMove={canMoveToTenant}
            />
            <SubInfoRow label="Name" value={tenantName} />
            <SubInfoRow label="Email" value={tenantEmail} />
            <SubInfoRow
              label="Phone"
              value={
                tenantPhone && tenantPhone.length ? tenantPhone.length : "-"
              }
            />
          </div>
        </td>

        <td
          colSpan={3}
          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top"
        >
          <div
            className="mt-1"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span className="text-black mr-1">Description:</span>
            <span className="text-gray-400" style={{ textWrap: "wrap" }}>
              {description}
            </span>
          </div>
        </td>

        <td
          colSpan={2}
          className="px-2 last:pr-5 py-3 whitespace-nowrap overflow-separate"
        >
          <div className="flex text-left gap-2 flex-wrap">
            {status != STATIC.DISPUTE_STATUSES.SOLVED && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSolveClick(id);
                }}
                className="bg-emerald-100 hover:bg-emerald-200 flex items-center text-emerald-500 hover:text-emerald-600 rounded-full py-2 px-4"
              >
                Solve
              </button>
            )}

            {status === STATIC.DISPUTE_STATUSES.OPEN && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnsolveClick(id);
                }}
                className="bg-rose-100 hover:bg-rose-200  flex items-center text-rose-500 hover:text-rose-600 rounded-full py-2 px-4"
              >
                Unsolve
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="bg-slate-100 hover:bg-slate-200  flex items-center text-dark-500 hover:text-dark-600 rounded-full py-2 px-4"
            >
              Chat
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default TableItem;
