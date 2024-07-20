import { initAxios } from "../utils";
const { get, post } = initAxios("/user-verify-requests");

export const getUserVerifyRequestById = async (id, authToken) => {
  const data = await get(`/get-by-id/${id}`, authToken);
  return data.body;
};

export const getUserVerifyRequestList = async (body, authToken) => {
  const data = await post("/list", body, authToken);
  return data.body;
};

export const userVerifyRequestUpdate = async (body, authToken) => {
  const data = await post("/update", body, authToken);
  return data.body;
};