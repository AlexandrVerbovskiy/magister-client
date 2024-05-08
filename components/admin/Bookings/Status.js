import STATIC from "../../../static";

const Status = ({ status, baseClass = "" }) => {
  let text = "Unknown Status";
  let dopClassName = "bg-slate-300";

  if (status == STATIC.ORDER_STATUSES.PENDING_OWNER) {
    text = "Pending Owner Approvement";
    dopClassName = "bg-purple-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_TENANT) {
    text = "Pending Rental Approvement";
    dopClassName = "bg-amber-500";
  }

  if (status == STATIC.ORDER_STATUSES.REJECTED) {
    text = "Declined";
    dopClassName = "bg-rose-500";
  }

  return (
    <div className={`${baseClass} text-white ${dopClassName}`}>{text}</div>
  );
};

export default Status;
