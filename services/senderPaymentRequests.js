import { initAxios } from "../utils";
const { get, post } = initAxios("/sender-payments");

export const paypalCreateOrder = async (amount, orderId, authToken) => {
  const data = await post(
    `/paypal-create-order`,
    { orderId, amount },
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
