import React, { useState } from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import ImageView from "../Form/ImageView";
import PaypalCheck from "../PaypalCheck";

const SenderPaymentsTable = ({
  payments,
  orderField,
  orderType,
  onClickTh,
  totalCount,
  viewPath,
}) => {
  const ths = [
    { title: "User", value: "users.name", width: "20%" },
    { title: "Payment Method", value: "sender_payments.type", width: "15%" },
    {
      title: "Previous Transfers",
      value: "count_transfers",
      canOrder: false,
      width: "10%",
    },
    { title: "Transfer Id", value: "sender_payments.id", width: "10%" },
    { title: "Amount", value: "sender_payments.money", width: "15%" },
    { title: "Uploaded on", value: "sender_payments.created_at", width: "15%" },
    { title: "Status", value: "status", canOrder: false, width: "10%" },
    { title: "", value: "actions", canOrder: false, width: "5%" },
  ];

  const [popupImage, setPopupImage] = useState(null);
  const [popupPaypalData, setPopupPaypalData] = useState(null);

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Payments{" "}
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            {totalCount}
          </span>
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
                    align={
                      ["count_transfers", "sender_payments.id"].includes(
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
              {payments.map((payment) => (
                <TableItem
                  key={payment.id}
                  {...payment}
                  viewPath={viewPath}
                  openPopupImage={(image) => setPopupImage(image)}
                  openPopupPaypal={(data) => setPopupPaypalData(data)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ImageView
        open={popupImage}
        imgSrc={popupImage}
        close={() => setPopupImage(null)}
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
