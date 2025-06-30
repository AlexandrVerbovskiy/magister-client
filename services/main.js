import { initAxios } from "../utils";
const { get, post } = initAxios("/main");

export const getIndexOptions = async (authToken = null) => {
  const data = await get(`/index-options`, authToken);
  return data.body;
};

export const getViewPageWithCategoriesOptions = async () => {
  const data = await get(`/view-page-options`);
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

export const getOrderInfoForPayByCreditCardOptions = async (
  id,
  authToken = null
) => {
  const data = await get(`/get-order-for-card-pay-options/${id}`, authToken);
  return data.body;
};

export const getOrderFullByIdOptions = async (id, authToken = null) => {
  const data = await get(`/order-full-by-id-options/${id}`, authToken);
  return data.body;
};

export const getOrderFullByIdForDisputeOptions = async (
  id,
  authToken = null
) => {
  const data = await get(
    `/order-full-by-id-for-dispute-options/${id}`,
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

export const getAdminSenderPaymentListOptions = async (params, authToken) => {
  const data = await post(
    `/admin-sender-payment-list-options`,
    params,
    authToken
  );
  return data.body;
};

export const getAdminSenderPaymentOptions = async (id, authToken) => {
  const data = await get(`/admin-sender-payment-options/${id}`, authToken);
  return data.body;
};

export const getAdminRecipientPaymentOptions = async (id, authToken) => {
  const data = await get(`/admin-recipient-payment-options/${id}`, authToken);
  return data.body;
};

export const getAdminRecipientPaymentListOptions = async (
  params,
  authToken
) => {
  const data = await post(
    `/admin-recipient-payment-list-options`,
    params,
    authToken
  );
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

export const getUserProfileEditPageOptions = async (paypalCode, authToken) => {
  const data = await post(
    `/user-profile-edit-options`,
    { paypalCode },
    authToken
  );
  return data.body;
};

export const getDashboardPageOptions = async (body, authToken) => {
  const data = await post(`/dashboard-page-options`, body, authToken);
  return data.body;
};

export const getDashboardOptions = async (body, authToken) => {
  const data = await post(`/dashboard-options`, body, authToken);
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

export const getAdminOrderInfo = async (id, authToken) => {
  const data = await get("/admin-full-order-info-options/" + id, authToken);
  return data.body;
};

export const getOrderInvoiceOptions = async (id, authToken) => {
  const data = await get(`/get-order-invoice-options/${id}`, authToken);
  return data.body;
};

export const getWalletInfoOptions = async (authToken) => {
  const data = await get(`/get-wallet-info-options`, authToken);
  return data.body;
};

export const getAdminWaitingRefundOptions = async (id, authToken) => {
  const data = await get(`/admin-waiting-refund-options/${id}`, authToken);
  return data.body;
};

export const getWaitingRefundOptions = async (id, authToken) => {
  const data = await get(`/get-waiting-refund-options/${id}`, authToken);
  return data.body;
};

export const getAdminDashboardPageOptions = async (body, authToken) => {
  const data = await post(`/get-admin-dashboard-page-option`, body, authToken);
  return data.body;
};

export const getAdminDashboardOptions = async (body, authToken) => {
  const data = await post(`/get-admin-dashboard-option`, body, authToken);
  return data.body;
};

export const getOrderReviewByRenterOptions = async (id, authToken) => {
  const data = await get(`/get-order-review-by-renter/${id}`, authToken);
  return data.body;
};

export const getOrderReviewByOwnerOptions = async (id, authToken) => {
  const data = await get(`/get-order-review-by-owner/${id}`, authToken);
  return data.body;
};

export const getAdminRenterCommentListOptions = async (params, authToken) => {
  const data = await post(
    `/admin-renter-comment-list-options`,
    params,
    authToken
  );
  return data.body;
};

export const getAdminOwnerCommentListOptions = async (params, authToken) => {
  const data = await post(
    `/admin-owner-comment-list-options`,
    params,
    authToken
  );
  return data.body;
};

export const getAdminDisputeListOptions = async (params, authToken) => {
  const data = await post(`/admin-dispute-list-options`, params, authToken);
  return data.body;
};

export const getUserChatOptions = async (
  { chatType, id = null },
  authToken
) => {
  const data = await post(`/user-chat-options`, { chatType, id }, authToken);
  return data.body;
};

export const getAdminChatOptions = async ({ id = null }, authToken) => {
  const data = await post(`/admin-chat-options`, { id }, authToken);
  return data.body;
};

export const getAdminOthersListingCategoriesOptions = async (
  params,
  authToken
) => {
  const data = await post(
    `/admin-searched-others-categories-list-options`,
    params,
    authToken
  );
  return data.body;
};

export const getAdminCreateCategoryByOthersOptions = async (authToken) => {
  const data = await get(`/admin-create-category-by-others-options`, authToken);
  return data.body;
};

export const getAddressCoords = async (address, authToken) => {
  const data = await post(`/address-to-coords`, { address }, authToken);
  return data.body;
};

export const getCoordsAddress = async ({ lat, lng }, authToken) => {
  const data = await post(`/coords-to-address`, { lat, lng }, authToken);
  return data.body;
};

export const getOrderCheckoutInfo = async (id, authToken) => {
  const data = await get(`/get-order-checkout-info/${id}`, authToken);
  return data.body;
};

export const getTableRelations = async (authToken) => {
  const data = await get(`/get-table-relations`, authToken);
  return data.body;
};
