import Cookies from "js-cookie";
import axios from "axios";
import env from "../env";

export const initAxios = (path = null) => {
  axios.defaults.withCredentials = true;

  const baseURL = path
      ? env.SERVER_URL + env.SERVER_API + path
      : env.SERVER_URL + env.SERVER_API;
  
  const axiosInstance = axios.create({
    baseURL,
  });

  axiosInstance.interceptors.request.use((config) => {
    if(typeof window !== "undefined" && window.document) {
      const token = Cookies.get(env.AUTH_COOKIE_NAME);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  });

  return axiosInstance;
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