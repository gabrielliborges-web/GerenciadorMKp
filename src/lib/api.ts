import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:4000",
  baseURL: "https://gerenciadormkp-api.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.error;
      if (errorMessage === "Token inválido.") {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);
