import STATIC from "../../../static";

const CancelStatus = ({ status, baseClass = "" }) => {
  let text = "Unknown Status";
  let dopClassName = "bg-slate-100 text-slate-500";

  if (status == STATIC.ORDER_CANCELATION_STATUSES.WAITING_ADMIN_APPROVE) {
    text = "Pending Admin Approve";
    dopClassName = "bg-orange-100 text-orange-500";
  }

  if (status == STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE) {
    text = "Pending Owner Cancel";
    dopClassName = "bg-amber-100 text-amber-500";
  }

  if (status == STATIC.ORDER_CANCELATION_STATUSES.WAITING_RENTER_APPROVE) {
    text = "Pending Renter Cancel";
    dopClassName = "bg-yellow-100 text-yellow-500";
  }

  if (status == STATIC.ORDER_CANCELATION_STATUSES.CANCELLED) {
    text = "Cancelled";
    dopClassName = "bg-rose-100 text-rose-500";
  }

  return (
    <div className={`${baseClass} ${dopClassName}`}>{text}</div>
  );
};

export default CancelStatus;
