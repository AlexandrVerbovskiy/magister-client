import STATIC from "../../../static";

const CancelStatus = ({ status, baseClass = "" }) => {
  let text = "Unknown Status";
  let dopClassName = "bg-slate-300";

  if (status == STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT) {
    text = "Pending Admin Cancel";
    dopClassName = "bg-orange-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT) {
    text = "Pending Owner Cancel";
    dopClassName = "bg-amber-500";
  }

  if (status == STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER) {
    text = "Pending Rental Cancel";
    dopClassName = "bg-yellow-500";
  }

  if (status == STATIC.ORDER_STATUSES.CANCELLED) {
    text = "Cancelled";
    dopClassName = "bg-rose-500";
  }

  return (
    <div className={`${baseClass} text-white ${dopClassName}`}>{text}</div>
  );
};

export default CancelStatus;
