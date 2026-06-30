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
export const updateUser = (id, userData) => {
    return api.put(`/admin/users/${id}`, userData);
};
export const deleteUser = (id) => {
    return api.delete(`/admin/users/${id}`);
};
export const getOwners = () => {
    return api.get("/admin/owners");
};
