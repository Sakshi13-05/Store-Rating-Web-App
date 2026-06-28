import api from "./api";

// Add Store
export const addStore = (storeData) => {
    return api.post("/stores", storeData);
};

// Get All Stores
export const getAllStores = (search = "", category = "all") => {
    return api.get(`/stores?search=${search}&category=${category}`);
};
