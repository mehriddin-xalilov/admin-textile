import axios from "axios";
import config from "../../../config.ts";
import { useStore } from "../store";
import storage from "../storage/index.ts";

const api = axios.create({
  baseURL: config.API_ROOT,
  timeout: 60000
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.defaults.params = {};
api.defaults.headers.common["Accept"] = "application/json";
api.defaults.headers.common["Cache-Control"] = "no-cache";
api.defaults.headers.common["Content-Type"] = "application/json; charset=utf-8";

api.interceptors.request.use(
  configs => {
    const token = storage.get("token");
    if (token) {
      configs.headers.Authorization = `Bearer ${token}`;
    }
    return configs;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      window.location.pathname !== "/login"
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = storage.get("refreshToken");
      if (!refreshToken) {
        useStore.getState().setLogout();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      return new Promise(function (resolve, reject) {
        axios
          .post(`${config.API_ROOT}/auth/refresh`, { refresh_token: refreshToken })
          .then(({ data }) => {
            const newToken = data.data.token;
            storage.set("token", newToken);
            api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
            originalRequest.headers["Authorization"] = "Bearer " + newToken;
            processQueue(null, newToken);
            resolve(api(originalRequest));
          })
          .catch(err => {
            processQueue(err, null);
            useStore.getState().setLogout();
            window.location.href = "/login";
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(error);
  }
);

export default api;
