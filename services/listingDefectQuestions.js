import { initAxios } from "../utils";
const { get, post } = initAxios("/listing-defect-questions");

export const saveListingDefectQuestions = async (body, authToken) => {
  const data = await post(`/save`, body, authToken);
  return data.body;
};
