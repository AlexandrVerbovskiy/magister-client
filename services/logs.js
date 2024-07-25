import { initAxios } from "../utils";
const { get, post } = initAxios("/logs");

export const getLogById = async (id, authToken) => {
  const data = await get(`/get-by-id/${id}`, authToken);
  return data.body;
};

export const getLogList = async (body, authToken) => {
  const data = await post("/list", body, authToken);
  return data.body;
};
