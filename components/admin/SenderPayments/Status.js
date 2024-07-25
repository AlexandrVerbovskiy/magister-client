const Status = ({ adminApproved, waitingApproved }) => {
  let text = "Unknown Status";
  let dopClassName = "bg-slate-100 text-slate-500";

  if (waitingApproved) {
    text = "Pending";
    dopClassName = "bg-orange-100 text-orange-500";
  }

  if (!waitingApproved && adminApproved) {
    text = "Approved";
    dopClassName = "bg-emerald-100 text-emerald-500";
  }

  if (!waitingApproved && !adminApproved) {
    text = "Rejected";
    dopClassName = "bg-rose-100 text-rose-500";
  }

  return (
    <div className={`px-3 rounded-full shadow-2xl w-max ${dopClassName}`}>
      {text}
    </div>
  );
};

export default Status;
