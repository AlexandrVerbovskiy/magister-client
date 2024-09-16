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

export const createCategoryByOther = async (body, authToken) => {
  const data = await post(`/create-by-others`, body, authToken);
  return data.body;
};

export const getAdminOthersListingCategories = async (params, authToken) => {
  const data = await post(
    `/admin-searched-others-categories-list`,
    params,
    authToken
  );
  return data.body;
};
