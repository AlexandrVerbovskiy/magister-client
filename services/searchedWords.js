import { initAxios } from "../utils";
const { get, post } = initAxios("/searched-words");

export const getSearchedWordById = async (id, authToken) => {
  const data = await get(`/get-by-id/${id}`, authToken);
  return data.body;
};

export const getSearchedWordList = async (body, authToken) => {
  const data = await post("/list", body, authToken);
  return data.body;
};

export const createCategoryBySearchWord = async (body, authToken) => {
  const data = await post(`/create-category`, body, authToken);
  return data.body;
};

export const getSearchTips = async (searchValue) => {
  const data = await get(`/tips-list?search=${searchValue}`);
  return data.body.list;
};