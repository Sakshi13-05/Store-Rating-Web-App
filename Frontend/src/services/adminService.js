import api from "./api";

export const getDashboardStats = () => {
    return api.get("/admin/dashboard");
};

export const getAllUsers = (search = "", role = "") => {
    return api.get(`/admin/users?search=${search}&role=${role}`);
};

export const addUser = (userData) => {
    return api.post("/admin/users", userData);
};