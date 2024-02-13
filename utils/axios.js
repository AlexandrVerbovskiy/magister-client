import Cookies from "js-cookie";
import axios from "axios";
import authHeaderProps from "./authHeaderProps";
import env from "../env";

export const initAxios = (path = null) => {
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use((config) => {
    const token = Cookies.get(env.AUTH_COOKIE_NAME);

    if (token) {
      const props = authHeaderProps(token);
      config.headers.Authorization = `Bearer ${props.Authorization}`;
    }

    return config;
  });

  const baseURL = path
    ? env.SERVER_URL + env.SERVER_API + path
    : env.SERVER_URL + env.SERVER_API;

  return axios.create({
    baseURL,
  });
};

export const serviceWrapper = async (promise) => {
  try {
    const res = await promise;

    if (res.error) {
      throw res.error;
    }
    
    if (res.data.isError) throw new Error(res.data);

    return res.data;
  } catch (e) {
    if (e.response?.data?.isError) {
      throw new Error(e.response?.data?.message);
    } else {
      throw new Error(e.message);
    }
  }
};

export const getFilePath = (part) =>
env.SERVER_URL + env.SERVER_STORAGE + "/" + part;