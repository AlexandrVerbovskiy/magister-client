import STATIC from "../../../static";

const Status = ({ status, baseClass = "" }) => {
  let text = "Unknown Status";
  let dopClassName = "bg-slate-300";

  if (status == STATIC.ORDER_STATUSES.PENDING_OWNER) {
    text = "Waiting for confirmation";
    dopClassName = "bg-purple-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_TENANT) {
    text = "Waiting for confirmation";
    dopClassName = "bg-purple-500";
  }

  if (status == STATIC.ORDER_STATUSES.REJECTED) {
    text = "Denied";
    dopClassName = "bg-rose-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT) {
    text = "Waiting for payment";
    dopClassName = "bg-sky-500";
  }

  return (
    <div className={`${baseClass} text-white ${dopClassName}`}>{text}</div>
  );
};

export default Status;
