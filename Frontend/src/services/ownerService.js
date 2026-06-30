import api from "./api";

// Dashboard Summary (also used by getStore below)
export const getOwnerDashboard = () => {
    return api.get("/owner/dashboard").then(res => res.data);
};

export const getOwnerRatings = (
    search = "",
    sort = "latest"
) => {
    return api.get(
        `/owner/ratings?search=${search}&sort=${sort}`
    ).then(res => res.data);
};

// My Store — reuses dashboard data (same endpoint, shaped as store object)
export const getStore = () => {
    return api.get("/owner/dashboard").then(res => ({
        name: res.data.storeName,
        email: res.data.email || '',
        category: res.data.category,
        address: res.data.address,
    }));
};

export const getRatings = (search, sort) => getOwnerRatings(search, sort);

// Rating summary is embedded in dashboard distribution field
export const getRatingSummary = () => {
    return api.get("/owner/dashboard").then(res => res.data.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
};

// Update owner profile (name + address)
export const updateProfile = (userId, data) => {
    return api.put("/user/profile", { userId, name: data.name, address: data.address })
        .then(res => res.data);
};

// Change password
export const changePassword = (userId, data) => {
    return api.post("/user/change-password", { userId, password: data.password })
        .then(res => res.data);
};
