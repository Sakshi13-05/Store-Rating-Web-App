import api from "./api";

// Dashboard Summary
export const getOwnerDashboard = () => {
    return api.get("/owner/dashboard");
};