import { initAxios, serviceWrapper } from "../utils";
const axios = initAxios("/user-verify-requests");

export const getUserVerifyRequestById = async (id) => {
  const data = await serviceWrapper(axios.get(`/get-by-id/${id}`));
  return data.body;
};

export const getUserVerifyRequestList = async (body) => {
  const data = await serviceWrapper(axios.post("/list", body));
  return data.body;
};

export const userVerifyRequestCreate = async () => {
  const data = await serviceWrapper(axios.post("/create"));
  return data.message;
};

export const userVerifyRequestUpdate = async (body) => {
  const data = await serviceWrapper(axios.post("/update", body));
  return data.body;
};
