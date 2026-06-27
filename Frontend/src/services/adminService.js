import api from "./api";

export const getDashboardStats = () => {
    return api.get("/admin/dashboard");
};

export const getAllUsers = () => {
    return api.get("/admin/users");
};