import FilePreviewCard from "./FilePreviewCard";
import ModalBlank from "../ModalBlank";

const FileModal = ({ handleSendClick, file, modalOpen, handleCloseModal }) => {
  if (!modalOpen) {
    return;
  }

  return (
    <ModalBlank
      id="file-send-modal"
      modalOpen={modalOpen}
      setModalOpen={handleCloseModal}
    >
      <div className="p-5 flex space-x-4">
        <div>
          <div className="mb-2">
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              <span>Are you sure you want to send this file?</span>
            </div>
          </div>
          <div className="text-sm mb-10">
            <div className="space-y-2">
              <FilePreviewCard file={file} />
            </div>
          </div>
          <div className="flex flex-wrap justify-end space-x-2">
            <button
              className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseModal();
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSendClick}
              className="btn border-indigo-200 dark:border-indigo-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-indigo-600 dark:text-indigo-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
};

export default FileModal;
