import SendFilePopup from "./SendFilePopup";
import useSendFileButton from "../../hooks/useSendFileButton";
import STATIC from "../../static";

const SendFileButton = ({ handleSendMedia }) => {
  const {
    file,
    close,
    active,
    fileInputRef,
    handleFileInputChange,
    handleSend,
  } = useSendFileButton({ handleSendMedia });

  return (
    <>
      <button
        className="file-attachment-btn d-inline-block"
        data-toggle="tooltip"
        data-placement="top"
        title="File Attachment"
        type="button"
        onClick={() => fileInputRef.current.click()}
      >
        <i className="bx bx-paperclip"></i>
      </button>

      <input
        ref={fileInputRef}
        onChange={handleFileInputChange}
        type="file"
        accept={STATIC.FILE_ACCEPT}
        className="d-none"
      />

      <SendFilePopup
        handleSendClick={handleSend}
        file={file}
        active={active}
        close={close}
      />
    </>
  );
};

export default SendFileButton;
