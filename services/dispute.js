import { initAxios } from "../utils";
const { get, post } = initAxios("/disputes");

export const getDisputeList = async (params, authToken = null) => {
  const data = await post(`/list`, params, authToken);
  return data.body;
};

export const createDispute = async (
  { orderId, type, description },
  authToken = null
) => {
  const data = await post(`/create`, { orderId, type, description }, authToken);
  return data.body;
};

export const solveDispute = async (
  { disputeId, solution },
  authToken = null
) => {
  const data = await post(`/solve`, { disputeId, solution }, authToken);
  return data.body;
};

export const unsolveDispute = async (disputeId, authToken = null) => {
  const data = await post(`/unsolve`, { disputeId }, authToken);
  return data.body;
};
