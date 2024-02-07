import axios from "axios";
import ENV from "../env";
import { authAxios, serviceWrapper } from "../utils";
const serverApiUrl = ENV.SERVER_API_URL;

const saveSessionInfo = (res) => {
  const { user, accessToken } = res;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("userInfo", JSON.stringify(user));
  return user;
};

export const login = async (userInfo) => {
  const data = await serviceWrapper(
    axios.post(`${serverApiUrl}/auth/login`, userInfo)
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
    axios.post(`${serverApiUrl}/auth/register`, userInfo)
  );
  return data.message;
};

export const updateSessionInfo = async () => {
  const data = await serviceWrapper(
    authAxios.get(`${serverApiUrl}/auth/update-session-info`)
  );
  saveSessionInfo(data.body);
  return data.body.user;
};

export const getMyInfo = async () => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/auth/my-info`)
  );
  return data.body.user;
};

export const setMyPassword = async (password) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/auth/set-my-password`, { password })
  );
  return data.body.user;
};

export const updateProfile = async (body) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/auth/save-profile`, body)
  );
  return data.body.user;
};

export const getMyDocuments = async () => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/auth/my-documents`)
  );
  return data.body.documents;
};

export const saveMyDocuments = async (body) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/auth/save-my-documents`, body)
  );
  return data.body.documents;
};

export const updateMyPassword = async (currentPassword, newPassword) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/auth/update-my-password`, {
      currentPassword,
      newPassword,
    })
  );
  return data.body.user;
};

export const verifyEmail = async (email, token) => {
  const data = await serviceWrapper(
    axios.post(`${serverApiUrl}/auth/verify-email`, { email, token })
  );
  return data.message;
};

export const resetPasswordSend = async (email) => {
  const data = await serviceWrapper(
    axios.post(`${serverApiUrl}/auth/reset-password-send`, { email })
  );
  return data.message;
};

export const resetPassword = async (password, token) => {
  const data = await serviceWrapper(
    axios.post(`${serverApiUrl}/auth/reset-password`, { password, token })
  );
  return data.message;
};
