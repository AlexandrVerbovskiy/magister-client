import Link from "next/link";
import TableDateView from "../TableDateView";
import { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../../../contexts";

const StatusSpan = ({ started, stopped, finished }) => {
  let text = "Pending Started";
  let className = "bg-orange-100 text-orange-500";

  if (finished) {
    className = "bg-emerald-100 text-emerald-500";
    text = "Finished";
  }

  if (stopped) {
    className = "bg-rose-100 text-rose-500";
    text = "Stopped";
  }

  if (started) {
    className = "bg-yellow-100 text-yellow-500";
    text = "Started";
  }

  return (
    <div
      className={`max-w-full text-center text-xs inline-flex font-medium rounded-full px-2.5 py-1 overflow-separate ${className}`}
    >
      {text}
    </div>
  );
};

const TableItem = ({
  id,
  accuracy,
  active,
  started,
  stopped,
  finished,
  body,
  createdAt,
  onStopModelClick,
  onUnstopModelClick,
  onActivateModelClick,
  onStartTrainingClick,
  checked,
  progressPercent,
  selectedFields,
}) => {
  const { error } = useContext(IndiceContext);
  const [localPercent, setLocalPercent] = useState(progressPercent);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (started && localPercent !== 100) {
      intervalRef.current = setInterval(async () => {
        try {
          const model = await getDisputePredictionModel(id);
          setLocalPercent(model.progressPercent);

          if (model.progressPercent === 100) {
            clearInterval(intervalRef.current);
          }
        } catch (e) {
          error.set(e.message);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [started, id]);

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <StatusSpan started={started} stopped={stopped} finished={finished} />
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div
          className={`max-w-full text-center text-xs inline-flex font-medium rounded-full px-2.5 py-1 overflow-separate ${
            active
              ? "bg-emerald-100 text-emerald-500"
              : "bg-rose-100 text-rose-500"
          }`}
        >
          {active ? "Active" : "Not Active"}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-wrap overflow-separate">
        <div className="font-medium">
          {body
            .map((field) =>
              selectedFields && selectedFields.includes(field.pseudonym) ? (
                <span key={field.pseudonym} className="font-bold">
                  {field.pseudonym}
                </span>
              ) : (
                <span key={field.pseudonym}>{field.pseudonym}</span>
              )
            )
            .reduce((prev, curr) => [prev, ", ", curr])}
        </div>
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium">{accuracy ? `${accuracy}%` : "-"}</div>
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
        <div className="font-medium">
          {started ? `${localPercent}%` : finished ? "100%" : "-"}
        </div>
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <TableDateView date={createdAt} />
      </td>

      <td className="flex flex-col gap-2 my-4">
        {finished && !active && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onActivateModelClick();
            }}
            className="bg-emerald-100 hover:bg-emerald-200 flex items-center text-emerald-500 hover:text-emerald-600 rounded-full py-2 px-4 w-fit"
          >
            Activate
          </button>
        )}

        {!finished && started && !stopped && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStopModelClick();
            }}
            className="bg-rose-100 hover:bg-rose-200 flex items-center text-rose-500 hover:text-rose-600 rounded-full py-2 px-4 w-fit"
          >
            Stop
          </button>
        )}

        {!finished && started && stopped && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUnstopModelClick();
            }}
            className="bg-emerald-100 hover:bg-emerald-200 flex items-center text-emerald-500 hover:text-emerald-600 rounded-full py-2 px-4 w-fit"
          >
            Continue
          </button>
        )}

        <Link
          href={checked ? `/admin/dispute-predictions/details/${id}/` : "#"}
          className={`bg-teal-100 flex items-center text-teal-500 rounded-full py-2 px-4 w-min ${
            checked
              ? "hover:bg-teal-200 hover:text-teal-600 cursor-pointer"
              : "opacity-50 cursor-not-allowed pointer-events-none"
          }`}
          tabIndex={checked ? 0 : -1}
          aria-disabled={!checked}
        >
          Prediction Details
        </Link>

        {!finished && !started && checked && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStartTrainingClick();
            }}
            className="bg-emerald-100 hover:bg-emerald-200 flex items-center text-emerald-500 hover:text-emerald-600 rounded-full py-2 px-4 w-fit"
          >
            Start Training
          </button>
        )}

        <Link
          href={`/admin/dispute-predictions/clone/${id}/`}
          className="bg-blue-100 hover:bg-blue-200 flex items-center text-blue-500 hover:text-blue-600 rounded-full py-2 px-4 w-fit"
        >
          Clone
        </Link>

        <Link
          href={`/admin/dispute-predictions/edit/${id}/`}
          className="bg-blue-100 hover:bg-blue-200 flex items-center text-blue-500 hover:text-blue-600 rounded-full py-2 px-4 w-fit"
        >
          Edit
        </Link>
      </td>
    </tr>
  );
};

export default TableItem;
