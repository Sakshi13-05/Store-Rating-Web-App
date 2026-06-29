import api from "./api";

// Dashboard Summary
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

// Stubs for future backend endpoints
export const getStore = () => Promise.resolve(null);
export const getRatings = (search, sort) => getOwnerRatings(search, sort);
export const getRatingSummary = () => Promise.resolve({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
export const updateProfile = () => Promise.resolve({ success: false });
export const changePassword = () => Promise.resolve({ success: false });