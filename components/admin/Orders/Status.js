import STATIC from "../../../static";

const Status = ({
  status,
  payedId,
  payedAdminApproved,
  payedWaitingApproved,
  baseClass = "",
}) => {
  let text = "Unknown Status";
  let dopClassName = "bg-slate-100 text-slate-500";

  if (status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT) {
    text = "Approved";
    dopClassName = "bg-indigo-100 text-indigo-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
    text = "Rental in progress";
    dopClassName = "bg-cyan-100 text-cyan-500";
  }

  if (status == STATIC.ORDER_STATUSES.FINISHED) {
    text = "Finished";
    dopClassName = "bg-emerald-100 text-emerald-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_OWNER) {
    text = "Waiting for confirmation";
    dopClassName = "bg-purple-100 text-purple-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_TENANT) {
    text = "Waiting for confirmation";
    dopClassName = "bg-purple-100 text-purple-500";
  }

  if (status == STATIC.ORDER_STATUSES.REJECTED) {
    text = "Denied";
    dopClassName = "bg-rose-100 text-rose-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT) {
    text = "Waiting for payment";
    dopClassName = "bg-sky-100 text-sky-500";

    if (payedId) {
      if (payedWaitingApproved) {
        text = "Waiting for payment confirmation";
        dopClassName = "bg-rose-100 text-purple-500";
      }

      if (!payedWaitingApproved && !payedAdminApproved) {
        text = "Payment rejected";
        dopClassName = "bg-rose-100 text-rose-500";
      }
    }
  }

  return <div className={`min-w-fit max-w-full text-center ${baseClass} ${dopClassName}`}>{text}</div>;
};

export default Status;
