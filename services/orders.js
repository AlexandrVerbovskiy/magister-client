import { initAxios } from "../utils";
const { get, post, getPdfByPath } = initAxios("/orders");

export const createOrder = async (
  { price, finishTime, listingId, message },
  authToken
) => {
  const data = await post(
    `/create`,
    { price, finishTime, listingId, message },
    authToken
  );
  return data.body.id;
};

export const extendOrder = async (
  { startDate, endDate, listingId, feeActive, message, parentOrderId },
  authToken
) => {
  if (startDate > endDate) {
    let temp = startDate;
    startDate = endDate;
    endDate = temp;
  }

  const data = await post(
    `/extend`,
    {
      startDate,
      endDate,
      listingId,
      feeActive,
      message,
      parentOrderId,
    },
    authToken
  );
  return data.body;
};

export const getOrderFullInfo = async (id, authToken) => {
  const data = await get(`/get-full-by-id/${id}`, authToken);
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

export const finishOrder = async (id, authToken) => {
  const data = await post(`/finish`, { id }, authToken);
  return data.body;
};

export const acceptFinishOrder = async (id, authToken) => {
  const data = await post(`/accept-finish`, { id }, authToken);
  return data.body;
};

export const paypalOrderPayed = async (orderId, authToken) => {
  const data = await post(`/paypal-order-payed`, { orderId }, authToken);
  return data.body;
};

export const approveClientGotListing = async (formData, authToken) => {
  const data = await post(`/approve-client-got-listing`, formData, authToken);
  return data.body;
};

export const orderFullCancelPayed = async (
  { id, receiptType, paypalId, cardNumber },
  authToken
) => {
  const data = await post(
    `/full-cancel-payed`,
    { id, receiptType, paypalId, cardNumber },
    authToken
  );
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

export const finishedByOwner = async (formData, authToken) => {
  const data = await post(`/finished-by-owner`, formData, authToken);
  return data.body;
};

export const unpaidOrderTransactionByCreditCard = async (body, authToken) => {
  const data = await post(
    "/unpaid-order-transaction-bank-transfer",
    body,
    authToken
  );
  return data.body;
};

export const generateOrderInvoicePdf = async (id, authToken) => {
  return getPdfByPath(`/invoice-pdf/${id}`, authToken);
};
