import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
    const user = JSON.parse(localStorage.getItem("user"));

    // ❌ Not logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // ❌ Role not allowed
    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
        return <Navigate to="/" />;
    }

    // ✅ Allowed
    return children;
}