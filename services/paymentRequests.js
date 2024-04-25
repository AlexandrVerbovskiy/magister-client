import { initAxios } from "../utils";
const { get, post } = initAxios("/payments");

export const createStripePaymentIntent = async ({ id, amount }, authToken) => {
  const data = await post(`/create-payment-intent`, { id, amount }, authToken);
  return data.body.id;
};
