import { useContext, useEffect, useState } from "react";
import useChatList from "./useChatList";
import useChatMessageList from "./useChatMessageList";
import { changeLocation, indicateMediaTypeByExtension } from "../utils";
import { IndiceContext } from "../contexts";
import useChatWindowsChanger from "./useChatWindowsChanger";
import useMediaActions from "./useMediaActions";

const useChat = ({
  chatId: baseChatId = null,
  chats,
  chatsCanShowMore,
  options,
  messages,
  messagesCanShowMore,
  authToken,
  entity = null,
}) => {
  const { io, sessionUser } = useContext(IndiceContext);
  const [selectedChatId, setSelectedChatId] = useState(baseChatId);

  const { createMediaActions, onSuccessSendBlobPart, onStopSendMedia } =
    useMediaActions();

  const windowProps = useChatWindowsChanger(selectedChatId);

  const listProps = useChatList({
    chats,
    canShowMore: chatsCanShowMore,
    options,
    authToken,
  });

  const bodyProps = useChatMessageList({
    messages,
    canShowMore: messagesCanShowMore,
    chatId: selectedChatId,
    options,
    authToken,
    entity,
  });

  useEffect(() => {
    if (!selectedChatId) {
      return;
    }

    setTimeout(() => windowProps.scrollBodyBottom(), 0);
  }, [selectedChatId]);

  useEffect(() => {
    if (!io) {
      return;
    }

    io.on("file-part-uploaded", async (data) => {
      const nextPartData = await onSuccessSendBlobPart(data.tempKey);

      if (!nextPartData) {
        return;
      }

      if (nextPartData == "done" && data.message) {
        bodyProps.successCreatedMessage(data.message, data.tempKey);
        listProps.onGetMessage(data.message);
        return;
      }

      bodyProps.onUpdateMessagePercent(nextPartData["percent"], data.tempKey);
      io.emit("file-part-upload", { ...nextPartData });
    });

    io.on("success-sended-message", (data) =>
      bodyProps.successCreatedMessage(data.message, data.tempKey)
    );

    io.on("message-cancelled", async (data) =>
      bodyProps.onCancelledMessage(data.tempKey)
    );

    io.on("get-message", (data) => {
      listProps.onGetMessage(data.message);
      bodyProps.appendMessageToChat(data.message);
    });

    io.on("message-updated", async (data) =>
      bodyProps.updateMessage(data.message, data.message.id)
    );

    io.on("success-message-updated", async (data) =>
      bodyProps.updateMessage(data.message, data.message.id)
    );

    io.on("message-deleted", async (data) => {
      bodyProps.deleteMessage(
        data.deletedMessage.chatId,
        data.deletedMessage.id,
        data.replacementMessage
      );

      listProps.deleteMessage(
        data.deletedMessage.chatId,
        data.deletedMessage.id,
        data.previousMessage
      );
    });

    io.on("success-message-deleted", async (data) => {
      bodyProps.deleteMessage(
        data.deletedMessage.chatId,
        data.deletedMessage.id,
        data.replacementMessage
      );

      listProps.deleteMessage(
        data.deletedMessage.chatId,
        data.deletedMessage.id,
        data.previousMessage
      );
    });

    io.on("start-typing", (data) => listProps.startTyping(data.chatId));
    io.on("finish-typing", (data) => listProps.finishTyping(data.chatId));
    io.on("opponent-online", (data) => listProps.opponentOnline(data.chatId));
    io.on("opponent-offline", (data) => listProps.opponentOffline(data.chatId));
  }, [io]);

  const handleSelectChat = async (chatId) => {
    await bodyProps.handleChangeChat(chatId);
    setSelectedChatId(chatId);
    changeLocation(`/dashboard/chat/${chatId}`);
  };

  const handleChangeType = (type) => {
    listProps.changeType(type);
    bodyProps.reset();
    setSelectedChatId(null);
  };

  const sendTextMessage = ({ chatId, text, dop = {} }) => {
    const messageType = "text";

    const dataToSend = {
      chatId,
      text,
      ...dop,
    };

    const createdAt = new Date().toISOString();

    const dataToInsert = {
      chatId: chatId,
      type: messageType,
      content: { text },
      senderId: sessionUser.id,
      senderPhoto: sessionUser.photo,
      createdAt,
      ...dop,
    };

    bodyProps.appendMessageToChat(dataToInsert);
    listProps.updateChatInfo(chatId, {
      messageId: null,
      messageType: messageType,
      messageSenderId: sessionUser.id,
      messageCreatedAt: createdAt,
    });

    setTimeout(() => windowProps.scrollBodyBottom(), 0);
    io.emit("send-message", dataToSend);
  };

  const updateMessage = (messageId, text) => {
    bodyProps.updateMessage({ content: text }, messageId);

    io.emit("update-message", {
      messageId,
      text,
    });
  };

  const deleteMessage = ({ chatId, messageId }) => {
    bodyProps.deleteMessage(chatId, messageId, null);

    io.emit("delete-message", {
      messageId,
    });
  };

  const startTyping = (chatId) => {
    io.emit("start-typing", {
      chatId,
    });
  };

  const finishTyping = (chatId) => {
    io.emit("finish-typing", {
      chatId,
    });
  };

  const sendMediaMessage = async ({
    chatId,
    data,
    dataType,
    filetype,
    filename,
  }) => {
    const dataToSend = await createMediaActions({
      chatId,
      data,
      dataType,
      filetype,
      filename,
    });
    const messageType = indicateMediaTypeByExtension(filetype);
    const createdAt = new Date().toISOString();

    const dataToInsert = {
      chatId,
      type: messageType,
      content: { filename: filename, path: data },
      senderId: sessionUser.id,
      tempKey: dataToSend["tempKey"],
      senderPhoto: sessionUser.photo,
      createdAt,
    };

    bodyProps.appendMessageToChat(dataToInsert);
    listProps.updateChatInfo(chatId, {
      messageId: null,
      messageType: messageType,
      messageSenderId: sessionUser.id,
      messageCreatedAt: createdAt,
    });

    setTimeout(() => windowProps.scrollBodyBottom(), 0);

    io.emit("file-part-upload", { ...dataToSend });
  };

  const stopSendMediaMessage = (tempKey) => {
    onStopSendMedia(tempKey);
    io.emit("stop-file-upload", { tempKey });
  };

  const selectedChat =
    listProps.chats.find((chat) => chat.id === selectedChatId) ?? null;

  return {
    listProps,
    bodyProps,
    handleSelectChat,
    selectedChat,
    handleChangeType,
    actions: {
      sendTextMessage,
      updateMessage,
      deleteMessage,
      startTyping,
      finishTyping,
      sendMediaMessage,
      stopSendMediaMessage,
    },
    windowProps,
    stopSendMediaMessage,
  };
};

export default useChat;
