import { initAxios } from "../utils";
const { get, post } = initAxios("/users");

export const getUserById = async (id) => {
  const data = await get(`/get-by-id/${id}`);
  return data.body;
};

export const getFullUserById = async (id, authToken) => {
  const data = await get(`/get-full-by-id/${id}`, authToken);
  return data.body;
};

export const getUserDocuments = async (userId, authToken) => {
  const data = await post("/documents", { userId }, authToken);
  return data.body.documents;
};

export const getUserList = async (body, authToken) => {
  const data = await post("/list", body, authToken);
  return data.body;
};

export const setRole = async (id, role, authToken) => {
  const data = await post("/set-role", { id, role }, authToken);
  return data.body;
};

export const changeActive = async (id, authToken) => {
  const data = await post("/change-active", { id }, authToken);
  return data.body;
};

export const changeVerified = async (id, authToken) => {
  const data = await post("/change-verified", { id }, authToken);
  return data.body;
};

export const deleteUser = async (id, authToken) => {
  const data = await post("/delete", { id }, authToken);
  return data.body;
};

export const updateUser = async (userData, authToken) => {
  const data = await post("/update", userData, authToken);
  return data.body;
};

export const createUser = async (userData, authToken) => {
  const data = await post("/create", userData, authToken);
  return data.body;
};
