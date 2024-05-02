import { initAxios } from "../utils";
const { get, post } = initAxios("/recipient-payments");

export const getRecipientPaymentList = async (body, authToken) => {
  const data = await post("/list", body, authToken);
  return data.body;
};
