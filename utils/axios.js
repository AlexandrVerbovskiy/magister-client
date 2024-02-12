import Cookies from "js-cookie";
import ENV from "../env";
import axios from "axios";
import authHeaderProps from "./authHeaderProps";

export const initAxios = (path = null) => {
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use((config) => {
    const token = Cookies.get("auth-token");

    if (token) {
      const props = authHeaderProps(token);
      config.headers.Authorization = `Bearer ${props.Authorization}`;
    }

    return config;
  });

  const baseURL = path
    ? ENV.SERVER_URL + ENV.SERVER_API + path
    : ENV.SERVER_URL + ENV.SERVER_API;

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

    console.log(res.headers['set-cookie']);

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
  ENV.SERVER_URL + ENV.SERVER_STORAGE + "/" + part;
