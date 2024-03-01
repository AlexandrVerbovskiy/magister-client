import { initAxios } from "../utils";
const { get, post } = initAxios("/base");

export const getIndexOptions = async () => {
  const data = await get(`/index-options`);
  return data.body;
};

export const getCreateListingOptions = async (authToken) => {
    const data = await get(`/create-listing-options`, authToken);
    return data.body;
  };

