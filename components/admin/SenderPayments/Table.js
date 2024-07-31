import React, { useContext, useState } from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import ImageView from "../Form/ImageView";
import PaypalCheck from "../PaypalCheck";
import { IndiceContext } from "../../../contexts";
import {
  approveSenderPaymentTransaction,
  rejectSenderPaymentTransaction,
} from "../../../services";
import RejectModal from "./RejectModal";
import AcceptModal from "./AcceptModal";
import PaginationLoading from "../PaginationLoading";
import EmptyTable from "../EmptyTable";

const SenderPaymentsTable = ({
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
    { title: "Id", value: "sender_payments.id", width: "10%" },
    { title: "User", value: "users.name", width: "20%" },
    { title: "Payment Method", value: "sender_payments.type", width: "20%" },
    { title: "Amount", value: "sender_payments.money", width: "20%" },
    { title: "Uploaded on", value: "sender_payments.created_at", width: "15%" },
    { title: "Status", value: "status", canOrder: false, width: "10%" },
    { title: "", value: "actions", canOrder: false, width: "5%" },
  ];

  const [popupImage, setPopupImage] = useState(null);
  const [popupPaypalData, setPopupPaypalData] = useState(null);

  const [popupApproveId, setPopupApproveId] = useState(null);
  const [popupRejectId, setPopupRejectId] = useState(null);
  const { authToken } = useContext(IndiceContext);

  const handleAccept = async () => {
    await approveSenderPaymentTransaction(
      { orderId: popupApproveId },
      authToken
    );

    const paymentId = payments.find(
      (payment) => payment.orderId === popupApproveId
    );

    setItemFields(
      { adminApproved: true, waitingApproved: false },
      paymentId.id
    );
  };

  const handleReject = async (description) => {
    await rejectSenderPaymentTransaction(
      { orderId: popupRejectId, description },
      authToken
    );

    const paymentId = payments.find(
      (payment) => payment.orderId === popupRejectId
    );

    setItemFields(
      { adminApproved: false, waitingApproved: false },
      paymentId.id
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
          <table className="admin-table table-fixed dark:text-slate-300">
            <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
              <tr>
                {ths.map((th) => (
                  <Th
                    key={th.value}
                    {...th}
                    orderType={orderField == th.value ? orderType : null}
                    onClick={onClickTh}
                    align={
                      ["count_transfers"].includes(
                        th.value
                      )
                        ? "center"
                        : "left"
                    }
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
                    openPopupImage={(image) => setPopupImage(image)}
                    openPopupPaypal={(data) => setPopupPaypalData(data)}
                    handleApproveClick={(id) => setPopupApproveId(id)}
                    handleRejectClick={(id) => setPopupRejectId(id)}
                  />
                ))}
            </tbody>
          </table>

          {loading && <PaginationLoading />}

          {!loading && payments.length < 1 && <EmptyTable name="payments" />}
        </div>
      </div>

      <ImageView
        open={popupImage}
        imgSrc={popupImage}
        close={() => setPopupImage(null)}
      />

      <RejectModal
        active={popupRejectId}
        close={() => setPopupRejectId(false)}
        onRejectClick={handleReject}
      />

      <AcceptModal
        active={popupApproveId}
        close={() => setPopupApproveId(null)}
        onAcceptClick={handleAccept}
      />

      {popupPaypalData && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div
            className="absolute w-full h-full bg-gray-900 opacity-50"
            onClick={() => setPopupPaypalData(null)}
          ></div>

          <div
            style={{ height: "90%", overflow: "hidden" }}
            className="modal-container mx-auto rounded z-50 overflow-y-auto"
          >
            <div className="w-full h-full modal-content text-left">
              <div className="w-full h-full flex justify-center">
                <PaypalCheck sizeType="big-size" {...popupPaypalData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SenderPaymentsTable;
