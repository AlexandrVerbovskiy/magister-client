import Tooltip from "../Tooltip";

const ActiveSpan = ({ approved, waitingAdmin }) => {
  const text = waitingAdmin ? "SUSPENDED" : approved ? "APPROVED" : "REJECTED";

  let dopClass = waitingAdmin
    ? "bg-gray-100 dark:bg-gray-500/30 text-gray-500"
    : approved
    ? "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
    : "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";

  return (
    <div
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1`}
    >
      <Tooltip
        title={
          waitingAdmin
            ? "Review doesn't published"
            : approved
            ? "Review published"
            : "Review doesn't published"
        }
      >
        <span className="overflow-separate flex justify-center">{text}</span>
      </Tooltip>
    </div>
  );
};

export default ActiveSpan;
