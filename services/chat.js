import { initAxios } from "../utils";
const { get, post } = initAxios("/chat");

export const getChatList = async ({ chatType, lastChatId }, authToken) => {
  const data = await post(`/chat-list`, { chatType, lastChatId }, authToken);
  return data.body;
};
