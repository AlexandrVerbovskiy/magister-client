import { initAxios } from "../utils";
const { get, post } = initAxios("/listing-categories");

export const getListingCategoriesList = async () => {
  const data = await get(`/list`);
  return data.body;
};

export const saveListingCategories = async (body, authToken) => {
  const data = await post(`/save`, body, authToken);
  return data.body;
};
