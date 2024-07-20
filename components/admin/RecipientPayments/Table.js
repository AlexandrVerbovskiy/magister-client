import React, { useContext, useState } from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import { failedRecipientMarkAsDone } from "../../../services";
import AcceptModal from "../SenderPayments/AcceptModal";
import { IndiceContext } from "../../../contexts";
import STATIC from "../../../static";
import { isPayedUsedPaypal } from "../../../utils";
import PaginationLoading from "../PaginationLoading";
import EmptyTable from "../EmptyTable";

const RecipientPaymentsTable = ({
  payments,
  orderField,
  orderType,
  onClickTh,
  totalCount,
  viewPath,
  setItemFields,
  loading,
}) => {
  const ths = [
    { title: "Id", value: "recipient_payments.id", width: "10%" },
    { title: "Payer", value: "tenants.name", width: "15%" },
    { title: "Recipient", value: "users.name", width: "15%" },
    { title: "Price", value: "recipient_payments.money", width: "15%" },
    {
      title: "Type",
      value: "recipient_payments.received_type",
      width: "10%",
    },
    {
      title: "Created At",
      value: "recipient_payments.created_at",
      width: "15%",
    },
    { title: "Status", value: "recipient_payments.status", width: "15%" },
    { title: "", value: "action", canOrder: false, width: "5%" },
  ];

  const [popupApproveId, setPopupApproveId] = useState(null);
  const { authToken } = useContext(IndiceContext);

  const handleAccept = async () => {
    const payment = payments.find((payment) => payment.id === popupApproveId);

    const paymentNumber = isPayedUsedPaypal(payment.type)
      ? payment.data?.paypalId ?? "-"
      : payment.data?.cardNumber ?? "-";

    await failedRecipientMarkAsDone(
      { id: payment.id, paymentNumber },
      authToken
    );

    setItemFields(
      { adminApproved: true, waitingApproved: false, status: "completed" },
      payment.id
    );
  };

  return (
    <div className="base-pagination-table bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Payments{" "}
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
                payments.map((payment) => (
                  <TableItem
                    key={payment.id}
                    {...payment}
                    viewPath={viewPath}
                    handleApproveClick={(id) => setPopupApproveId(id)}
                  />
                ))}
            </tbody>
          </table>

          {loading && <PaginationLoading />}

          {!loading && payments.length < 1 && <EmptyTable name="payments" />}
        </div>
      </div>

      <AcceptModal
        active={popupApproveId}
        close={() => setPopupApproveId(null)}
        onAcceptClick={handleAccept}
      />
    </div>
  );
};

export default RecipientPaymentsTable;
