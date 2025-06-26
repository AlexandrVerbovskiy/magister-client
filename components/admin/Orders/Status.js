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

  if (status == STATIC.ORDER_STATUSES.IN_PROCESS) {
    text = "In process";
    dopClassName = "bg-teal-100 text-teal-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_OWNER_FINISHED) {
    text = "Renter in Progress";
    dopClassName = "bg-orange-100 text-orange-500";
  }

  if (status == STATIC.ORDER_STATUSES.FINISHED) {
    text = "Finished";
    dopClassName = "bg-emerald-100 text-emerald-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_OWNER) {
    text = "Waiting for Confirmation";
    dopClassName = "bg-purple-100 text-purple-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_RENTER) {
    text = "Waiting for Confirmation";
    dopClassName = "bg-purple-100 text-purple-500";
  }

  if (status == STATIC.ORDER_STATUSES.REJECTED) {
    text = "Denied";
    dopClassName = "bg-rose-100 text-rose-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_OWNER_PAYMENT) {
    text = "Waiting for Payment";
    dopClassName = "bg-sky-100 text-sky-500";

    if (payedId) {
      if (payedWaitingApproved) {
        text = "Waiting for Payment Confirmation";
        dopClassName = "bg-rose-100 text-purple-500";
      }

      if (!payedWaitingApproved && !payedAdminApproved) {
        text = "Payment Rejected";
        dopClassName = "bg-rose-100 text-rose-500";
      }
    }
  }

  return <div className={`max-w-full text-center ${baseClass} ${dopClassName}`}>{text}</div>;
};

export default Status;
