const RAW_API = import.meta.env.VITE_API_URL || "";
const API_ROOT = RAW_API.replace(/\/$/, "");
// Ensure base URL includes `/api` exactly once
const API = API_ROOT.endsWith("/api") ? API_ROOT : `${API_ROOT}/api`;

// Register
export const registerUser = async (data) => {
    console.log("Registering user with data:", data);
    try {
        console.log("Register URL:", `${API}/auth/register`);
        const res = await fetch(`${API}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const payload = await res.json().catch(() => null);

        if (!res.ok) {
            const error = new Error(payload?.message || `Request failed with status ${res.status}`);
            error.response = { data: payload, status: res.status };
            throw error;
        }

        console.log("Registration response:", payload);
        return payload;
    } catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
        throw error;
    }
};

// Login
export const loginUser = async (data) => {
    console.log("Logging in user with data:", data);
    try {
        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const payload = await res.json().catch(() => null);

        if (!res.ok) {
            const error = new Error(payload?.message || `Request failed with status ${res.status}`);
            error.response = { data: payload, status: res.status };
            throw error;
        }

        console.log("Login response:", payload);
        return payload;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};