import { initAxios } from "../utils";
const { get, post } = initAxios("/main");

export const getIndexOptions = async (authToken = null) => {
  const data = await get(`/index-options`, authToken);
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

export const getTenantListingScanRentalCode = async (token, authToken) => {
  const data = await get(
    `/tenant-scanning-listing-rental-code/${token}`,
    authToken
  );
  return data.body;
};

export const getOwnerListingScanRentalCode = async (token, authToken) => {
  const data = await get(
    `/owner-scanning-listing-rental-code/${token}`,
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

export const getUserProfileEditPageOptions = async (authToken) => {
  const data = await get(`/user-profile-edit-options`, authToken);
  return data.body;
};

export const getSettingsPageOptions = async (authToken) => {
  const data = await get(`/settings-options`, authToken);
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

export const getAdminListingDefectsEditOptions = async (authToken) => {
  const data = await get(`/admin-listing-defects-edit-options`, authToken);
  return data.body.defects;
};

export const getAdminListingDefectQuestionsEditOptions = async (authToken) => {
  const data = await get(
    `/admin-listing-defect-questions-edit-options`,
    authToken
  );
  return data.body.questions;
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

export const getAdminIndexPageOptions = async (body, authToken) => {
  const data = await post(`/get-admin-index-page-option`, body, authToken);
  return data.body;
};

export const getOrderReviewByTenantOptions = async (id, authToken) => {
  const data = await get(`/get-order-review-by-tenant/${id}`, authToken);
  return data.body;
};

export const getOrderReviewByOwnerOptions = async (id, authToken) => {
  const data = await get(`/get-order-review-by-owner/${id}`, authToken);
  return data.body;
};

export const getAdminTenantCommentListOptions = async (params, authToken) => {
  const data = await post(
    `/admin-tenant-comment-list-options`,
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

export const getAdminListingCommentListOptions = async (params, authToken) => {
  const data = await post(
    `/admin-listing-comment-list-options`,
    params,
    authToken
  );
  return data.body;
};

export const createRenterReview = async (
  { tenantCommentInfo, orderId },
  authToken
) => {
  const data = await post(
    `/create-tenant-review`,
    { tenantCommentInfo, orderId },
    authToken
  );
  return data.body;
};

export const createOwnerReview = async (
  { ownerCommentInfo, listingCommentInfo, orderId },
  authToken
) => {
  const data = await post(
    `/create-owner-review`,
    { ownerCommentInfo, listingCommentInfo, orderId },
    authToken
  );
  return data.body;
};

export const getAdminDisputeListOptions = async (params, authToken) => {
  const data = await post(`/admin-dispute-list-options`, params, authToken);
  return data.body;
};

export const getUserChatOptions = async (id, authToken) => {
  const data = await post(`/user-chat-options`, { id }, authToken);
  return data.body;
};
