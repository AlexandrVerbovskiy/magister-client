import { initAxios } from "../utils";
const { get, post } = initAxios("/listing-approval-requests");

export const getAdminListingApprovalRequestsList = async (params, authToken) => {
  const data = await post(`/admin-list`, params, authToken);
  return data.body;
};

export const createListingApprovalRequest = async (
  listingId,
  authToken
) => {
  const data = await post(`/create`, { listingId }, authToken);
  return data.body;
};

export const approveListingApprovalRequest = async (
  {listingId},
  authToken
) => {
  const data = await post(`/approve`, { listingId }, authToken);
  return data.body;
};

export const rejectListingApproveRequest = async (
  { listingId, description },
  authToken
) => {
  const data = await post(`/reject`, { listingId, description }, authToken);
  return data.body;
};