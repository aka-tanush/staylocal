import axios from 'axios';

// ✅ Detect environment
const isLocal = window.location.hostname === "localhost";

// ✅ Use correct backend automatically
const baseURL = isLocal
  ? "http://localhost:5000/api" // LOCAL backend
  : import.meta.env.VITE_API_URL || "https://staylocal-backend.onrender.com/api"; // PRODUCTION

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