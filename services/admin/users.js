import STATIC from "../../static";
import { authAxios, serviceWrapper } from "../../utils";

export const getList = async (body) => {
  const data = await serviceWrapper(
    authAxios.post(`${STATIC.SERVER_URL}/users/list`, body)
  );
  return data.body;
};

export const setRole = async (id, role) => {
  const data = await serviceWrapper(
    authAxios.post(`${STATIC.SERVER_URL}/users/set-role`, { id, role })
  );
  return data.body;
};

export const changeActive = async (id) => {
  const data = await serviceWrapper(
    authAxios.post(`${STATIC.SERVER_URL}/users/change-active`, { id })
  );
  return data.body;
};

export const deleteUser = async (id) => {
  const data = await serviceWrapper(
    authAxios.post(`${STATIC.SERVER_URL}/users/delete`, { id })
  );
  return data.body;
};
