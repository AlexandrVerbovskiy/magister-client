import Link from "next/link";
import View from "../FastActions/View";
import Tooltip from "../Tooltip";
import TableDateView from "../../admin/TableDateView";
import ShowMore from "../FastActions/ShowMore";
import { useContext, useState } from "react";
import SubInfoRow from "../SubInfoRow";
import SubInfoTitle from "../SubInfoTitle";
import { IndiceContext } from "../../../contexts";
import STATIC from "../../../static";
import { getFilePath, getListingImageByType } from "../../../utils";

const ActiveSpan = ({ active }) => {
  const text = active === null ? "WAITING" : active ? "APPROVED" : "REJECTED";

  let dopClass =
    active === null
      ? "bg-gray-100 dark:bg-gray-500/30 text-gray-500"
      : active
      ? "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
      : "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";

  return (
    <div
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1`}
    >
      <Tooltip
        title={
          active === null
            ? "The request hasn't answer, so tool cannot be rented"
            : active
            ? "The instrument is approved, so it can be rented"
            : "The tool is not approved, so it cannot be rented"
        }
      >
        <span className="overflow-separate flex justify-center">{text}</span>
      </Tooltip>
    </div>
  );
};

const TableItem = ({
  id,
  name,
  city,
  categoryName,
  categoryId,
  approved,
  createdAt,
  address,
  userId,
  userName,
  userEmail,
  userPhoto,
  userPhone,
  images,
  listingId,
  pricePerDay,
  countStoredItems,
  minRentalDays,
  openPopupImage,
  handleApproveClick,
  handleRejectClick,
}) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const { sessionUser, isAdmin } = useContext(IndiceContext);

  const canMoveToUser = isAdmin && sessionUser?.id != userId;

  const fullOwnerPhotoPath = userPhoto
    ? getFilePath(userPhoto)
    : STATIC.DEFAULT_PHOTO_LINK;

  const fullListingPhotoPath = images[0]
    ? getListingImageByType(images[0].link, images[0].type)
    : STATIC.DEFAULT_PHOTO_LINK;

  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-sky-500">#{id}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div>
            <Link href={`/admin/listing-approval-requests/${id}`}>{name}</Link>
          </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <Link
            href={`/admin/users/edit/${userId}`}
            className="flex items-center"
            onClick={(e) => (canMoveToUser ? {} : e.preventDefault())}
            style={canMoveToUser ? {} : { cursor: "auto" }}
          >
            <img
              className="w-8 h-8 rounded-full mr-1"
              src={fullOwnerPhotoPath}
              width="32"
              height="32"
              alt="User"
            />
            {userName}
          </Link>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium">{categoryName}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <ActiveSpan active={approved} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <TableDateView date={createdAt} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="flex text-left">
            <ShowMore
              showMoreClick={() => setDescriptionOpen(!descriptionOpen)}
              showMore={descriptionOpen}
              ariaControls={`request-${id}`}
            />
          </div>
        </td>
      </tr>

      <tr
        id={`request-${id}`}
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
            <SubInfoTitle
              title="Item Details"
              href={"/admin/listings/edit/" + listingId}
            />
            <SubInfoRow label="Name" value={name} />
            <SubInfoRow label="Category" value={categoryName} />
            <SubInfoRow label="Location" value={address} />
            <SubInfoRow label="Price Per Day" value={pricePerDay} />
            <SubInfoRow label="Count Stored" value={countStoredItems} />
            <SubInfoRow label="Min Rental Days" value={minRentalDays} />
          </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap align-top overflow-separate border-r">
          <div>
            <span className="font-semibold flex items-center">Item Photo</span>

            <div
              className="mt-2 p-1 outline-gray-200 outline-dashed"
              style={{ width: "150px", height: "200px" }}
            >
              <div
                className="image-box cursor-zoom-in"
                onClick={() => openPopupImage(fullListingPhotoPath)}
              >
                <img
                  src={fullListingPhotoPath}
                  alt="image"
                  width="200px"
                  height="200px"
                />
              </div>
            </div>
          </div>
        </td>

        <td
          colSpan={4}
          className="last:pr-5 whitespace-nowrap align-top overflow-separate border-r"
          style={{ height: 0 }}
        >
          <table className="w-full h-full table-fixed">
            <thead>
              <tr>
                <th style={{ width: "60%", padding: 0 }}></th>
                <th style={{ width: "40%", padding: 0 }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
                  <div>
                    <SubInfoTitle
                      title="Owner"
                      href={"/admin/users/edit/" + userId}
                      canMove={canMoveToUser}
                    />
                    <SubInfoRow label="Name" value={userName} />
                    <SubInfoRow label="Email" value={userEmail} />
                    <SubInfoRow
                      label="Phone"
                      value={
                        userPhone && userPhone.length ? userPhone.length : "-"
                      }
                    />
                    <SubInfoRow label="Rating" value={0} />
                  </div>
                </td>
                <td className="px-2 last:pr-5 py-3 whitespace-nowrap overflow-separate">
                  <div className="flex text-left gap-2 flex-wrap">
                    {approved === null && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveClick(listingId);
                          }}
                          className="bg-emerald-100 hover:bg-emerald-200 flex items-center text-emerald-500 hover:text-emerald-600 rounded-full py-2 px-4"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectClick(listingId);
                          }}
                          className="bg-rose-100 hover:bg-rose-200  flex items-center text-rose-500 hover:text-rose-600 rounded-full py-2 px-4"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <View href={`/admin/listing-approval-requests/${id}`} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </>
  );
};

export default TableItem;
