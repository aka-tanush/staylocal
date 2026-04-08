import api from "./api";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_BASE = API ? (API.endsWith("/api") ? API : `${API}/api`) : "";

// Register
export const registerUser = async (data) => {
    console.log("Registering user with data:", data);
    try {
        if (API_BASE) console.log("Register API:", `${API_BASE}/auth/register`);
        const res = await api.post(
            "/auth/register",
            data,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
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
        const res = await api.post(
            "/auth/login",
            data,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("Login response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};