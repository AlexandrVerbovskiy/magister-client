import { initAxios } from "../utils";
const { get, post } = initAxios("/order-update-requests");

export const createOrderUpdateRequest = async (
  { orderId, newPrice, newFinishTime },
  authToken
) => {
  const data = await post(
    `/create`,
    { orderId, newPrice, newFinishTime },
    authToken
  );
  return data.body;
};
