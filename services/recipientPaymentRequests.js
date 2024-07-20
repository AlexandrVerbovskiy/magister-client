import { initAxios } from "../utils";
const { get, post } = initAxios("/recipient-payments");

export const getRecipientPaymentList = async (body, authToken) => {
  const data = await post("/list", body, authToken);
  return data.body;
};

export const getAdminRecipientPaymentList = async (body, authToken) => {
  const data = await post("/admin-list", body, authToken);
  return data.body;
};

export const waitingRefundMarkAsDone = async ({ id }, authToken) => {
  const data = await post("/completed", { id }, authToken);
  return data.body;
};

export const waitingRefundMarkAsRejected = async (
  { id, description },
  authToken
) => {
  const data = await post("/rejected", { id, description }, authToken);
  return data.body;
};

export const failedRecipientMarkAsDone = async (
  { id, paymentNumber },
  authToken
) => {
  const data = await post(
    `/failed-recipient-mark-done`,
    { id, paymentNumber },
    authToken
  );
  return data.body;
};
