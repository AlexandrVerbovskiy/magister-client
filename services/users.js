import ENV from "../env";
import { authAxios, serviceWrapper } from "../utils";
const serverApiUrl = ENV.SERVER_API_URL;

export const getById = async (id) => {
  const data = await serviceWrapper(
    authAxios.get(`${serverApiUrl}/users/get-by-id/${id}`)
  );
  return data.body;
};

//only admin methods

export const getList = async (body) => {
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
