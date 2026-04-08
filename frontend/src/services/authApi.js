import axios from "axios";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
// Backend auth routes are under `/api/auth/*`
const API_BASE = API.endsWith("/api") ? API : `${API}/api`;

// Register
export const registerUser = async (data) => {
    console.log("Registering user with data:", data);
    try {
        console.log("Register API:", `${API_BASE}/auth/register`);
        const res = await axios.post(`${API_BASE}/auth/register`, data, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Registration response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
        throw error;
    }
};

// Login
export const loginUser = async (data) => {
    console.log("Logging in user with data:", data);
    try {
        const res = await axios.post(`${API_BASE}/auth/login`, data, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Login response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};