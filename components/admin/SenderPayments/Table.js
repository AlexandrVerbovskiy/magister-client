import React, { useState } from "react";
import Th from "../../../partials/admin/base/Th";
import TableItem from "./TableItem";
import ImageView from "../Form/ImageView";

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

  const [popupImage, setIsPopupImage] = useState(null);

  const openPopup = (image) => {
    setIsPopupImage(image);
  };

  const closePopup = () => {
    setIsPopupImage(null);
  };

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
                  openPopup={openPopup}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ImageView open={popupImage} imgSrc={popupImage} close={closePopup} />
    </div>
  );
};

export default SenderPaymentsTable;
