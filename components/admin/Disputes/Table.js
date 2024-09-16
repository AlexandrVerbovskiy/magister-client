import React, { useContext, useState } from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import ImageView from "../Form/ImageView";
import { IndiceContext } from "../../../contexts";
import UnsolveModal from "./UnsolveModal";
import SolveModal from "./SolveModal";
import { solveDispute, unsolveDispute } from "../../../services";
import STATIC from "../../../static";
import PaginationLoading from "../PaginationLoading";
import EmptyTable from "../EmptyTable";

const DisputesTable = ({
  disputes,
  orderField,
  orderType,
  onClickTh,
  totalCount,
  setItemFields,
  loading,
}) => {
  const [popupSolveId, setPopupSolveId] = useState(null);
  const [popupUnsolveId, setPopupUnsolveId] = useState(null);
  const { authToken } = useContext(IndiceContext);

  const ths = [
    { title: "Issue Id", value: "disputes.id", width: "10%" },
    {
      title: "Status",
      value: "status",
      width: "10%",
    },
    { title: "Owner", value: "owners.name", width: "15%" },
    { title: "Renter", value: "tenants.name", width: "15%" },
    { title: "Item", value: "listings.name", width: "15%" },
    {
      title: "Start At",
      value: "orders.start_date",
      width: "10%",
    },
    {
      title: "End At",
      value: "orders.end_date",
      width: "10%",
    },
    {
      title: "Created At",
      value: "disputes.created_at",
      width: "10%",
    },
    { title: "", value: "actions", canOrder: false, width: "5%" },
  ];

  const handleApproveUnsolveClick = async () => {
    await unsolveDispute(popupUnsolveId, authToken);
    setItemFields({ status: STATIC.DISPUTE_STATUSES.UNSOLVED }, popupUnsolveId);
  };

  const handleApproveSolveClick = async (solution) => {
    await solveDispute({ solution, disputeId: popupSolveId }, authToken);
    setItemFields(
      { solution, status: STATIC.DISPUTE_STATUSES.SOLVED },
      popupSolveId
    );
  }

  return (
    <div className="base-pagination-table bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          All Disputes{" "}
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
                disputes.map((dispute) => (
                  <TableItem
                    key={dispute.id}
                    {...dispute}
                    handleSolveClick={(disputeId) => setPopupSolveId(disputeId)}
                    handleUnsolveClick={(disputeId) =>
                      setPopupUnsolveId(disputeId)
                    }
                  />
                ))}
            </tbody>
          </table>

          {loading && <PaginationLoading />}

          {!loading && disputes.length < 1 && <EmptyTable name="disputes" />}
        </div>
      </div>

      <UnsolveModal
        active={!!popupUnsolveId}
        close={() => setPopupUnsolveId(null)}
        onAcceptClick={handleApproveUnsolveClick}
      />

      <SolveModal
        active={!!popupSolveId}
        close={() => setPopupSolveId(null)}
        onAcceptClick={handleApproveSolveClick}
      />
    </div>
  );
};

export default DisputesTable;
