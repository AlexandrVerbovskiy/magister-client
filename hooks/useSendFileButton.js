import { useRef } from "react";
import useChatFileSendAccept from "./useChatFileSendAccept";
import { getFileData } from "../utils";

const useSendFileButton = ({ handleSendMedia }) => {
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

  return {
    file,
    close,
    active,
    fileInputRef,
    handleFileInputChange,
    handleSend,
  };
};

export default useSendFileButton;
