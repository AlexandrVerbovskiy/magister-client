import React, { useContext, useState } from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import ImageView from "../Form/ImageView";
import { IndiceContext } from "../../../contexts";
import RejectModal from "./RejectModal";
import ApproveModal from "./ApproveModal";
import {
  approveListingApprovalRequest,
  rejectListingApproveRequest,
} from "../../../services";
import PaginationLoading from "../PaginationLoading";
import EmptyTable from "../EmptyTable";

const RequestsTable = ({
  listingApprovalRequests,
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
    { title: "Id", value: "listing_approval_requests.id", width: "10%" },
    { title: "Name", value: "listings.name", width: "25%" },
    { title: "User", value: "users.name", width: "20%" },
    { title: "Category", value: "listing_categories.name", width: "20%" },
    {
      title: "Approved",
      value: "listing_approval_requests.approved",
      canOrder: false,
      width: "10%",
    },
    {
      title: "Created At",
      value: "listing_approval_requests.created_at",
      width: "10%",
    },
    { title: "", value: "actions", canOrder: false, width: "5%" },
  ];

  const handleRejectAcceptClick = async (description) => {
    await rejectListingApproveRequest(
      { listingId: popupRejectId, description },
      authToken
    );

    const request = listingApprovalRequests.find(
      (request) => request.listingId == popupRejectId
    );

    setItemFields({ approved: false }, request.id);
  };

  const handleApproveAcceptClick = async () => {
    await approveListingApprovalRequest(
      { listingId: popupApproveId },
      authToken
    );

    const request = listingApprovalRequests.find(
      (request) => request.listingId == popupApproveId
    );

    setItemFields({ approved: true }, request.id);
  };

  return (
    <div className="base-pagination-table bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          All Requests{" "}
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
                listingApprovalRequests.map((request) => (
                  <TableItem
                    key={request.id}
                    {...request}
                    openPopupImage={(image) => setPopupImage(image)}
                    handleApproveClick={(listingId) =>
                      setPopupApproveId(listingId)
                    }
                    handleRejectClick={(listingId) =>
                      setPopupRejectId(listingId)
                    }
                  />
                ))}
            </tbody>
          </table>

          {loading && <PaginationLoading />}

          {!loading && listingApprovalRequests.length < 1 && <EmptyTable name="requests"/>}
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

export default RequestsTable;
