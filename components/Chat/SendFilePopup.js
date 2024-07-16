import BaseModal from "../_App/BaseModal";
import FilePreviewCard from "./FilePreviewCard";

const SendFilePopup = ({ handleSendClick, file, active, close }) => {
  if (!active) {
    return;
  }

  return (
    <BaseModal
      active={active}
      closeModal={close}
      needCloseBtn={true}
      className="modal-padding-bottom-20 modal-margin-bottom-20"
    >
      <span className="sub-title mb-2">
        <span>Are you sure you want to send this file?</span>
      </span>

      <FilePreviewCard file={file} />

      <div className="form mt-4">
        <div className="d-flex gap-2">
          <button type="button" className="button-danger" onClick={close}>
            Cancel
          </button>
          <button type="button" onClick={handleSendClick}>
            Send
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default SendFilePopup;
