import { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../../../contexts";
import ModalWithDescription from "../Form/ModalWithDescription";
import ModalBlank from "../ModalBlank";
import CheckboxList from "../Form/CheckboxList";
import ErrorSpan from "../ErrorSpan";

const SolveModal = ({ active, close, onAcceptClick }) => {
  const [disabled, setDisabled] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [checkedListError, setCheckedListError] = useState(null);
  const otherReasonDescriptionRef = useRef(null);

  const leftReasons = [
    { title: "Partial Refund", value: "partial-refund" },
    { title: "Full Refund", value: "full-refund" },
    { title: "Replacement Item", value: "replacement-item" },
    { title: "Repair Costs", value: "repair-costs" },
    { title: "Extended Rental Period", value: "extended-rental-period" },
  ];

  const rightReasons = [
    { title: "Discount on Future Rentals", value: "discount-future-rentals" },
    { title: "Documentation Review", value: "documentation-review" },
    {
      title: "Terms and Conditions Enforcement",
      value: "terms-conditions-enforcement",
    },
    { title: "Deposit Forfeiture", value: "deposit-forfeiture" },
    {
      title: "Cancellation Without Penalty",
      value: "cancellation-without-penalty",
    },
  ];

  const reasons = [...leftReasons, ...rightReasons];

  const { error, success } = useContext(IndiceContext);

  useEffect(() => {
    if (active) {
      setDisabled(false);
      setCheckedList([]);
      setCheckedListError(null);
    }
  }, [active]);

  const handleRejectAcceptClick = async () => {
    if (disabled) {
      return;
    }

    setCheckedListError(null);

    if (checkedList.length < 1) {
      setCheckedListError(
        "You must specify the reasons for rejecting the request"
      );
      return;
    }

    const descriptionParts = [];

    reasons.forEach((reason) => {
      if (checkedList.includes(reason.value)) {
        let title = reason.title;

        if (descriptionParts.length) {
          title = title.toLowerCase();
        }

        descriptionParts.push(title);
      }
    });

    try {
      setDisabled(true);
      const descriptionToSend = descriptionParts.join(", ");
      await onAcceptClick(descriptionToSend);
      success.set("Solved successfully");
      close();
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  const handleCheckClick = (value) => {
    setCheckedListError(null);
    const includes = checkedList.includes(value);

    setCheckedList((prev) => {
      if (includes) {
        return prev.filter((check) => check != value);
      } else {
        return [...prev, value];
      }
    });

    setTimeout(() => {
      if (includes && otherReasonDescriptionRef.current) {
        otherReasonDescriptionRef.current.focus();
      }
    }, 0);
  };

  return (
    <ModalBlank id="operation-decline" modalOpen={active} setModalOpen={close}>
      <div className="p-5 flex space-x-4">
        <div style={{ width: "100%" }}>
          <div className="mb-2">
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Are you sure you want to solve this dispute?
            </div>
          </div>

          <div className="mb-2">
            <div className="flex">
              <div style={{ width: "50%" }}>
                <CheckboxList
                  options={leftReasons}
                  checkedList={checkedList}
                  onCheckClick={handleCheckClick}
                />
              </div>

              <div style={{ width: "50%" }}>
                <CheckboxList
                  options={rightReasons}
                  checkedList={checkedList}
                  onCheckClick={handleCheckClick}
                />
              </div>
            </div>

            <ErrorSpan error={checkedListError} />
          </div>

          <div className="flex flex-wrap justify-end space-x-2">
            <button
              disabled={disabled}
              onClick={close}
              className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              disabled={disabled}
              onClick={handleRejectAcceptClick}
              className="btn bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Solve
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
};

export default SolveModal;
