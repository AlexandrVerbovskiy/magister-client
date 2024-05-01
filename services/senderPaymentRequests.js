import { initAxios } from "../utils";
const { get, post } = initAxios("/sender-payments");

export const paypalCreateOrder = async (amount, authToken) => {
  console.log(authToken);
  const data = await post(`/paypal-create-order`, { amount }, authToken);
  return data.body.id;
};

export const paypalOrderPayed = async (orderId, authToken) => {
  console.log(authToken);
  const data = await post(`/paypal-order-payed`, { orderId }, authToken);
  return data.body;
};
