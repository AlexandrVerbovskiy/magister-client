import { initAxios } from "../utils";
const { get, post } = initAxios("/order-update-requests");

export const createOrderUpdateRequest = async (
  { orderId, newStartDate, newEndDate },
  authToken
) => {
  const data = await post(
    `/create`,
    { orderId, newStartDate, newEndDate },
    authToken
  );
  return data.body;
};
