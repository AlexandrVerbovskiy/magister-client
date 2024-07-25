import React, { useContext, useState } from "react";
import Th from "../../../partials/admin/base/Th";
import OwnerTableItem from "./OwnerTableItem";
import RenterTableItem from "./RenterTableItem";
import ImageView from "../Form/ImageView";
import { IndiceContext } from "../../../contexts";
import RejectModal from "../Comments/RejectModal";
import ApproveModal from "../Comments/ApproveModal";
import PaginationLoading from "../PaginationLoading";
import EmptyTable from "../EmptyTable";

const sumRatingByType = (type, comment) => {
  let keys = [
    `care`,
    `timeliness`,
    `responsiveness`,
    `clarity`,
    `usageGuidelines`,
    `termsOfService`,
    `honesty`,
    `reliability`,
    `satisfaction`,
  ];

  if (type == "owner") {
    keys = [
      `itemDescriptionAccuracy`,
      `photoAccuracy`,
      `pickupCondition`,
      `cleanliness`,
      `responsiveness`,
      `clarity`,
      `schedulingFlexibility`,
      `issueResolution`,
    ];
  }

  let sum = 0;
  keys.forEach((key) => (sum += comment[key]));
  return sum / keys.length;
};

const UserCommentsTable = ({
  reviews,
  orderField,
  orderType,
  onClickTh,
  totalCount,
  setItemFields,
  rejectReview,
  approveReview,
  loading,
  type = "renter",
}) => {
  let userColumnTitle = "Renter";
  let TableItem = RenterTableItem;

  if (type == "owner") {
    userColumnTitle = "Owner";
    TableItem = OwnerTableItem;
  }

  const [popupImage, setPopupImage] = useState(null);
  const [popupApproveId, setPopupApproveId] = useState(null);
  const [popupRejectId, setPopupRejectId] = useState(null);
  const { authToken } = useContext(IndiceContext);

  const ths = [
    { title: "Id", value: "listing_comments.id", width: "10%" },
    { title: userColumnTitle, value: "users.name", width: "30%" },
    { title: "Reviewer", value: "reviewers.name", width: "35%" },
    { title: "Status", canOrder: false, value: "status", width: "10%" },
    {
      title: "Created At",
      value: "listing_comments.created_at",
      width: "10%",
    },
    { title: "", value: "actions", canOrder: false, width: "5%" },
  ];

  const handleRejectAcceptClick = async (description) => {
    await rejectReview({ id: popupRejectId, description }, authToken);
    setItemFields(
      {
        approved: false,
        waitingAdmin: false,
        rejectedDescription: description,
      },
      popupRejectId
    );
  };

  const handleApproveAcceptClick = async () => {
    const approvedReview = reviews.find(
      (review) => review.id == popupApproveId
    );

    const totalPoints =
      approvedReview.userAverageRating * approvedReview.userCommentCount +
      sumRatingByType(type, approvedReview);

    const newCount = approvedReview.userCommentCount + 1;
    const newAveragePoints = totalPoints / newCount;

    await approveReview({ id: popupApproveId }, authToken);

    setItemFields(
      {
        approved: true,
        waitingAdmin: false,
        userAverageRating: newAveragePoints,
        userCommentCount: newCount,
      },
      popupApproveId
    );
  };

  return (
    <div className="base-pagination-table bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Reviews{" "}
          {!loading && (
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              {totalCount}
            </span>
          )}
        </h2>
      </header>

      <div>
        <div className="overflow-x-auto">
          <table className="admin-table table-fixed dark:text-slate-300">
            <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
              <tr>
                {ths.map((th) => (
                  <Th
                    key={th.value}
                    {...th}
                    orderType={orderField == th.value ? orderType : null}
                    onClick={onClickTh}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700">
              {!loading &&
                reviews.map((review) => (
                  <TableItem
                    key={review.id}
                    {...review}
                    openPopupImage={(image) => setPopupImage(image)}
                    handleApproveClick={(id) => setPopupApproveId(id)}
                    handleRejectClick={(id) => setPopupRejectId(id)}
                    userColumnTitle={userColumnTitle}
                  />
                ))}
            </tbody>
          </table>

          {loading && <PaginationLoading />}

          {!loading && reviews.length < 1 && <EmptyTable name="reviews" />}
        </div>
      </div>

      <ImageView
        open={popupImage}
        imgSrc={popupImage}
        close={() => setPopupImage(null)}
      />

      <RejectModal
        active={!!popupRejectId}
        close={() => setPopupRejectId(null)}
        onAcceptClick={handleRejectAcceptClick}
      />

      <ApproveModal
        active={!!popupApproveId}
        close={() => setPopupApproveId(null)}
        onAcceptClick={handleApproveAcceptClick}
      />
    </div>
  );
};

export default UserCommentsTable;
