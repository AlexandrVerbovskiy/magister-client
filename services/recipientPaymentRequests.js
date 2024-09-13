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

export const waitingRefundMarkAsDone = async (
  { id, type, paypalId, cardNumber },
  authToken
) => {
  const data = await post(
    "/completed",
    { id, type, paypalId, cardNumber },
    authToken
  );
  return data.body;
};
