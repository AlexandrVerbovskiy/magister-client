import { initAxios } from "../utils";
const { get, post } = initAxios("/listings");

export const getFullListingInfo = async (id) => {
  const data = await get(`/get-full-by-id/${id}`);
  return data.body;
};

export const getShortListingInfo = async (id) => {
  const data = await post(`/get-short-by-id/${id}`);
  return data.body;
};

export const createListing = async (body, authToken) => {
  const data = await post(`/create`, body, authToken);
  return data.body;
};

export const updateListing = async (body, authToken) => {
  const data = await post(`/update`, body, authToken);
  return data.body;
};

export const deleteListing = async (id, authToken) => {
  const data = await post(`/delete`, { id }, authToken);
  return data.body;
};

export const updateListingByAdmin = async (body, authToken) => {
  const data = await post(`/update-by-admin`, body, authToken);
  return data.body;
};

export const deleteListingByAdmin = async (id, authToken) => {
  const data = await post(`/delete-by-admin`, { id }, authToken);
  return data.body;
};

export const getListingList = async (params, authToken) => {
  const data = await post(`/list`, params, authToken);
  return data.body;
};

export const getAdminListingList = async (params, authToken) => {
  const data = await post(`/admin-list`, params, authToken);
  return data.body;
};

export const getUserListingList = async (params, authToken) => {
  const data = await post(`/user-list`, params, authToken);
  return data.body;
};