import { initAxios } from "../utils";
const { get, post } = initAxios("/comments");

export const getListingCommentList = async (params, authToken = null) => {
  const data = await post(`/listing-list`, params, authToken);
  return data.body;
};

export const getOwnerCommentList = async (params, authToken = null) => {
  const data = await post(`/owner-list`, params, authToken);
  return data.body;
};

export const getTenantCommentList = async (params, authToken = null) => {
  const data = await post(`/tenant-list`, params, authToken);
  return data.body;
};

export const listingCommentApprove = async ({ id }, authToken = null) => {
  const data = await post(`/listing-approve`, { id }, authToken);
  return data.body;
};

export const ownerCommentApprove = async ({ id }, authToken = null) => {
  const data = await post(`/owner-approve`, { id }, authToken);
  return data.body;
};

export const tenantCommentApprove = async ({ id }, authToken = null) => {
  const data = await post(`/tenant-approve`, { id }, authToken);
  return data.body;
};

export const listingCommentReject = async (
  { id, description },
  authToken = null
) => {
  const data = await post(`/listing-reject`, { id, description }, authToken);
  return data.body;
};

export const ownerCommentReject = async (
  { id, description },
  authToken = null
) => {
  const data = await post(`/owner-reject`, { id, description }, authToken);
  return data.body;
};

export const tenantCommentReject = async (
  { id, description },
  authToken = null
) => {
  const data = await post(`/tenant-reject`, { id, description }, authToken);
  return data.body;
};
