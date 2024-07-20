import { initAxios } from "../utils";
const { get, post } = initAxios("/listings");

export const createListing = async (body, authToken) => {
  const data = await post(`/create`, body, authToken);
  return data.body;
};

export const updateListing = async (body, authToken) => {
  const data = await post(`/update`, body, authToken);
  return data.body;
};

export const createListingByAdmin = async (body, authToken) => {
  const data = await post(`/create-by-admin`, body, authToken);
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

export const changeActiveListing = async (id, authToken) => {
  const data = await post(`/change-active`, { id }, authToken);
  return data.body;
};

export const changeActiveListingByAdmin = async (id, authToken) => {
  const data = await post(`/change-active-by-admin`, { id }, authToken);
  return data.body;
};

export const getListingList = async (params, authToken = null) => {
  const data = await post(`/list`, params, authToken);
  return data.body;
};

export const getOwnerListingList = async (params, authToken = null) => {
  const data = await post(`/owner-list`, params, authToken);
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

export const changeListingFavorite = async (listingId, authToken) => {
  const data = await post(`/change-favorite`, { listingId }, authToken);
  return data.body.isFavorite;
};
