import axios from "axios";
import STATIC from "../static";

const authAxios = axios.create({
  baseURL: STATIC.BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default authAxios;
