import { useContext, useEffect } from "react";
import { IndiceContext } from "../contexts";
import { indicateMediaTypeByExtension } from "../utils";

const useChatBase = ({
  bodyProps,
  listProps,
  scrollBodyBottom,
  prefix = "",
  selectedChatId,
}) => {
  const { io, sessionUser } = useContext(IndiceContext);

  useEffect(() => {
    if (!io) {
      return;
    }

    io.on(prefix + "file-part-uploaded", async (data) => {
      const nextPartData = await bodyProps.onSuccessSendBlobPart(data.tempKey);

      if (!nextPartData) {
        return;
      }

      if (nextPartData == "done" && data.message) {
        bodyProps.successCreatedMessage(data.message, data.tempKey);
        listProps.onGetMessage(data.message, data.opponent);
        return;
      }

      bodyProps.onUpdateMessagePercent({
        percent: nextPartData["percent"],
        chatId: nextPartData["chatId"],
        tempKey: data.tempKey,
      });

      io.emit(prefix + "file-part-upload", { ...nextPartData });
    });

    io.on(prefix + "success-sended-message", (data) => {
      bodyProps.successCreatedMessage(data.message, data.tempKey);
      listProps.onGetMessage(data.message, data.opponent);
    });

    io.on(prefix + "message-cancelled", async (data) =>
      bodyProps.onCancelledMessage(data.tempKey)
    );

    io.on(prefix + "get-message", (data) => {
      bodyProps.appendMessageToChat(data.message);
      listProps.onGetMessage(data.message, data.opponent);
    });

    io.on(prefix + "update-order-message", (data) => {
      bodyProps.appendMessageToChat(data.message);
      bodyProps.handleOrderUpdate(data.orderPart);
      listProps.onGetMessage(data.message, data.opponent);
    });

    io.on(prefix + "update-order", (data) => {
      bodyProps.handleOrderUpdate(data.orderPart);
    });

    io.on(prefix + "message-updated", async (data) =>
      bodyProps.updateMessage(data.message, data.message.id)
    );

    io.on(prefix + "success-message-updated", async (data) =>
      bodyProps.updateMessage(data.message, data.message.id)
    );

    io.on(prefix + "message-deleted", async (data) => {
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

    io.on(prefix + "success-message-deleted", async (data) => {
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

    io.on(prefix + "start-typing", (data) =>
      listProps.startTyping(data.chatId)
    );
    io.on(prefix + "finish-typing", (data) =>
      listProps.finishTyping(data.chatId)
    );
    io.on(prefix + "opponent-online", (data) =>
      listProps.opponentOnline(data.chatId)
    );
    io.on(prefix + "opponent-offline", (data) =>
      listProps.opponentOffline(data.chatId)
    );

    return () => {
      io.emit(prefix + "stop-actions");
      bodyProps.stopAllSendMedia();
    };
  }, [io]);

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
      senderId: sessionUser?.id,
      senderPhoto: sessionUser?.photo,
      isAdminSender: false,
      createdAt,
      ...dop,
    };

    bodyProps.appendMessageToChat(dataToInsert);
    listProps.updateChatInfo(chatId, {
      messageId: null,
      messageType: messageType,
      messageSenderId: sessionUser?.id,
      messageCreatedAt: createdAt,
    });

    scrollBodyBottom();
    io.emit(prefix + "send-message", dataToSend);
  };

  const updateMessage = (messageId, text) => {
    bodyProps.updateMessage(
      { content: { text }, chatId: selectedChatId },
      messageId
    );

    io.emit(prefix + "update-message", {
      messageId,
      text,
    });
  };

  const deleteMessage = ({ chatId, messageId }) => {
    bodyProps.deleteMessage(chatId, messageId, null);

    io.emit(prefix + "delete-message", {
      messageId,
    });
  };

  const startTyping = (chatId) => {
    io.emit(prefix + "start-typing", {
      chatId,
    });
  };

  const finishTyping = (chatId) => {
    io.emit(prefix + "finish-typing", {
      chatId,
    });
  };

  const sendMediaMessage = async ({
    chatId,
    data,
    dataType,
    filetype,
    filename,
    fileSrc,
  }) => {
    const dataToSend = await bodyProps.createMediaActions({
      chatId,
      data,
      dataType,
      filetype,
      filename,
      fileSrc,
    });
    const messageType = indicateMediaTypeByExtension(filetype);
    const createdAt = new Date().toISOString();

    const dataToInsert = {
      chatId,
      type: messageType,
      content: { filename: filename, path: fileSrc },
      senderId: sessionUser?.id,
      tempKey: dataToSend["tempKey"],
      senderPhoto: sessionUser?.photo,
      isAdminSender: false,
      createdAt,
    };

    bodyProps.appendMessageToChat(dataToInsert);
    listProps.updateChatInfo(chatId, {
      messageId: null,
      messageType: messageType,
      messageSenderId: sessionUser?.id,
      messageCreatedAt: createdAt,
    });

    scrollBodyBottom();

    io.emit(prefix + "file-part-upload", { ...dataToSend });
  };

  const stopSendMediaMessage = (tempKey) => {
    bodyProps.onStopSendMedia(tempKey);
    io.emit(prefix + "stop-file-upload", { tempKey });
  };

  return {
    stopSendMediaMessage,
    sendMediaMessage,
    finishTyping,
    startTyping,
    deleteMessage,
    updateMessage,
    sendTextMessage,
  };
};

export default useChatBase;
