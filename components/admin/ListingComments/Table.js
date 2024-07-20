import React, { useContext, useState } from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import ImageView from "../Form/ImageView";
import { IndiceContext } from "../../../contexts";
import RejectModal from "../Comments/RejectModal";
import ApproveModal from "../Comments/ApproveModal";
import { listingCommentApprove, listingCommentReject } from "../../../services";
import PaginationLoading from "../PaginationLoading";
import EmptyTable from "../EmptyTable";

const ListingCommentsTable = ({
  reviews,
  orderField,
  orderType,
  onClickTh,
  totalCount,
  setItemFields,
  loading,
}) => {
  const [popupImage, setPopupImage] = useState(null);
  const [popupApproveId, setPopupApproveId] = useState(null);
  const [popupRejectId, setPopupRejectId] = useState(null);
  const { authToken } = useContext(IndiceContext);

  const ths = [
    { title: "Id", value: "listing_comments.id", width: "10%" },
    { title: "Listing", value: "listings.name", width: "30%" },
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
    await listingCommentReject({ id: popupRejectId, description }, authToken);
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
      approvedReview.listingAverageRating * approvedReview.listingCommentCount +
      (approvedReview.flexibility +
        approvedReview.communication +
        approvedReview.kindness +
        approvedReview.reliability +
        approvedReview.generalExperience +
        approvedReview.punctuality) /
        6;

    const newCount = approvedReview.listingCommentCount + 1;
    const newAveragePoints = totalPoints / newCount;

    await listingCommentApprove({ id: popupApproveId }, authToken);

    setItemFields(
      {
        approved: true,
        waitingAdmin: false,
        listingAverageRating: newAveragePoints,
        listingCommentCount: newCount,
      },
      popupApproveId
    );
  };

  return (
    <div className="base-pagination-table bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          All Reviews{" "}
          {!loading && (
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              {totalCount}
            </span>
          )}
        </h2>
      </header>

      <div>
        <div className="overflow-x-auto">
          <table className="admin-table table-fixed w-full dark:text-slate-300">
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
                  />
                ))}
            </tbody>
          </table>

          {loading && <PaginationLoading />}

          {!loading && reviews.length < 1 && <EmptyTable name="reviews"/>}
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

export default ListingCommentsTable;
