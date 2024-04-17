import { initAxios } from "../utils";
const { get, post } = initAxios("/order-update-requests");

export const createOrderUpdateRequest = async (
  { orderId, newStartDate, newEndDate, newPricePerDay },
  authToken
) => {
  const data = await post(
    `/create`,
    { orderId, newStartDate, newEndDate, newPricePerDay },
    authToken
  );
  return data.body.id;
};