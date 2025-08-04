import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Use your deployed URL in production
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default API;
