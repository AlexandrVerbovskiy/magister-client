import { initAxios } from "../utils";
const { get, post } = initAxios("/listing-categories");

export const getListingCategoriesList = async () => {
  const data = await get(`/list`);
  return data.body;
};

export const getPopularListingCategories = async () => {
  const data = await get(`/popular`);
  return data.body.popularCategories;
};

export const saveListingCategories = async (body, authToken) => {
  const data = await post(`/save`, body, authToken);
  return data.body;
};
