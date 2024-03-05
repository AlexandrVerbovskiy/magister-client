import { initAxios } from "../utils";
const { get, post } = initAxios("/base");

export const getIndexOptions = async () => {
  const data = await get(`/index-options`);
  return data.body;
};

export const getListingListOptions = async () => {
  const data = await get(`/listing-list-options`);
  return data.body;
};

export const getCreateListingOptions = async (authToken) => {
  const data = await get(`/create-listing-options`, authToken);
  return data.body;
};

export const getUpdateListingOptions = async (id, authToken) => {
  const data = await get(`/update-listing-options/${id}`, authToken);
  return data.body;
};

export const getUserListingListOptions = async (
  { filter = "", page = 1 },
  authToken
) => {
  const data = await post(
    `/user-listing-list-options`,
    { filter, page },
    authToken
  );
  return data.body;
};
