import { initAxios, serviceWrapper } from "../utils";
const axios = initAxios("/logs");

export const getLogById = async (id) => {
  const data = await serviceWrapper(axios.get(`/get-by-id/${id}`));
  return data.body;
};

export const getLogList = async (body) => {
  const data = await serviceWrapper(axios.post("/list", body));
  return data.body;
};
