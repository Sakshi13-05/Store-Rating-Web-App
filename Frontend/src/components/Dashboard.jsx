import AdminDashboard from "../../pages/Admin/AdminDashboard";
import UserDashboard from "../../pages/Users/UserDashboard";
import OwnerDashboard from "../../pages/Owner/OwnerDashboard";

function Dashboard({ currentUser }) {
    if (currentUser.role === "admin")
        return <AdminDashboard />
    if (currentUser.role === "user")
        return <UserDashboard />
    if (currentUser.role === "owner")
        return <OwnerDashboard />
} import React from 'react';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import UserDashboard from '../pages/Users/UserDashboard';
import OwnerDashboard from '../pages/Owner/OwnerDashboard';
import './Dashboard.css';

export default function Dashboard({ currentUser, onLogout }) {
    if (!currentUser) {
        return (
            <div className="dashboard-fallback">
                <p className="dashboard-fallback-msg">Please sign in to view your dashboard portal.</p>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            {currentUser.role === 'admin' && <AdminDashboard onLogout={onLogout} />}
            {currentUser.role === 'user' && <UserDashboard currentUser={currentUser} onLogout={onLogout} />}
            {currentUser.role === 'owner' && <OwnerDashboard currentUser={currentUser} onLogout={onLogout} />}
        </div>
    );
}
