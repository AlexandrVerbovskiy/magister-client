import { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../../../contexts";
import ModalBlank from "../ModalBlank";
import CheckboxList from "../Form/CheckboxList";
import ErrorSpan from "../ErrorSpan";

const RejectModal = ({ active, close, onRejectClick }) => {
  const [disabled, setDisabled] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [checkedListError, setCheckedListError] = useState(null);
  const otherReasonDescriptionRef = useRef(null);

  const leftReasons = [
    { title: "Mismatched Amount", value: "mismatched-amount" },
    { title: "Incomplete Information", value: "incomplete-information" },
    { title: "Low Image Quality", value: "low-image-quality" },
    { title: "Invalid Receipt", value: "invalid-receipt" },
    { title: "Mismatched Details", value: "mismatched-details" },
  ];

  const rightReasons = [
    { title: "Suspected Fraud", value: "suspected-fraud" },
    { title: "Late Payment", value: "late-payment" },
    { title: "Duplicate Payment", value: "duplicate-payment" },
    { title: "Unrecognized Payment", value: "unrecognized-payment" },
    { title: "Incorrect Reference Code", value: "incorrect-reference-code" },
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

  const handleAcceptClick = async () => {
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
      await onRejectClick(descriptionToSend);
      success.set("Payment rejected successfully");
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
              Are you sure you want mark this payment as failed?
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
              onClick={handleAcceptClick}
              className="btn bg-rose-500 hover:bg-rose-600 text-white"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
};

export default RejectModal;
