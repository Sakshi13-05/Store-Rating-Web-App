import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Store as StoreIcon, Star, User, LogOut, Search,
    Check, AlertCircle, Eye, EyeOff, Mail, MapPin, Briefcase,
    Calendar, Award, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw, BarChart3
} from 'lucide-react';
import * as ownerService from '../../services/ownerService';
import './OwnerDashboard.css';

export default function OwnerDashboard({ currentUser, onLogout, onUpdateUser }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Core Data State
    const [store, setStore] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [summary, setSummary] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    // Ratings Table Interactive State (Search & Sorting)
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('date'); // 'rating' or 'date' or 'customerName'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

    // Edit Profile Form State
    const [profileName, setProfileName] = useState(currentUser?.name || '');
    const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
    const [profileAddress, setProfileAddress] = useState(currentUser?.address || '');
    const [profileError, setProfileError] = useState(null);
    const [profileSuccess, setProfileSuccess] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Change Password Form State
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [pwError, setPwError] = useState(null);
    const [pwSuccess, setPwSuccess] = useState(null);
    const [pwLoading, setPwLoading] = useState(false);

    // Password Validations Checked in Realtime
    const isPassLength = newPassword.length >= 8 && newPassword.length <= 16;
    const isPassUpper = /[A-Z]/.test(newPassword);
    const isPassSpecial = /[^A-Za-z0-9]/.test(newPassword);

    // Load All Data on Mount & Refresh
    const loadAllData = async () => {
        if (!currentUser?.id) return;
        try {
            setLoading(true);
            setError(null);

            // We load all endpoints concurrently
            const [dbData, storeData, ratingsData, summaryData] = await Promise.all([
                ownerService.getOwnerDashboard().catch(() => ({
                    storeName: 'Unassigned Store',
                    averageRating: 0,
                    totalRatings: 0,
                    createdAt: 'N/A',
                })),
                ownerService.getStore().catch(() => null),
                ownerService.getRatings().catch(() => []),
                ownerService.getRatingSummary().catch(() => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })),
            ]);

            setDashboard(dbData);
            setStore(storeData || { name: dbData?.storeName, category: dbData?.category, address: dbData?.address, ownerName: currentUser?.name });
            setRatings(ratingsData);
            setSummary(summaryData);

            // Prefill profile forms
            if (currentUser) {
                setProfileName(currentUser.name);
                setProfileEmail(currentUser.email);
                setProfileAddress(currentUser.address);
            }
        } catch (err) {
            console.error('Error fetching portal data:', err);
            setError('An unexpected error occurred while loading your store portal.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, [currentUser?.id]);

    // Handle Edit Profile Submission
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileError(null);
        setProfileSuccess(null);
        setProfileLoading(true);

        try {
            const res = await ownerService.updateProfile(currentUser.id, {
                name: profileName,
                email: profileEmail,
                address: profileAddress,
            });

            if (res.success && res.user) {
                setProfileSuccess('Profile updated successfully!');
                // Sync parent and localStorage session
                if (onUpdateUser) {
                    onUpdateUser(res.user);
                }
            }
        } catch (err) {
            setProfileError(err.response?.data?.error || err.message || 'Failed to update profile');
        } finally {
            setProfileLoading(false);
        }
    };

    // Handle Change Password Submission
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPwError(null);
        setPwSuccess(null);
        setPwLoading(true);

        try {
            if (!isPassLength || !isPassUpper || !isPassSpecial) {
                throw new Error('Password does not satisfy validation rules');
            }

            const res = await ownerService.changePassword(currentUser.id, {
                password: newPassword,
            });

            if (res.success) {
                setPwSuccess('Password changed successfully!');
                setNewPassword('');
            }
        } catch (err) {
            setPwError(err.response?.data?.error || err.message || 'Failed to change password');
        } finally {
            setPwLoading(false);
        }
    };

    // Sorting Handler
    const toggleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc'); // Default to descending for ratings & dates
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) {
            return <ArrowUpDown className="sort-icon-inactive" />;
        }
        return sortOrder === 'asc'
            ? <ArrowUp className="sort-icon-active" />
            : <ArrowDown className="sort-icon-active" />;
    };

    // Process & Filter Ratings for Table (Search & Sort)
    const getFilteredAndSortedRatings = () => {
        let list = [...ratings];

        // 1. Search filter by Customer Name
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            list = list.filter((r) =>
                (r.customerName || r.customer_name || '').toLowerCase().includes(query)
            );
        }

        // 2. Client-side Sort
        list.sort((a, b) => {
            let valA, valB;

            if (sortField === 'rating') {
                valA = a.rating || a.ratingValue || 0;
                valB = b.rating || b.ratingValue || 0;
            } else if (sortField === 'customerName') {
                valA = (a.customerName || a.customer_name || '').toLowerCase();
                valB = (b.customerName || b.customer_name || '').toLowerCase();
            } else {
                // Date
                valA = new Date(a.date || a.createdAt || 0).getTime();
                valB = new Date(b.date || b.createdAt || 0).getTime();
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return list;
    };

    // Format Dates Nicely
    const formatDate = (isoStr) => {
        if (!isoStr || isoStr === 'N/A') return 'N/A';
        try {
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return isoStr;
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return isoStr;
        }
    };

    const processedRatings = getFilteredAndSortedRatings();
    const recentRatings = [...ratings]
        .sort((a, b) => new Date(b.date || b.created_at || b.createdAt || 0).getTime() - new Date(a.date || a.created_at || a.createdAt || 0).getTime())
        .slice(0, 5);

    if (loading) {
        return (
            <div className="owner-portal-loading">
                <div className="loader-container">
                    <RefreshCw className="spinning-loader-icon" />
                    <p className="loader-message">Loading Store Owner Portal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="owner-portal-layout">

            {/* LEFT SIDEBAR NAVIGATION */}
            <aside className="owner-sidebar">
                <div className="sidebar-brand">
                    <Award className="sidebar-brand-icon" />
                    <span className="sidebar-brand-text">RateNest Portal</span>
                </div>

                {/* Current User Session Profile Banner */}
                <div className="sidebar-profile-card">
                    <div className="profile-avatar-circle">
                        {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'O'}
                    </div>
                    <div className="profile-meta">
                        <h5 className="profile-name-truncated">{currentUser?.name}</h5>
                        <span className="profile-badge-owner">Store Owner</span>
                    </div>
                </div>

                {/* Side Nav Menu */}
                <nav className="sidebar-nav">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`nav-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        id="owner-nav-dashboard"
                    >
                        <LayoutDashboard className="nav-menu-icon" />
                        <span>Dashboard</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('mystore')}
                        className={`nav-menu-item ${activeTab === 'mystore' ? 'active' : ''}`}
                        id="owner-nav-store"
                    >
                        <StoreIcon className="nav-menu-icon" />
                        <span>My Store</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('ratings')}
                        className={`nav-menu-item ${activeTab === 'ratings' ? 'active' : ''}`}
                        id="owner-nav-ratings"
                    >
                        <Star className="nav-menu-icon" />
                        <span>Ratings</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`nav-menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                        id="owner-nav-profile"
                    >
                        <User className="nav-menu-icon" />
                        <span>Profile</span>
                    </button>
                </nav>

                {/* Logout at bottom */}
                <div className="sidebar-footer">
                    <button onClick={onLogout} className="logout-btn" id="owner-nav-logout">
                        <LogOut className="logout-icon" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* RIGHT WORKSPACE CONTAINER */}
            <main className="owner-workspace">

                {/* Workspace Top Header Bar */}
                <header className="workspace-header">
                    <div className="header-breadcrumbs">
                        <span className="breadcrumb-pill">Store Owner Portal</span>
                        <h1 className="workspace-tab-title">
                            {activeTab === 'dashboard' && 'Dashboard Analytics'}
                            {activeTab === 'mystore' && 'My Store Details'}
                            {activeTab === 'ratings' && 'Customer Reviews'}
                            {activeTab === 'profile' && 'Account Settings'}
                        </h1>
                    </div>

                    <div className="header-actions">
                        <button onClick={loadAllData} className="workspace-refresh-btn" title="Refresh Portal Data">
                            <RefreshCw className="btn-icon" />
                            <span>Refresh Data</span>
                        </button>
                    </div>
                </header>

                {/* Global Error Alert Banner */}
                {error && (
                    <div className="global-error-alert">
                        <AlertCircle className="alert-icon" />
                        <span>{error}</span>
                    </div>
                )}

                {/* WORKSPACE CONTENT ROUTER */}
                <div className="workspace-content">

                    {/* TAB 1: DASHBOARD ANALYTICS */}
                    {activeTab === 'dashboard' && (
                        <div className="tab-pane-container fade-in">

                            {/* Dashboard metrics grid */}
                            <div className="dashboard-metrics-grid">

                                {/* Card 1: My Store Name */}
                                <div className="metric-card-box">
                                    <div className="metric-card-inner">
                                        <div className="metric-icon-box orange">
                                            <StoreIcon className="metric-icon" />
                                        </div>
                                        <div className="metric-data">
                                            <span className="metric-label">My Store Name</span>
                                            <h3 className="metric-value-text">{dashboard?.storeName || 'Unassigned Store'}</h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: Average Rating */}
                                <div className="metric-card-box">
                                    <div className="metric-card-inner">
                                        <div className="metric-icon-box yellow">
                                            <Star className="metric-icon filled" />
                                        </div>
                                        <div className="metric-data">
                                            <span className="metric-label">Average Rating</span>
                                            <h3 className="metric-value-text">
                                                {dashboard?.averageRating ? `${dashboard.averageRating}★` : 'N/A'}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3: Total Ratings */}
                                <div className="metric-card-box">
                                    <div className="metric-card-inner">
                                        <div className="metric-icon-box blue">
                                            <Award className="metric-icon" />
                                        </div>
                                        <div className="metric-data">
                                            <span className="metric-label">Total Ratings Received</span>
                                            <h3 className="metric-value-text">
                                                {dashboard?.totalRatings !== undefined ? dashboard.totalRatings.toLocaleString() : '0'}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 4: Joined Date */}
                                <div className="metric-card-box">
                                    <div className="metric-card-inner">
                                        <div className="metric-icon-box green">
                                            <Calendar className="metric-icon" />
                                        </div>
                                        <div className="metric-data">
                                            <span className="metric-label">Store Joined Date</span>
                                            <h3 className="metric-value-text">{formatDate(dashboard?.created_at || dashboard?.createdAt)}</h3>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Stats detail sections (Summary charts and recent logs) */}
                            <div className="dashboard-details-row">

                                {/* 4. Rating Summary Distribution progress */}
                                <div className="dashboard-summary-widget flex-1">
                                    <div className="widget-header">
                                        <BarChart3 className="widget-header-icon" />
                                        <h4 className="widget-title">Ratings Distribution</h4>
                                    </div>

                                    <div className="rating-summary-meter-box">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = summary[star] || 0;
                                            const total = dashboard?.totalRatings || 1;
                                            const percentage = Math.min(100, Math.round((count / total) * 100));

                                            return (
                                                <div key={star} className="meter-row">
                                                    <span className="star-label-text">{star}★</span>
                                                    <div className="progress-bar-track">
                                                        <div
                                                            className={`progress-bar-fill star-color-${star}`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="count-label-text">
                                                        {count.toLocaleString()} ({percentage}%)
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 5. Recent Ratings activity */}
                                <div className="dashboard-summary-widget flex-1">
                                    <div className="widget-header">
                                        <Calendar className="widget-header-icon" />
                                        <h4 className="widget-title">Recent Ratings Activity</h4>
                                    </div>

                                    <div className="recent-ratings-activity-list">
                                        {recentRatings.length === 0 ? (
                                            <div className="empty-activity-box">
                                                <Star className="empty-activity-icon" />
                                                <p>No customer reviews logged yet</p>
                                            </div>
                                        ) : (
                                            recentRatings.map((rating) => (
                                                <div key={rating.id} className="activity-item-card">
                                                    <div className="activity-meta">
                                                        <div className="activity-customer-initial">
                                                            {(rating.customerName || rating.customer_name || 'C').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="activity-text-info">
                                                            <h5 className="activity-customer-name">
                                                                {rating.customerName || rating.customer_name}
                                                            </h5>
                                                            <span className="activity-date">{formatDate(rating.date || rating.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="activity-stars-box">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`activity-star-icon ${i < (rating.rating || rating.ratingValue) ? 'filled' : 'empty'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* TAB 2: STORE INFO (VIEW ONLY) */}
                    {activeTab === 'mystore' && (
                        <div className="tab-pane-container fade-in">
                            <div className="store-view-card">

                                <div className="store-view-banner">
                                    <StoreIcon className="banner-icon-bg" />
                                    <div className="banner-content">
                                        <span className="verified-badge">
                                            <Check className="verified-badge-icon" /> Verified Profile
                                        </span>
                                        <h2 className="banner-store-title">{store?.name || 'Store Profile'}</h2>
                                        <p className="banner-store-subtitle">{store?.category || 'Lifestyle & Home'}</p>
                                    </div>
                                </div>

                                <div className="store-details-grid">

                                    {/* Store Name */}
                                    <div className="detail-entry">
                                        <div className="detail-entry-header">
                                            <Briefcase className="detail-entry-icon" />
                                            <span className="detail-entry-label">Store Name</span>
                                        </div>
                                        <div className="detail-entry-value">{store?.name || 'N/A'}</div>
                                    </div>

                                    {/* Business Email */}
                                    <div className="detail-entry">
                                        <div className="detail-entry-header">
                                            <Mail className="detail-entry-icon" />
                                            <span className="detail-entry-label">Business Email</span>
                                        </div>
                                        <div className="detail-entry-value">{store?.email || 'N/A'}</div>
                                    </div>

                                    {/* Category */}
                                    <div className="detail-entry">
                                        <div className="detail-entry-header">
                                            <Award className="detail-entry-icon" />
                                            <span className="detail-entry-label">Business Category</span>
                                        </div>
                                        <div className="detail-entry-value">{store?.category || 'N/A'}</div>
                                    </div>

                                    {/* Owner Name */}
                                    <div className="detail-entry">
                                        <div className="detail-entry-header">
                                            <User className="detail-entry-icon" />
                                            <span className="detail-entry-label">Store Owner</span>
                                        </div>
                                        <div className="detail-entry-value">{store?.ownerName || store?.owner_name || 'Unassigned'}</div>
                                    </div>

                                    {/* Full Address (Spans two columns) */}
                                    <div className="detail-entry full-width">
                                        <div className="detail-entry-header">
                                            <MapPin className="detail-entry-icon" />
                                            <span className="detail-entry-label">Physical Store Address</span>
                                        </div>
                                        <div className="detail-entry-value leading-relaxed">{store?.address || 'N/A'}</div>
                                    </div>

                                </div>

                                <div className="store-view-footer">
                                    <AlertCircle className="footer-info-icon" />
                                    <p className="footer-info-text">
                                        This information was verified by RateNest. To make changes to your business location, category, or registered details, please contact a Platform Administrator.
                                    </p>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* TAB 3: RATINGS TABLE */}
                    {activeTab === 'ratings' && (
                        <div className="tab-pane-container fade-in">

                            <div className="ratings-filter-panel">

                                {/* Search Bar */}
                                <div className="search-bar-wrapper">
                                    <Search className="search-bar-icon" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by customer name..."
                                        className="search-bar-input"
                                    />
                                </div>

                                {/* Filter and sorting badges */}
                                <div className="sort-badges-row">
                                    <span className="sort-label-lead">Sort Logs:</span>
                                    <button
                                        onClick={() => toggleSort('date')}
                                        className={`sort-pill-btn ${sortField === 'date' ? 'active' : ''}`}
                                    >
                                        Date {getSortIcon('date')}
                                    </button>
                                    <button
                                        onClick={() => toggleSort('rating')}
                                        className={`sort-pill-btn ${sortField === 'rating' ? 'active' : ''}`}
                                    >
                                        Rating {getSortIcon('rating')}
                                    </button>
                                    <button
                                        onClick={() => toggleSort('customerName')}
                                        className={`sort-pill-btn ${sortField === 'customerName' ? 'active' : ''}`}
                                    >
                                        Customer Name {getSortIcon('customerName')}
                                    </button>
                                </div>

                            </div>

                            {/* Ratings table cardboard container */}
                            <div className="table-panel-box">
                                <div className="table-overflow-wrapper">
                                    <table className="ratings-interactive-table">
                                        <thead>
                                            <tr>
                                                <th onClick={() => toggleSort('customerName')} className="interactive-th">
                                                    Customer Name {getSortIcon('customerName')}
                                                </th>
                                                <th onClick={() => toggleSort('rating')} className="interactive-th">
                                                    Rating (Stars) {getSortIcon('rating')}
                                                </th>
                                                <th onClick={() => toggleSort('date')} className="interactive-th">
                                                    Review Date {getSortIcon('date')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {processedRatings.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="empty-ratings-table-row">
                                                        <div className="table-empty-state">
                                                            <Star className="table-empty-icon" />
                                                            <h5>No matching customer reviews found</h5>
                                                            <p>Try adjusting your search criteria or clear the query</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                processedRatings.map((rating) => (
                                                    <tr key={rating.id} className="table-row-item">
                                                        <td className="customer-cell font-semibold">
                                                            {rating.customerName || rating.customer_name}
                                                        </td>
                                                        <td className="rating-cell">
                                                            <div className="stars-flex-row">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`table-star-icon ${i < (rating.rating || rating.ratingValue) ? 'filled' : 'empty'
                                                                            }`}
                                                                    />
                                                                ))}
                                                                <span className="text-rating-num font-mono">
                                                                    {rating.rating || rating.ratingValue}★
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="date-cell font-mono text-slate-500 text-xs">
                                                            {formatDate(rating.date || rating.createdAt)}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* TAB 4: PROFILE & SETTINGS */}
                    {activeTab === 'profile' && (
                        <div className="tab-pane-container fade-in">
                            <div className="profile-workspace-grid">

                                {/* Profile update form */}
                                <div className="form-card-box">
                                    <div className="form-card-header">
                                        <User className="form-header-icon" />
                                        <div>
                                            <h4 className="form-card-title">Update Owner Profile</h4>
                                            <p className="form-card-subtitle">Manage your personal and business credentials</p>
                                        </div>
                                    </div>

                                    {profileError && (
                                        <div className="form-alert-banner error">
                                            <AlertCircle className="form-alert-icon" />
                                            <span>{profileError}</span>
                                        </div>
                                    )}

                                    {profileSuccess && (
                                        <div className="form-alert-banner success">
                                            <Check className="form-alert-icon" />
                                            <span>{profileSuccess}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleUpdateProfile} className="portal-action-form">

                                        {/* Full Name */}
                                        <div className="form-field-group">
                                            <label className="form-field-label">Full Name (20-60 characters)</label>
                                            <input
                                                type="text"
                                                value={profileName}
                                                onChange={(e) => setProfileName(e.target.value)}
                                                placeholder="Enter full name"
                                                className="form-field-input"
                                                required
                                                minLength={20}
                                                maxLength={60}
                                            />
                                            <div className="input-length-counter">
                                                {profileName.length}/60 characters (Min: 20)
                                            </div>
                                        </div>

                                        {/* Email Address */}
                                        <div className="form-field-group">
                                            <label className="form-field-label">Personal Email Address</label>
                                            <input
                                                type="email"
                                                value={profileEmail}
                                                onChange={(e) => setProfileEmail(e.target.value)}
                                                placeholder="owner@business.com"
                                                className="form-field-input"
                                                required
                                            />
                                        </div>

                                        {/* Physical Address */}
                                        <div className="form-field-group">
                                            <label className="form-field-label">Physical Address (Max 400 characters)</label>
                                            <textarea
                                                value={profileAddress}
                                                onChange={(e) => setProfileAddress(e.target.value)}
                                                placeholder="Enter location address"
                                                rows={3}
                                                className="form-field-textarea"
                                                required
                                                maxLength={400}
                                            />
                                            <div className="input-length-counter">
                                                {profileAddress.length}/400 characters
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={profileLoading || profileName.length < 20 || profileName.length > 60 || profileAddress.length > 400}
                                            className="form-submit-btn"
                                        >
                                            {profileLoading ? 'Updating Profile...' : 'Save Profile Changes'}
                                        </button>

                                    </form>
                                </div>

                                {/* Change password card */}
                                <div className="form-card-box">
                                    <div className="form-card-header">
                                        <Award className="form-header-icon" />
                                        <div>
                                            <h4 className="form-card-title">Change Account Password</h4>
                                            <p className="form-card-subtitle">Ensure your business dashboard remains secure</p>
                                        </div>
                                    </div>

                                    {pwError && (
                                        <div className="form-alert-banner error">
                                            <AlertCircle className="form-alert-icon" />
                                            <span>{pwError}</span>
                                        </div>
                                    )}

                                    {pwSuccess && (
                                        <div className="form-alert-banner success">
                                            <Check className="form-alert-icon" />
                                            <span>{pwSuccess}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleUpdatePassword} className="portal-action-form">

                                        {/* New Password */}
                                        <div className="form-field-group">
                                            <label className="form-field-label">New Secure Password</label>
                                            <div className="password-input-relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Min 8 characters, uppercase & special"
                                                    className="form-field-input-password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="password-reveal-toggle"
                                                >
                                                    {showPassword ? <EyeOff className="toggle-eye" /> : <Eye className="toggle-eye" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Real-time Validation Rules indicator box */}
                                        <div className="password-rules-summary-box">
                                            <p className="rules-lead">Password Requirements Check:</p>
                                            <ul className="rules-check-list">
                                                <li className={`rule-check-item ${isPassLength ? 'pass' : 'fail'}`}>
                                                    <Check className="rule-check-icon" />
                                                    <span>8 to 16 characters long ({newPassword.length}/16)</span>
                                                </li>
                                                <li className={`rule-check-item ${isPassUpper ? 'pass' : 'fail'}`}>
                                                    <Check className="rule-check-icon" />
                                                    <span>Contains at least one uppercase letter (A-Z)</span>
                                                </li>
                                                <li className={`rule-check-item ${isPassSpecial ? 'pass' : 'fail'}`}>
                                                    <Check className="rule-check-icon" />
                                                    <span>Contains at least one special character (!, @, #, etc.)</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={pwLoading || !isPassLength || !isPassUpper || !isPassSpecial}
                                            className="form-submit-btn"
                                        >
                                            {pwLoading ? 'Changing Password...' : 'Update Password'}
                                        </button>

                                    </form>
                                </div>

                            </div>
                        </div>
                    )}

                </div>

            </main>
        </div>
    );
}
