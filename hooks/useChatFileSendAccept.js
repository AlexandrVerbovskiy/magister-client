import React, { useState } from "react";

const useChatFileSendAccept = () => {
  const [file, setFile] = useState(null);
  const [active, setActive] = useState(false);

  const close = () => {
    setActive(false);
    setFile(null);
  };

  const open = () => {
    setActive(true);
  };

  const handleSetFile = (newFile) => {
    setFile(newFile);
    setActive(true);
    open();
  };

  return { file, handleSetFile, close, active };
};

export default useChatFileSendAccept;
