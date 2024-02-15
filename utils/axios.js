import axios from "axios";
import env from "../env";

const serviceWrapper = async (promise) => {
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

export const initAxios = (path = null) => {
  axios.defaults.withCredentials = true;

  const baseURL = path
    ? env.SERVER_URL + env.SERVER_API + path
    : env.SERVER_URL + env.SERVER_API;

  const axiosInstance = axios.create({
    baseURL,
  });

  const get = async (url, authToken = null) => {
    const options = { headers: {} };
    if (authToken) options["headers"]["Authorization"] = `Bearer ${authToken}`;
    return await serviceWrapper(axiosInstance.post(url, options));
  };

  const post = async (url, body = null, authToken = null) => {
    const options = { headers: {} };
    if (authToken) options["headers"]["Authorization"] = `Bearer ${authToken}`;
    return await serviceWrapper(axiosInstance.post(url, body, options));
  };

  return { get, post };
};

export const getFilePath = (part) =>
  env.SERVER_URL + env.SERVER_STORAGE + "/" + part;
