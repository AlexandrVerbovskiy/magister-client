import axios from "axios";
import STATIC from "../static";
import { authAxios, serviceWrapper } from "../utils";

const saveSessionInfo = (res) => {
  const { user, accessToken } = res;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("userInfo", JSON.stringify(user));
  return user;
};

export const login = async (userInfo) => {
  const data = await serviceWrapper(
    axios.post(`${STATIC.SERVER_URL}/auth/login`, userInfo)
  );
  saveSessionInfo(data.body);
  return data.body.user;
};

export const logout = async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userInfo");
  return;
};

export const register = async (userInfo) => {
  const data = await serviceWrapper(
    axios.post(`${STATIC.SERVER_URL}/auth/register`, userInfo)
  );
  return data.message;
};

export const resetPassword = async (email) => {
  const data = await serviceWrapper(
    axios.post(`${STATIC.SERVER_URL}/auth/reset-password`, { email })
  );
  return data.message;
};

export const updateSessionInfo = async () => {
  const data = await serviceWrapper(
    authAxios.get(`${STATIC.SERVER_URL}/auth/update-session-info`)
  );
  saveSessionInfo(data.body);
  return data.body.user;
};
