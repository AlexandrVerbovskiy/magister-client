import STATIC from "../../../static";

const Status = ({ status, baseClass = "" }) => {
  let text = "Unknown Status";
  let dopClassName = "bg-slate-300";

  if (status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT) {
    text = "Approved";
    dopClassName = "bg-indigo-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
    text = "Rental in progress";
    dopClassName = "bg-cyan-500";
  }

  if (status == STATIC.ORDER_STATUSES.FINISHED) {
    text = "Finished";
    dopClassName = "bg-emerald-500";
  }

  return (
    <div className={`${baseClass} text-white ${dopClassName}`}>{text}</div>
  );
};

export default Status;
