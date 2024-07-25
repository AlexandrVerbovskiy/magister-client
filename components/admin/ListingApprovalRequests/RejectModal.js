import { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../../../contexts";
import ModalWithDescription from "../Form/ModalWithDescription";
import ModalBlank from "../ModalBlank";
import CheckboxList from "../Form/CheckboxList";
import ErrorSpan from "../ErrorSpan";

const RejectModal = ({ active, close, onAcceptClick }) => {
  const [declineOtherDescription, setDeclineOtherDescription] = useState("");
  const [declineOtherDescriptionError, setDeclineOtherDescriptionError] =
    useState(null);
  const [disabled, setDisabled] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [checkedListError, setCheckedListError] = useState(null);
  const otherReasonDescriptionRef = useRef(null);

  const reasons = [
    { title: "Expired Document", value: "expired-document" },
    { title: "Mismatched Information", value: "mismatched-information" },
    { title: "Incomplete Document", value: "incomplete-document" },
    { title: "Low Image Quality", value: "low-image-quality" },
    { title: "Invalid Document Type", value: "invalid-document-type" },
    { title: "Suspected Fraud", value: "suspected-fraud" },
    { title: "Other", value: "other" },
  ];

  const { error, success } = useContext(IndiceContext);

  useEffect(() => {
    if (active) {
      setDeclineOtherDescription("");
      setDeclineOtherDescriptionError(null);
      setDisabled(false);
      setCheckedList([]);
      setCheckedListError(null);
    }
  }, [active]);

  const handleRejectAcceptClick = async () => {
    if (disabled) {
      return;
    }
    
    setDeclineOtherDescriptionError(null);
    setCheckedListError(null);

    if (checkedList.length < 1) {
      setCheckedListError(
        "You must specify the reasons for rejecting the request"
      );
      return;
    }

    if (checkedList.includes("other") && declineOtherDescription.length < 1) {
      setDeclineOtherDescriptionError(
        "You must enter the reason for the rejection of the verification"
      );
      return;
    }

    const descriptionParts = [];

    reasons.forEach((reason) => {
      if (checkedList.includes(reason.value) && reason.value != "other") {
        let title = reason.title;

        if (descriptionParts.length) {
          title = title.toLowerCase();
        }

        descriptionParts.push(title);
      }
    });

    if (checkedList.includes("other")) {
      let title = declineOtherDescription;

      if (descriptionParts.length) {
        title = title.toLowerCase();
      }

      descriptionParts.push(title);
    }

    try {
      setDisabled(true);
      const descriptionToSend = descriptionParts.join(", ");
      await onAcceptClick(descriptionToSend);
      success.set("Rejected successfully");
      close();
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  const handleInputDeclineOtherDescription = (e) => {
    setDeclineOtherDescription(e.target.value);
    setDeclineOtherDescriptionError(null);
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
              Are you sure you want reject this request?
            </div>
          </div>

          <div className="mb-2">
            <CheckboxList
              options={reasons}
              checkedList={checkedList}
              onCheckClick={handleCheckClick}
            />
            <ErrorSpan error={checkedListError} />
          </div>

          {checkedList.includes("other") && (
            <div className="mt-2 mb-2">
              <textarea
                ref={otherReasonDescriptionRef}
                name="operation-description"
                className="form-input w-full"
                rows="4"
                value={declineOtherDescription}
                onChange={handleInputDeclineOtherDescription}
                style={{ resize: "none" }}
                placeholder="Other reason..."
              />
              <ErrorSpan error={declineOtherDescriptionError} />
            </div>
          )}

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
