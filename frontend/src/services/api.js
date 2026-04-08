import axios from "axios";

// Prefer explicit env var; in dev fall back to Vite proxy.
const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const isDev = import.meta.env.DEV;
const isLocalHost =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Backend uses `/api/...` prefix (Spring controller maps `/api/auth`).
// Normalize baseURL to always end in `/api`, without duplicating it.
const baseURL =
  API
    ? (API.endsWith("/api") ? API : `${API}/api`)
    : (isDev || isLocalHost ? "/api" : "");

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