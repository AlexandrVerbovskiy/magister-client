import { initAxios } from "../utils";
const { get, post } = initAxios("/payments");

export const createStripePaymentIntent = async ({ id, amount }, authToken) => {
  const data = await post(`/create-payment-intent`, { id, amount }, authToken);
  return data.body.id;
};

export const generateQrCode = async () => {
  const data = await post(`/generate-qrcode`);
  return data.body.qrcode;
};
