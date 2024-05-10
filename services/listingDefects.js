import { initAxios } from "../utils";
const { get, post } = initAxios("/listing-defects");

export const saveListingDefects = async (body, authToken) => {
  const data = await post(`/save`, body, authToken);
  return data.body;
};
