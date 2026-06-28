import api from "./api";

// Dashboard Summary
export const getOwnerDashboard = () => {
    return api.get("/owner/dashboard").then(res => res.data);
};

// Stubs for future backend endpoints
export const getStore = () => Promise.resolve(null);
export const getRatings = () => Promise.resolve([]);
export const getRatingSummary = () => Promise.resolve({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
export const updateProfile = () => Promise.resolve({ success: false });
export const changePassword = () => Promise.resolve({ success: false });