import React, { useContext, useState } from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import ImageView from "../Form/ImageView";
import DeclineModal from "./DeclineModal";
import ApproveModal from "./ApproveModal";
import { IndiceContext } from "../../../contexts";
import { userVerifyRequestUpdate } from "../../../services";
import PaginationLoading from "../PaginationLoading";
import EmptyTable from "../EmptyTable";

const RequestsTable = ({
  userVerifyRequests,
  orderField,
  orderType,
  onClickTh,
  totalCount,
  setItemFields,
  loading,
}) => {
  const [popupImage, setPopupImage] = useState(null);
  const [popupApproveId, setPopupApproveId] = useState(null);
  const [popupDeclineId, setPopupDeclineId] = useState(null);
  const { authToken } = useContext(IndiceContext);

  const ths = [
    { title: "Id", value: "user_verify_requests.id", width: "10%" },
    { title: "User Name", value: "users.name", width: "22.5%" },
    { title: "User Email", value: "users.email", width: "22.5%" },
    { title: "Status", canOrder: false, value: "status", width: "10%" },
    {
      title: "Created At",
      value: "user_verify_requests.created_at",
      width: "20%",
    },
    { title: "", value: "actions", canOrder: false, width: "5%" },
  ];

  const handleAcceptDeclineClick = async (description) => {
    await userVerifyRequestUpdate(
      { id: popupDeclineId, verified: false, description },
      authToken
    );

    setItemFields(
      { hasResponse: true, failedDescription: description },
      popupDeclineId
    );
  };

  const handleApproveAcceptClick = async () => {
    await userVerifyRequestUpdate(
      { id: popupApproveId, verified: true, description: null },
      authToken
    );

    setItemFields(
      { hasResponse: true, failedDescription: null },
      popupApproveId
    );
  };

  return (
    <div className="base-pagination-table bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Requests{" "}
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
                userVerifyRequests.map((request) => (
                  <TableItem
                    key={request.id}
                    {...request}
                    openPopupImage={(image) => setPopupImage(image)}
                    handleApproveClick={(id) => setPopupApproveId(id)}
                    handleDeclineClick={(id) => setPopupDeclineId(id)}
                  />
                ))}
            </tbody>
          </table>

          {loading && <PaginationLoading />}

          {!loading && userVerifyRequests.length < 1 && (
            <EmptyTable name="requests" />
          )}
        </div>
      </div>

      <ImageView
        open={popupImage}
        imgSrc={popupImage}
        close={() => setPopupImage(null)}
      />

      <DeclineModal
        active={!!popupDeclineId}
        close={() => setPopupDeclineId(false)}
        onAcceptClick={handleAcceptDeclineClick}
      />

      <ApproveModal
        active={!!popupApproveId}
        close={() => setPopupApproveId(false)}
        onAcceptClick={handleApproveAcceptClick}
      />
    </div>
  );
};

export default RequestsTable;
