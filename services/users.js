import { getCookieString, initAxios, serviceWrapper } from "../utils";
const axios = initAxios("/users");

export const getUserById = async (id) => {
  const data = await serviceWrapper(axios.get(`/get-by-id/${id}`));
  return data.body;
};

export const getFullUserById = async (id, cookies) => {
  const options = {
    headers: {
      Cookie: getCookieString(cookies),
    },
  };

  const data = await serviceWrapper(
    axios.get(`/get-full-by-id/${id}`, options)
  );
  return data.body;
};

export const getUserDocuments = async (userId) => {
  const data = await serviceWrapper(axios.post("/documents", { userId }));
  return data.body.documents;
};

export const getUserList = async (body) => {
  const data = await serviceWrapper(axios.post("/list", body));
  return data.body;
};

export const setRole = async (id, role) => {
  const data = await serviceWrapper(axios.post("/set-role", { id, role }));
  return data.body;
};

export const changeActive = async (id) => {
  const data = await serviceWrapper(axios.post("/change-active", { id }));
  return data.body;
};

export const changeVerified = async (id) => {
  const data = await serviceWrapper(axios.post("/change-verified", { id }));
  return data.body;
};

export const deleteUser = async (id) => {
  const data = await serviceWrapper(axios.post("/delete", { id }));
  return data.body;
};

export const updateUser = async (userData) => {
  const data = await serviceWrapper(axios.post("/update", userData));
  return data.body;
};

export const createUser = async (userData) => {
  const data = await serviceWrapper(axios.post("/create", userData));
  return data.body;
};
