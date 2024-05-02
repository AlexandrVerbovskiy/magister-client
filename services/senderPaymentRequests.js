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

export const paypalOrderPayed = async (orderId, authToken) => {
  const data = await post(`/paypal-order-payed`, { orderId }, authToken);
  return data.body;
};

export const getSenderPaymentList = async (body, authToken) => {
  const data = await post("/list", body, authToken);
  return data.body;
};
