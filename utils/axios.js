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
    let error = new Error(e.message);

    if (e.response?.data?.isError) {
      error = new Error(e.response?.data?.message);
      const status = e.response.status;

      if (status) {
        error.status = status;
      }
    }

    throw error;
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
    return await serviceWrapper(axiosInstance.get(url, options));
  };

  const post = async (url, body = null, authToken = null) => {
    const options = { headers: {} };
    if (authToken) options["headers"]["Authorization"] = `Bearer ${authToken}`;
    return await serviceWrapper(axiosInstance.post(url, body, options));
  };

  const generateFullUrl = (url) => baseURL + url;

  const getPdfByPath = async (url, authToken) => {
    const response = await axios.get(generateFullUrl(url), {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/pdf",
      },
      responseType: "arraybuffer",
    });

    const pdfBlob = new Blob([response.data], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    return pdfUrl;
  };

  return { get, post, generateFullUrl, getPdfByPath };
};

export const getFilePath = (part) =>
  env.SERVER_URL + env.SERVER_STORAGE + "/" + part;
