import Link from "next/link";
import View from "../FastActions/View";
import Tooltip from "../Tooltip";
import TableDateView from "../TableDateView";
import ShowMore from "../FastActions/ShowMore";
import { useContext, useState } from "react";
import SubInfoRow from "../SubInfoRow";
import SubInfoTitle from "../SubInfoTitle";
import { IndiceContext } from "../../../contexts";
import STATIC from "../../../static";
import { getFilePath } from "../../../utils";
import ActiveSpan from "../Comments/ActiveSpan";

const TableItem = ({
  id,
  description,

  quality,
  listingAccuracy,
  utility,
  condition,
  performance,
  location,

  userId,
  userName,
  userEmail,
  userPhone,
  userPhoto,

  approved,
  waitingAdmin,
  createdAt,
  reviewerId,
  reviewerName,
  reviewerEmail,
  reviewerPhone,
  reviewerPhoto,
  openPopupImage,
  handleApproveClick,
  handleRejectClick,
  userColumnTitle,
}) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const { sessionUser, isAdmin } = useContext(IndiceContext);

  const canMoveToReviewer = isAdmin && sessionUser?.id != reviewerId;
  const canMoveToUser = isAdmin && sessionUser?.id != userId;

  const fullReviewerPhotoPath = reviewerPhoto
    ? getFilePath(reviewerPhoto)
    : STATIC.DEFAULT_PHOTO_LINK;

  const fullUserPhotoPath = userPhoto
    ? getFilePath(userPhoto)
    : STATIC.DEFAULT_PHOTO_LINK;

  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-sky-500">#{id}</div>
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
                src={fullUserPhotoPath}
                width="32"
                height="32"
                alt="User"
              />
              {userName}
            </Link>
          </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div>
            <Link
              href={`/admin/users/edit/${reviewerId}`}
              className="flex items-center"
              onClick={(e) => (canMoveToReviewer ? {} : e.preventDefault())}
              style={canMoveToReviewer ? {} : { cursor: "auto" }}
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
                <th style={{ width: "25%", padding: 0 }}></th>
                <th style={{ width: "25%", padding: 0 }}></th>
                <th style={{ width: "30%", padding: 0 }}></th>
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
                    <SubInfoRow label="Rating" value={0} />
                  </div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
                  <div>
                    <SubInfoTitle
                      title={userColumnTitle}
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
                <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
                  <div>
                    <div className="font-semibold flex items-center">
                      Review Info
                    </div>
                    <SubInfoRow label="Quality" value={quality} />
                    <SubInfoRow
                      label="Listing Accuracy"
                      value={listingAccuracy}
                    />
                    <SubInfoRow label="Utility" value={utility} />
                    <SubInfoRow label="Condition" value={condition} />
                    <SubInfoRow label="Performance" value={performance} />
                    <SubInfoRow label="Location" value={location} />
                    <SubInfoRow
                      label="Average"
                      value={(
                        (quality +
                          listingAccuracy +
                          utility +
                          condition +
                          performance +
                          location) /
                        6
                      ).toFixed(2)}
                    />
                    <div style={{ textWrap: "wrap" }}>
                      Description: {description}
                    </div>
                  </div>
                </td>
                <td className="last:pr-5 px-2 py-3 whitespace-nowrap overflow-separate">
                  <div className="flex text-left gap-2 flex-wrap">
                    {waitingAdmin && (
                      <>
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
                      </>
                    )}
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
