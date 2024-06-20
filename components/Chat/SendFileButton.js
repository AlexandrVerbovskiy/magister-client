import { useRef } from "react";
import { getFileData } from "../../utils";
import useChatFileSendAccept from "../../hooks/useChatFileSendAccept";
import SendFilePopup from "./SendFilePopup";
import STATIC from "../../static";

const SendFileButton = ({ handleSendMedia }) => {
  const fileInputRef = useRef(null);
  const { file, handleSetFile, close, active } = useChatFileSendAccept();

  const handleFileInputChange = (e) => {
    if (!e.target.files[0]) return;

    getFileData(e.target.files[0], (newFile) => {
      handleSetFile(newFile);
      fileInputRef.current.value = "";
    });
  };

  const handleSend = () => {
    handleSendMedia(file);
    close();
  };

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
