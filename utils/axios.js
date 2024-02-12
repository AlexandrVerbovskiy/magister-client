import ENV from "../env";
import axios from "axios";

export const initAxios = (path = null) => {
  axios.defaults.withCredentials = true;
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
