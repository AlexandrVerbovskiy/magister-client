import ErrorSpan from "../ErrorSpan";
import ModalBlank from "../ModalBlank";

const ModalWithDescription = ({
  accessModalOpen,
  setAccessModalOpen,
  question,
  descriptionLabel,
  description,
  handleInputDescription,
  descriptionError,
  handleAcceptClick,
  acceptButtonText,
  disabled = false,
}) => {
  return (
    <ModalBlank
      id="operation-decline"
      modalOpen={accessModalOpen}
      setModalOpen={setAccessModalOpen}
    >
      <div className="p-5 flex space-x-4">
        <div style={{ width: "100%" }}>
          <div className="mb-2">
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {question}
            </div>
          </div>
          <div className="text-sm mb-2">
            <div className="space-y-2">
              <p>{descriptionLabel}</p>
            </div>
          </div>

          <div className="mb-2">
            <textarea
              name="operationDescription"
              className="form-input w-full"
              rows="6"
              value={description}
              onChange={handleInputDescription}
              style={{ resize: "none" }}
            />
            <ErrorSpan error={descriptionError} />
          </div>

          <div className="flex flex-wrap justify-end space-x-2">
            <button
              disabled={disabled}
              onClick={() => setAccessModalOpen(false)}
              className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              disabled={disabled}
              onClick={handleAcceptClick}
              className="btn bg-rose-500 hover:bg-rose-600 text-white"
            >
              {acceptButtonText}
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
};

export default ModalWithDescription;
