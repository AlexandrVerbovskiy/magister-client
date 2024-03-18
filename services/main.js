import { initAxios } from "../utils";
const { get, post } = initAxios("/main");

export const getIndexOptions = async () => {
  const data = await get(`/index-options`);
  return data.body;
};

export const getListingListOptions = async (params, authToken = null) => {
  const data = await post(`/listing-list-options`, params, authToken);
  return data.body;
};

export const getListingFullByIdOptions = async (id, authToken = null) => {
  const data = await get(`/listing-full-by-id-options/${id}`, authToken);
  return data.body;
};

export const getCreateListingOptions = async (authToken) => {
  const data = await get(`/create-listing-options`, authToken);
  return data.body;
};

export const getUpdateListingOptions = async (id, authToken) => {
  const data = await get(`/update-listing-options/${id}`, authToken);
  return data.body;
};

export const getCurrentUserDocumentsPageOptions = async (authToken) => {
  const data = await get(`/current-user-documents-options`, authToken);
  return data.body;
};

export const getAdminListingCreatePageOptions = async (authToken) => {
  const data = await get(`/admin-create-listing-options`, authToken);
  return data.body;
};

export const getAdminListingEditPageOptions = async (id, authToken) => {
  const data = await get(`/admin-update-listing-options/${id}`, authToken);
  return data.body;
};

export const getAdminUserListPageOptions = async (params, authToken) => {
  const data = await post(`/admin-user-list-options`, params, authToken);
  return data.body;
};

export const getAdminLogListPageOptions = async (params, authToken) => {
  const data = await post(`/admin-log-list-options`, params, authToken);
  return data.body;
};

export const getAdminUserEventLogListPageOptions = async (
  params,
  authToken
) => {
  const data = await post(
    `/admin-user-event-log-list-options`,
    params,
    authToken
  );
  return data.body;
};

export const getAdminUserUserVerifyRequestListPageOptions = async (
  params,
  authToken
) => {
  const data = await post(
    `/admin-user-verify-request-list-options`,
    params,
    authToken
  );
  return data.body;
};

export const getAdminSearchedWordListPageOptions = async (
  params,
  authToken
) => {
  const data = await post(
    `/admin-searched-word-list-options`,
    params,
    authToken
  );
  return data.body;
};

export const getUserListingListOptions = async (params, authToken) => {
  const data = await post(`/user-listing-list-options`, params, authToken);
  return data.body;
};

export const getAdminListingListPageOptions = async (params, authToken) => {
  const data = await post(`/admin-listing-list-options`, params, authToken);
  return data.body;
};

export const getUserNameIdList = async (params) => {
  const data = await post(`/user-name-id-list`, params);
  return data.body.list;
};

export const getAdminListingApprovalRequestListPageOptions = async (
  params,
  authToken
) => {
  const data = await post(
    `/admin-listing-approval-request-list-options`,
    params,
    authToken
  );
  return data.body;
};

export const getAdminListingApprovalRequestOption = async (
  requestId,
  authToken
) => {
  const data = await get(
    `/admin-listing-approval-request-options/${requestId}`,
    authToken
  );
  return data.body;
};

export const getUserDocumentsPageOption = async (userId, authToken) => {
  const data = await get(`/user-documents-options/${userId}`, authToken);
  return data.body;
};

export const getUserProfileEditPageOptions = async (authToken) => {
  const data = await get(`/user-profile-edit-options`, authToken);
  return data.body;
};

export const getSettingsPageOptions = async (authToken) => {
  const data = await get(`/settings-options`, authToken);
  return data.body;
};
