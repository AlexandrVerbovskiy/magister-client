import { initAxios } from "../utils";
const { get, post } = initAxios("/order-update-requests");

export const createOrderUpdateRequest = async (
  { orderId, newPrice, newStartDate, newFinishDate },
  authToken
) => {
  const data = await post(
    `/create`,
    { orderId, newPrice, newStartDate, newFinishDate },
    authToken
  );
  return data.body;
};
