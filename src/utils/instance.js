import axios from "axios";
import router from "@/router";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const uploadInstance = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      router.push("/capstone-directory");
    }
    return Promise.reject(error);
  }
);

uploadInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

uploadInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      router.push("/capstone-directory");
    }
    return Promise.reject(error);
  }
);
