import { initAxios } from "../utils";
const { get, post } = initAxios("/orders");

export const createOrder = async (
  { pricePerDay, startDate, endDate, listingId },
  authToken
) => {
  const data = await post(
    `/create`,
    { pricePerDay, startDate, endDate, listingId },
    authToken
  );
  return data.body.id;
};

export const getOrderFullInfo = async (id, authToken) => {
  const data = await get(`/get-full-by-id/${id}`, authToken);
  return data.body;
};
