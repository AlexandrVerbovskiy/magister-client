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

export const getOwnerListingListOptions = async (params, authToken = null) => {
  const data = await post(`/owner-listing-list-options`, params, authToken);
  return data.body;
};

export const getListingFullByIdOptions = async (id, authToken = null) => {
  const data = await get(`/listing-full-by-id-options/${id}`, authToken);
  return data.body;
};

export const getOrderFullByIdOptions = async (id, authToken = null) => {
  const data = await get(`/order-full-by-id-options/${id}`, authToken);
  return data.body;
};

export const getTenantListingScanRentalCode = async (token, authToken) => {
  const data = await get(
    `/tenant-scanning-listing-rental-code/${token}`,
    authToken
  );
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

export const getSenderPaymentListOptions = async (params, authToken) => {
  const data = await post(`/sender-payment-list-options`, params, authToken);
  return data.body;
};

export const getAdminSenderPaymentListOptions = async (params, authToken) => {
  const data = await post(`/admin-sender-payment-list-options`, params, authToken);
  return data.body;
};

export const getRecipientPaymentListOptions = async (params, authToken) => {
  const data = await post(`/recipient-payment-list-options`, params, authToken);
  return data.body;
};

export const getAdminRecipientPaymentListOptions = async (params, authToken) => {
  const data = await post(`/admin-recipient-payment-list-options`, params, authToken);
  return data.body;
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

export const getBookingListOptions = async (params, authToken) => {
  const data = await post("/booking-list-options", params, authToken);
  return data.body;
};

export const getAdminBookingsListPageOptions = async (params, authToken) => {
  const data = await post("/admin-booking-list-options", params, authToken);
  return data.body;
};

export const getOrderListOptions = async (params, authToken) => {
  const data = await post("/order-list-options", params, authToken);
  return data.body;
};

export const getAdminOrderListPageOptions = async (params, authToken) => {
  const data = await post("/admin-order-list-options", params, authToken);
  return data.body;
};

export const getAdminOrderListOptions = async (params, authToken) => {
  const data = await post("/admin-order-list-options", params, authToken);
  return data.body;
};

export const getAdminBookingInfo = async (id, authToken) => {
  const data = await get("/admin-full-booking-info-options/" + id, authToken);
  return data.body;
};

export const getAdminOrderInfo = async (id, authToken) => {
  const data = await get("/admin-full-order-info-options/" + id, authToken);
  return data.body;
};
