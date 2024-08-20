import TableDateView from "../TableDateView";
import ShowMore from "../FastActions/ShowMore";
import { useContext, useState } from "react";
import SubInfoRow from "../SubInfoRow";
import SubInfoTitle from "../SubInfoTitle";
import { IndiceContext } from "../../../contexts";
import ActiveSpan from "../Comments/ActiveSpan";
import SingleRatingStar from "../SingleRatingStar";
import SubInfoRowWithChild from "../SubInfoRowWithChild";
import RatingInfoRow from "../RatingInfoRow";
import TableUserLink from "../TableUserLink";

const OwnerTableItem = ({
  id,
  description,

  itemDescriptionAccuracy,
  photoAccuracy,
  pickupCondition,
  cleanliness,
  responsiveness,
  clarity,
  schedulingFlexibility,
  issueResolution,

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

  reviewerAverageRating,
  userAverageRating,
  reviewerCommentCount,
  userCommentCount,

  rejectedDescription = null,
}) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const { sessionUser, isAdmin } = useContext(IndiceContext);

  const canMoveToReviewer = isAdmin && sessionUser?.id != reviewerId;
  const canMoveToUser = isAdmin && sessionUser?.id != userId;

  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-sky-500">#{id}</div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <TableUserLink
            id={userId}
            name={userName}
            photo={userPhoto}
          />
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <TableUserLink
            id={reviewerId}
            name={reviewerName}
            photo={reviewerPhoto}
            needPhoto={true}
          />
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
                      href={`/admin/users/edit/${reviewerId}`}
                      canMove={canMoveToReviewer}
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
                        commentName="renter"
                      />
                    </SubInfoRowWithChild>
                  </div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
                  <div>
                    <SubInfoTitle
                      title={userColumnTitle}
                      href={`/admin/users/edit/${userId}`}
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
                    <SubInfoRowWithChild label="Rating">
                      <SingleRatingStar
                        value={userAverageRating}
                        count={userCommentCount}
                      />
                    </SubInfoRowWithChild>
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap overflow-separate align-top border-r">
                  <div>
                    <div className="font-semibold flex items-center">
                      Review Info
                    </div>

                    <RatingInfoRow
                      label="Item description accuracy"
                      value={itemDescriptionAccuracy}
                    />
                    <RatingInfoRow
                      label="Photo accuracy"
                      value={photoAccuracy}
                    />
                    <RatingInfoRow
                      label="Pickup condition"
                      value={pickupCondition}
                    />
                    <RatingInfoRow label="Cleanliness" value={cleanliness} />
                    <RatingInfoRow
                      label="Responsiveness"
                      value={responsiveness}
                    />
                    <RatingInfoRow label="Clarity" value={clarity} />
                    <RatingInfoRow
                      label="Scheduling flexibility"
                      value={schedulingFlexibility}
                    />
                    <RatingInfoRow
                      label="Issue resolution"
                      value={issueResolution}
                    />

                    <RatingInfoRow
                      label="Average"
                      value={
                        (itemDescriptionAccuracy +
                          pickupCondition +
                          photoAccuracy +
                          cleanliness +
                          responsiveness +
                          clarity +
                          schedulingFlexibility +
                          issueResolution) /
                        8
                      }
                      bold={true}
                    />
                    <div style={{ textWrap: "wrap", color: "black" }}>
                      <span className="font-bold">Description: </span>
                      {description}
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

export default OwnerTableItem;
