import React, { useContext, useState } from "react";
import Tooltip from "../../../components/admin/Tooltip";
import View from "../FastActions/View";
import Edit from "../FastActions/Edit";
import ShowMore from "../FastActions/ShowMore";
import { IndiceContext } from "../../../contexts";
import Link from "next/link";
import STATIC from "../../../static";
import { getListingImageByType } from "../../../utils";
import SubInfoTitle from "../SubInfoTitle";
import SubInfoRow from "../SubInfoRow";
import SubInfoRowWithChild from "../SubInfoRowWithChild";
import SingleRatingStar from "../SingleRatingStar";
import TableUserLink from "../TableUserLink";

const ActiveSpan = ({ active, activeText, inactiveText, onClick = null }) => {
  const text = active ? "YES" : "NO";
  let dopClass = active
    ? "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
    : "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1`}
      style={onClick ? { cursor: "pointer" } : {}}
      onClick={handleClick}
    >
      <Tooltip title={active ? activeText : inactiveText}>
        <span className="overflow-separate">{text}</span>
      </Tooltip>
    </div>
  );
};

const TableItem = ({
  id,
  name,
  city,
  ownerId,
  ownerName,
  ownerEmail,
  ownerPhoto,
  ownerPhone,
  categoryName,
  otherCategory,
  countStoredItems,
  pricePerDay,
  approved,
  active,
  onClickDelete,
  onChangeActive,
  images,
  address,
  minRentalDays,
  ownerAverageRating,
  ownerCommentCount,
  openPopupImage,
}) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const { sessionUser, isAdmin } = useContext(IndiceContext);

  const fullListingPhotoPath = images[0]
    ? getListingImageByType(images[0].link, images[0].type)
    : STATIC.DEFAULTS.PHOTO_LINK;

  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-sky-500">#{id}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <Link
            href={`/admin/listings/edit/${id}/`}
            className="flex items-center"
          >
            {name}
          </Link>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <TableUserLink id={ownerId} name={ownerName} photo={ownerPhoto} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          {categoryName ?? otherCategory}
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <ActiveSpan
            active={approved}
            activeText="The instrument is approved, so it can be rented"
            inactiveText="The tool is not approved, so it cannot be rented"
          />
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <ActiveSpan
            active={active}
            activeText="Users can view it"
            inactiveText="Users can't view it"
            onClick={onChangeActive}
          />
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="flex text-left">
            <ShowMore
              showMoreClick={() => setDescriptionOpen(!descriptionOpen)}
              showMore={descriptionOpen}
              ariaControls={`listing-${id}`}
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
              href={`/admin/listings/edit/${id}`}
            />
            <SubInfoRow label="Name" value={name} />
            <SubInfoRow
              label="Category"
              value={categoryName ?? otherCategory}
            />
            <SubInfoRow label="Location" value={address} />
            <SubInfoRow label="Price Per Day" value={pricePerDay} />
            <SubInfoRow label="Count Stored" value={countStoredItems} />
            <SubInfoRow
              label="Minimum Rental Days"
              value={minRentalDays || "-"}
            />
            <SubInfoRowWithChild label="Rating">
              <SingleRatingStar
                value={ownerAverageRating}
                count={ownerCommentCount}
              />
            </SubInfoRowWithChild>
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
          colSpan={2}
          className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r"
        >
          <div>
            <SubInfoTitle
              title="Owner"
              href={`/admin/users/edit/${ownerId}`}
              canMove={sessionUser?.id != ownerId}
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
                count={ownerCommentCount}
                commentName="owner"
              />
            </SubInfoRowWithChild>
          </div>
        </td>

        <td
          colSpan={2}
          className="last:pr-5 px-2 py-3 whitespace-nowrap overflow-separate align-top"
        >
          <div className="flex items-center justify-start gap-2 flex-wrap">
            <View href={`/listings/${id}/`} />
            <Edit href={`/admin/listings/edit/${id}/`} />
          </div>
        </td>
      </tr>
    </>
  );
};

export default TableItem;
