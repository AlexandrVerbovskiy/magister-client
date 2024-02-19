import { initAxios } from "../utils";
const { get, post } = initAxios("/user-event-logs");

export const getUserEventLogList = async (body, authToken) => {
  const data = await post("/list", body, authToken);
  return data.body;
};
