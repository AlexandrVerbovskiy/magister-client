import { initAxios } from "../utils";
const { get, post } = initAxios("/comments");

export const getOwnerCommentList = async (params, authToken = null) => {
  const data = await post(`/owner-list`, params, authToken);
  return data.body;
};

export const getWorkerCommentList = async (params, authToken = null) => {
  const data = await post(`/worker-list`, params, authToken);
  return data.body;
};

export const ownerCommentApprove = async ({ id }, authToken = null) => {
  const data = await post(`/owner-approve`, { id }, authToken);
  return data.body;
};

export const workerCommentApprove = async ({ id }, authToken = null) => {
  const data = await post(`/worker-approve`, { id }, authToken);
  return data.body;
};

export const ownerCommentReject = async (
  { id, description },
  authToken = null
) => {
  const data = await post(`/owner-reject`, { id, description }, authToken);
  return data.body;
};

export const workerCommentReject = async (
  { id, description },
  authToken = null
) => {
  const data = await post(`/worker-reject`, { id, description }, authToken);
  return data.body;
};

export const createWorkerReview = async (
  { workerCommentInfo, orderId },
  authToken
) => {
  const data = await post(
    `/create-worker-review`,
    { userCommentInfo: workerCommentInfo, orderId },
    authToken
  );
  return data.body;
};

export const createOwnerReview = async (
  { ownerCommentInfo, orderId },
  authToken
) => {
  const data = await post(
    `/create-owner-review`,
    { userCommentInfo: ownerCommentInfo, orderId },
    authToken
  );
  return data.body;
};
