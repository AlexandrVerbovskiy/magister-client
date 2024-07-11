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
import {
  generateProfileFilePath,
  getFilePath,
  getListingImageByType,
} from "../../../utils";
import ActiveSpan from "../Comments/ActiveSpan";
import SubInfoRowWithChild from "../SubInfoRowWithChild";
import SingleRatingStar from "../SingleRatingStar";

const TableItem = ({
  id,
  description,
  punctuality,
  generalExperience,
  communication,
  reliability,
  kindness,
  flexibility,
  approved,
  waitingAdmin,
  createdAt,
  orderId,
  reviewerId,
  reviewerName,
  reviewerEmail,
  reviewerPhone,
  reviewerPhoto,
  listingId,
  listingName,
  listingCity,
  listingPricePerDay,
  listingMinRentalDays,
  listingCountStoredItems,
  listingCategoryId,
  listingCategoryName = null,
  listingOtherCategory = null,
  images,
  openPopupImage,
  handleApproveClick,
  handleRejectClick,
  reviewerAverageRating,
  reviewerCommentCount,
  listingAverageRating,
  listingCommentCount,
  rejectedDescription = null,
}) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const { sessionUser, isAdmin } = useContext(IndiceContext);

  const canMoveToUser = isAdmin && sessionUser?.id != reviewerId;

  const fullReviewerPhotoPath = generateProfileFilePath(reviewerPhoto);

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
            <Link href={`/admin/listings/edit/${listingId}`}>
              {listingName}
            </Link>
          </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div>
            <Link
              href={`/admin/users/edit/${reviewerId}`}
              className="flex items-center"
              onClick={(e) => (canMoveToUser ? {} : e.preventDefault())}
              style={canMoveToUser ? {} : { cursor: "auto" }}
            >
              <img
                className="w-8 h-8 rounded-full mr-1"
                src={fullReviewerPhotoPath}
                width="32"
                height="32"
                alt="Reviewer"
              />
              {reviewerName}
            </Link>
          </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <ActiveSpan approved={approved} waitingAdmin={waitingAdmin} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <TableDateView date={createdAt} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="flex text-left">
            <ShowMore
              showMoreClick={() => setDescriptionOpen(!descriptionOpen)}
              showMore={descriptionOpen}
              ariaControls={`review-${id}`}
            />
          </div>
        </td>
      </tr>

      <tr
        id={`review-${id}`}
        role="region"
        className={`${
          !descriptionOpen && "hidden"
        }  bg-slate-50 dark:bg-slate-900/30 dark:text-slate-400`}
      >
        <td colSpan={6} style={{ height: 0 }}>
          <table className="w-full h-full table-fixed">
            <thead>
              <tr>
                <th style={{ width: "20%", padding: 0 }}></th>
                <th style={{ width: "20%", padding: 0 }}></th>
                <th style={{ width: "20%", padding: 0 }}></th>
                <th style={{ width: "20%", padding: 0 }}></th>
                <th style={{ width: "20%", padding: 0 }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
                  <div>
                    <SubInfoTitle
                      title="Reviewer"
                      href={"/admin/users/edit/" + reviewerId}
                      canMove={canMoveToUser}
                    />
                    <SubInfoRow label="Name" value={reviewerName} />
                    <SubInfoRow label="Email" value={reviewerEmail} />
                    <SubInfoRow
                      label="Phone"
                      value={
                        reviewerPhone && reviewerPhone.length
                          ? reviewerPhone.length
                          : "-"
                      }
                    />
                    <SubInfoRowWithChild label="Rating">
                      <SingleRatingStar
                        value={reviewerAverageRating}
                        count={reviewerCommentCount}
                      />
                    </SubInfoRowWithChild>
                  </div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
                  <div>
                    <SubInfoTitle
                      title="Item Details"
                      href={"/listings/" + listingId}
                    />
                    <SubInfoRow label="Name" value={listingName} />
                    <SubInfoRow
                      label="Category"
                      value={listingCategoryName ?? listingOtherCategory}
                    />
                    <SubInfoRow
                      label="Price Per Day"
                      value={listingPricePerDay}
                    />
                    <SubInfoRow
                      label="Count Stored"
                      value={listingCountStoredItems}
                    />
                    <SubInfoRow
                      label="Minimum Rental Days"
                      value={listingMinRentalDays ?? "-"}
                    />

                    <SubInfoRowWithChild label="Rating">
                      <SingleRatingStar
                        value={listingAverageRating}
                        count={listingCommentCount}
                      />
                    </SubInfoRowWithChild>
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
                  <div>
                    <span className="font-semibold flex items-center">
                      Item Photo
                    </span>

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
                <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
                  <div>
                    <div className="font-semibold flex items-center">
                      Review Info
                    </div>
                    <SubInfoRow label="Punctuality" value={punctuality} />
                    <SubInfoRow
                      label="General Experience"
                      value={generalExperience}
                    />
                    <SubInfoRow label="Communication" value={communication} />
                    <SubInfoRow label="Reliability" value={reliability} />
                    <SubInfoRow label="Kindness" value={kindness} />
                    <SubInfoRow label="Flexibility" value={flexibility} />
                    <SubInfoRow
                      label="Average"
                      value={(
                        (flexibility +
                          communication +
                          kindness +
                          reliability +
                          generalExperience +
                          punctuality) /
                        6
                      ).toFixed(2)}
                    />
                    <div style={{ textWrap: "wrap" }}>
                      Description: {description}
                    </div>
                  </div>
                </td>
                {waitingAdmin ? (
                  <td className="last:pr-5 px-2 py-3 whitespace-nowrap overflow-separate">
                    <div className="flex text-left gap-2 flex-wrap">
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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectClick(id);
                        }}
                        className="bg-rose-100 hover:bg-rose-200  flex items-center text-rose-500 hover:text-rose-600 rounded-full py-2 px-4"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                ) : (
                  <td className="last:pr-5 px-2 py-3 whitespace-nowrap overflow-separate align-top">
                    <div className="flex text-left gap-2 flex-wrap">
                      {approved ? (
                        <></>
                      ) : (
                        <SubInfoRowWithChild label="Reject description">
                          <div>{rejectedDescription}</div>
                        </SubInfoRowWithChild>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </>
  );
};

export default TableItem;
