import api from "./api";

// Register
export const registerUser = async (data) => {
    console.log("Registering user with data:", data);
    try {
        const res = await api.post("/auth/register", data);
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
        const res = await api.post("/auth/login", data);
        console.log("Login response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};