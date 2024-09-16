import { useRef } from "react";
import { generateRandomString, splitBlob, splitDataIntoChunks } from "../utils";
import STATIC from "../static";

const useMediaActions = () => {
  const mediaActionsRef = useRef({});

  async function createMediaActions({
    chatId,
    data,
    dataType,
    filetype,
    filename,
    fileSrc,
  }) {
    const tempFileKey = generateRandomString();
    let arr = null;
    let contentPath = null;

    if (dataType == "media") {
      contentPath = fileSrc;
      arr = await splitBlob(data, STATIC.BLOB_CHUNK_SIZE, data.type);
    } else if (dataType == "notmedia") {
      arr = splitDataIntoChunks(data, STATIC.UNBLOB_CHUNK_SIZE, data.type);
    } else {
      return;
    }

    mediaActionsRef.current[tempFileKey] = {
      tempKey: tempFileKey,
      data: arr,
      percent: 0,
      inQueue: [...arr],
      filetype,
      filename,
      chatId,
      contentPath,
      createdAt: new Date(),
    };

    const blobToSend = mediaActionsRef.current[tempFileKey]["inQueue"][0];
    const last = mediaActionsRef.current[tempFileKey]["inQueue"].length == 1;

    return {
      tempKey: tempFileKey,
      filetype,
      data: blobToSend,
      last,
      filename,
      chatId,
    };
  }

  async function onSuccessSendBlobPart(key) {
    const action = mediaActionsRef.current[key];

    if (!action) {
      return null;
    }

    if (action["inQueue"].length == 1) {
      delete mediaActionsRef.current[key];
      return "done";
    } else {
      action["inQueue"].shift();
    }

    action["percent"] =
      ((action["data"].length - action["inQueue"].length) /
        action["data"].length) *
      100;

    const blob = mediaActionsRef.current[key]["inQueue"][0];
    const filetype = mediaActionsRef.current[key]["filetype"];
    const filename = mediaActionsRef.current[key]["filename"];
    const chatId = mediaActionsRef.current[key]["chatId"];
    const last = action["inQueue"].length == 1;

    return {
      tempKey: key,
      filetype,
      data: blob,
      last,
      filename,
      chatId,
      percent: action["percent"],
    };
  }

  function onStopSendMedia(key) {
    if (mediaActionsRef.current[key]) {
      delete mediaActionsRef.current[key];
    }
  }

  function stopAllSendMedia() {
    Object.keys(mediaActionsRef.current).forEach(
      (key) => delete mediaActionsRef.current[key]
    );
  }

  function getChatMessages(chatId) {
    const result = [];

    Object.keys(mediaActionsRef.current).forEach((key) => {
      if (mediaActionsRef.current[key].chatId === chatId) {
        result.push(mediaActionsRef.current[key]);
      }
    });

    return result.sort((a, b) => a.createdAt - b.createdAt);
  }

  return {
    createMediaActions,
    onSuccessSendBlobPart,
    onStopSendMedia,
    getChatMessages,
    stopAllSendMedia,
  };
};

export default useMediaActions;
