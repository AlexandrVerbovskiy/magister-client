import Tooltip from "../Tooltip";
import STATIC from "../../../static";

const ActiveSpan = ({ status, needToolTip = true, onClick = null }) => {
  const text =
    status == STATIC.DISPUTE_STATUSES.OPEN
      ? "OPEN"
      : status == STATIC.DISPUTE_STATUSES.SOLVED
      ? "SOLVED"
      : "UNSOLVED";

  let dopClass =
    status == STATIC.DISPUTE_STATUSES.OPEN
      ? "bg-amber-100 dark:bg-amber-500/30 text-amber-500"
      : status == STATIC.DISPUTE_STATUSES.SOLVED
      ? "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
      : "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";

  return (
    <div
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick ? onClick : () => {}}
    >
      {needToolTip ? (
        <Tooltip
          title={
            status == STATIC.DISPUTE_STATUSES.OPEN
              ? "The dispute is not resolved"
              : status == STATIC.DISPUTE_STATUSES.SOLVED
              ? "The dispute is resolved"
              : "The dispute is postponed until later"
          }
        >
          <span className="overflow-separate flex justify-center">{text}</span>
        </Tooltip>
      ) : (
        <span className="overflow-separate flex justify-center">{text}</span>
      )}
    </div>
  );
};

export default ActiveSpan;
