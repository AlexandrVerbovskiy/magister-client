import { initAxios } from "../utils";
const { get, post } = initAxios("/comments");

export const getOwnerCommentList = async (params, authToken = null) => {
  const data = await post(`/owner-list`, params, authToken);
  return data.body;
};

export const getRenterCommentList = async (params, authToken = null) => {
  const data = await post(`/renter-list`, params, authToken);
  return data.body;
};

export const ownerCommentApprove = async ({ id }, authToken = null) => {
  const data = await post(`/owner-approve`, { id }, authToken);
  return data.body;
};

export const renterCommentApprove = async ({ id }, authToken = null) => {
  const data = await post(`/renter-approve`, { id }, authToken);
  return data.body;
};

export const ownerCommentReject = async (
  { id, description },
  authToken = null
) => {
  const data = await post(`/owner-reject`, { id, description }, authToken);
  return data.body;
};

export const renterCommentReject = async (
  { id, description },
  authToken = null
) => {
  const data = await post(`/renter-reject`, { id, description }, authToken);
  return data.body;
};

export const createRenterReview = async (
  { renterCommentInfo, orderId },
  authToken
) => {
  const data = await post(
    `/create-renter-review`,
    { userCommentInfo: renterCommentInfo, orderId },
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
