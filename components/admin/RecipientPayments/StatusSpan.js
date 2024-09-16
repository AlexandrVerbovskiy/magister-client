const StatusSpan = ({
  status,
  baseClass = "text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 overflow-separate",
}) => {
  let dopClass =
    "bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400";
  let text = "Waiting";

  if (status == "failed") {
    dopClass =
      "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";
    text = "Failed";
  }

  if (status == "completed") {
    dopClass =
      "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400";
    text = "Completed";
  }

  if (status == "cancelled") {
    dopClass =
      "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400";
    text = "Cancelled";
  }

  return <div className={`max-w-full text-center ${dopClass} ${baseClass}`}>{text}</div>;
};

export default StatusSpan;
