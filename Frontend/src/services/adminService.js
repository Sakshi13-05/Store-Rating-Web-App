import api from "./api";

export const getDashboardStats = () => {
    return api.get("/admin/dashboard");
};

export const getAllUsers = (search = "", category = "all") => {
    return api.get(`/stores?search=${search}&category=${category}`);
};
export const addUser = (userData) => {
    return api.post("/admin/users", userData);
};