import axios from "axios";

// Prefer explicit env var, otherwise use local backend in dev.
const rawApiUrl = import.meta.env.VITE_API_URL || "";
const isDev = import.meta.env.DEV;
const isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

let baseURL = "";

if (rawApiUrl) {
  baseURL = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl.replace(/\/$/, "")}/api`;
} else if (isDev || isLocalHost) {
  // Use Vite proxy in dev to avoid CORS/network issues.
  baseURL = "/api";
} else {
  baseURL = "https://staylocal-backend.onrender.com/api";
}

console.log("Using API Base URL:", baseURL);

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;