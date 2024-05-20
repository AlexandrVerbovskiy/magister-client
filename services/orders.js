import { initAxios } from "../utils";
const { get, post } = initAxios("/orders");

export const createOrder = async (
  { pricePerDay, startDate, endDate, listingId, feeActive, message },
  authToken
) => {
  const data = await post(
    `/create`,
    { pricePerDay, startDate, endDate, listingId, feeActive, message },
    authToken
  );
  return data.body.id;
};

export const getOrderFullInfo = async (id, authToken) => {
  const data = await get(`/get-full-by-id/${id}`, authToken);
  return data.body;
};

export const getBookingList = async (params, authToken) => {
  const data = await post(`/booking-list`, params, authToken);
  return data.body;
};

export const getAdminBookingList = async (params, authToken) => {
  const data = await post(`/admin-booking-list`, params, authToken);
  return data.body;
};

export const getOrderList = async (params, authToken) => {
  const data = await post(`/order-list`, params, authToken);
  return data.body;
};

export const getAdminOrderList = async (params, authToken) => {
  const data = await post(`/admin-order-list`, params, authToken);
  return data.body;
};

export const acceptOrder = async (id, authToken) => {
  const data = await post(`/accept-booking`, { id }, authToken);
  return data.body;
};

export const paypalOrderPayed = async (orderId, authToken) => {
  const data = await post(`/paypal-order-payed`, { orderId }, authToken);
  return data.body;
};

export const approveClientGotListing = async (token, questions, authToken) => {
  const data = await post(
    `/approve-client-got-listing`,
    { token, questions },
    authToken
  );
  return data.body;
};

export const orderCancelByTenant = async ({ id, description }, authToken) => {
  const data = await post(`/cancel-by-tenant`, { id, description }, authToken);
  return data.body;
};

export const orderCancelByOwner = async ({ id, description }, authToken) => {
  const data = await post(`/cancel-by-owner`, { id, description }, authToken);
  return data.body;
};

export const orderAcceptCancelByTenant = async (id, authToken) => {
  const data = await post(`/accept-cancel-by-tenant`, { id }, authToken);
  return data.body;
};

export const orderAcceptCancelByOwner = async (id, authToken) => {
  const data = await post(`/accept-cancel-by-owner`, { id }, authToken);
  return data.body;
};

export const orderFullCancelPayed = async (id, authToken) => {
  const data = await post(`/full-cancel-payed`, { id }, authToken);
  return data.body;
};

export const orderFullCancel = async (id, authToken) => {
  const data = await post(`/full-cancel`, { id }, authToken);
  return data.body;
};

export const rejectOrder = async (id, authToken) => {
  const data = await post(`/reject-booking`, { id }, authToken);
  return data.body;
};

export const deleteOrder = async (id, authToken) => {
  const data = await post(`/delete`, { id }, authToken);
  return data.body;
};

export const finishedByOwner = async (token, questions, authToken) => {
  const data = await post(
    `/finished-by-owner`,
    { token, questions },
    authToken
  );
  return data.body;
};

export const createUnpaidTransactionByCreditCard = async (body, authToken) => {
  const data = await post(
    "/credit-card-unpaid-order-transaction-create",
    body,
    authToken
  );
  return data.body;
};
