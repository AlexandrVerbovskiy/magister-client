import { initAxios } from "../utils";
const { get, post } = initAxios("/system");

export const getUserLogActive = async (authToken) => {
  const data = await get(`/get-user-log-active`, authToken);
  return data.body.active;
};

export const setUserLogActive = async (active, authToken) => {
  const data = await post("/set-user-log-active", { active }, authToken);
  return data.body.active;
};
