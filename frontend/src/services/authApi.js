const API = import.meta.env.VITE_API_URL;

// Register
export const registerUser = async (data) => {
    try {
        console.log("Register URL:", `${API}/api/auth/register`);

        const res = await fetch(`${API}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const payload = await res.json().catch(() => null);

        if (!res.ok) {
            throw new Error(payload?.message || `Request failed with status ${res.status}`);
        }

        return payload;
    } catch (error) {
        console.error("Registration error:", error.message);
        throw error;
    }
};

// Login
export const loginUser = async (data) => {
    try {
        const res = await fetch(`${API}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const payload = await res.json().catch(() => null);

        if (!res.ok) {
            throw new Error(payload?.message || `Request failed with status ${res.status}`);
        }

        return payload;
    } catch (error) {
        console.error("Login error:", error.message);
        throw error;
    }
};