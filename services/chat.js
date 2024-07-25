import { initAxios } from "../utils";
const { get, post } = initAxios("/chat");

export const getChatList = async (
  { chatType, chatFilter = "", lastChatId = null },
  authToken
) => {
  const data = await post(
    `/chat-list`,
    { chatFilter, chatType, lastChatId },
    authToken
  );
  return data.body;
};

export const getChatMessageList = async (
  { chatId, lastMessageId = null },
  authToken
) => {
  const data = await post(
    `/chat-message-list`,
    { id: chatId, lastMessageId },
    authToken
  );
  return data.body;
};

export const getChatBaseInfo = async (
  { chatId, lastMessageId = null },
  authToken
) => {
  const data = await post(
    `/chat-base-info`,
    { id: chatId, lastMessageId },
    authToken
  );
  return data.body;
};

export const getAdminChatList = async (
  { chatType, chatFilter = "", lastChatId = null },
  authToken
) => {
  const data = await post(
    `/admin-chat-list`,
    { chatFilter, chatType, lastChatId },
    authToken
  );
  return data.body;
};

export const getAdminChatMessageList = async (
  { chatId, lastMessageId = null },
  authToken
) => {
  const data = await post(
    `/admin-chat-message-list`,
    { id: chatId, lastMessageId },
    authToken
  );
  return data.body;
};

export const getAdminChatBaseInfo = async (
  { chatId, lastMessageId = null },
  authToken
) => {
  const data = await post(
    `/admin-chat-base-info`,
    { id: chatId, lastMessageId },
    authToken
  );
  return data.body;
};
