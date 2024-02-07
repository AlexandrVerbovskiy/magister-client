import ENV from "../env";
import { authAxios, serviceWrapper } from "../utils";
const serverApiUrl = ENV.SERVER_API_URL;

export const getUserById = async (id) => {
  const data = await serviceWrapper(
    authAxios.get(`${serverApiUrl}/users/get-by-id/${id}`)
  );
  return data.body;
};

//only admin methods

export const getFullUserById = async (id) => {
  const data = await serviceWrapper(
    authAxios.get(`${serverApiUrl}/users/get-full-by-id/${id}`)
  );
  return data.body;
};

export const getUserDocuments = async (userId) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/users/documents`, { userId })
  );
  return data.body.documents;
};

export const getUserList = async (body) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/users/list`, body)
  );
  return data.body;
};

export const setRole = async (id, role) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/users/set-role`, { id, role })
  );
  return data.body;
};

export const changeActive = async (id) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/users/change-active`, { id })
  );
  return data.body;
};

export const changeVerified = async (id) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/users/change-verified`, { id })
  );
  return data.body;
};

export const deleteUser = async (id) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/users/delete`, { id })
  );
  return data.body;
};

export const updateUser = async (userData) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/users/update`, userData)
  );
  return data.body;
};
