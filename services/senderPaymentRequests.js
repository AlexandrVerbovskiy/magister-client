import axios from "axios";
import { initAxios } from "../utils";
const { get, post, getPdfByPath } =
  initAxios("/sender-payments");

export const paypalCreateOrder = async ({orderId, type}, authToken) => {
  const data = await post(
    `/paypal-create-order`,
    { orderId, type },
    authToken
  );
  return data.body.id;
};

export const getSenderPaymentList = async (body, authToken) => {
  const data = await post("/list", body, authToken);
  return data.body;
};

export const getAdminSenderPaymentList = async (body, authToken) => {
  const data = await post("/admin-list", body, authToken);
  return data.body;
};

export const approveSenderPaymentTransaction = async (
  { orderId },
  authToken
) => {
  const data = await post(
    "/approve-bank-transfer-transaction",
    { orderId },
    authToken
  );
  return data.body;
};

export const rejectSenderPaymentTransaction = async (
  { orderId, description },
  authToken
) => {
  const data = await post(
    "/reject-bank-transfer-transaction",
    { orderId, description },
    authToken
  );
  return data.body;
};

export const generateSenderInvoicePdf = async (id, authToken) => {
  return getPdfByPath(`/invoice-pdf/${id}`, authToken);
};
