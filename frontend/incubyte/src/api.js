import axios from "axios";

// NOTE: VITE_API_URL should be set in a .env file in the frontend root, e.g., VITE_API_URL=http://localhost:5000/api
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" }
});

// Interceptor to attach the JWT token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem("ss_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default API;