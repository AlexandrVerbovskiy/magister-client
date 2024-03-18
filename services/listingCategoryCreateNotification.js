import { initAxios } from "../utils";
const { post } = initAxios("/listing-category-create-notification");

export const createListingCategoryCreateNotification = async (
  categoryName,
  authToken
) => {
  const data = await post("/create", { categoryName }, authToken);
  return data.body;
};
