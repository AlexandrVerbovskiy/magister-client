import { useRef } from "react";
import useChatFileSendAccept from "./useChatFileSendAccept";
import { byteConverter, getFileData } from "../utils";
import STATIC from "../static";

const useSendFileButton = ({ handleSendMedia, setError }) => {
  const fileInputRef = useRef(null);
  const { file, handleSetFile, close, active } = useChatFileSendAccept();

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const maxFileSize = STATIC.LIMITS.CHAT_FILE_SIZE;

    if (!file) {
      return;
    }

    if (file.size > maxFileSize) {
      return setError(
        "File can't be larger than " + byteConverter(maxFileSize)
      );
    }

    getFileData(file, (newFile) => {
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
