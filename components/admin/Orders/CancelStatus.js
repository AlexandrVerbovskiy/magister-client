import STATIC from "../../../static";

const CancelStatus = ({ status, baseClass = "" }) => {
  let text = "Unknown Status";
  let dopClassName = "bg-slate-300";

  if (status == STATIC.ORDER_CANCELATION_STATUSES.WAITING_ADMIN_APPROVE) {
    text = "Pending Admin Approve";
    dopClassName = "bg-orange-500";
  }

  if (status == STATIC.ORDER_CANCELATION_STATUSES.WAITING_OWNER_APPROVE) {
    text = "Pending Owner Cancel";
    dopClassName = "bg-amber-500";
  }

  if (status == STATIC.ORDER_CANCELATION_STATUSES.WAITING_TENANT_APPROVE) {
    text = "Pending Rental Cancel";
    dopClassName = "bg-yellow-500";
  }

  if (status == STATIC.ORDER_CANCELATION_STATUSES.CANCELLED) {
    text = "Cancelled";
    dopClassName = "bg-rose-500";
  }

  return (
    <div className={`${baseClass} text-white ${dopClassName}`}>{text}</div>
  );
};

export default CancelStatus;
