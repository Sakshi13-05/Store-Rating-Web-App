import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Store as StoreIcon, Star, User, LogOut, Search,
    Check, AlertCircle, Eye, EyeOff, Mail, MapPin, Briefcase,
    Calendar, Award, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw,
    BarChart3, HelpCircle, UserCheck, ShieldAlert
} from 'lucide-react';
import './UserDashboard.css';

export default function UserDashboard({ currentUser, onLogout, onUpdateUser }) {
    // Navigation & UI Tab State
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Core Data
    const [stores, setStores] = useState([]);

    // Search & Filtering State (Browse Stores Tab)
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortField, setSortField] = useState('name'); // 'name' or 'overallRating'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    // Submit Rating Popup Modal State
    const [selectedStore, setSelectedStore] = useState(null);
    const [modalRatingValue, setModalRatingValue] = useState(0);
    const [hoverRatingValue, setHoverRatingValue] = useState(0);
    const [ratingError, setRatingError] = useState(null);
    const [ratingSuccess, setRatingSuccess] = useState(null);
    const [ratingSubmitting, setRatingSubmitting] = useState(false);

    // Profile Edit State
    const [profileName, setProfileName] = useState(currentUser?.name || '');
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

    // How it Works Modal State
    const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

    // Password Validations Checked in Realtime
    const isPassLength = newPassword.length >= 8 && newPassword.length <= 16;
    const isPassUpper = /[A-Z]/.test(newPassword);
    const isPassSpecial = /[^A-Za-z0-9]/.test(newPassword);

    // Profile Name/Address Validations Checked in Realtime
    const isNameValid = profileName.length >= 20 && profileName.length <= 60;
    const isAddressValid = profileAddress.length > 0 && profileAddress.length <= 400;

    // Load stores from API
    const fetchStoresData = async () => {
        if (!currentUser?.id) return;
        try {
            setLoading(true);
            setError(null);
            // We load stores with currentUserId so it populates "userRating" for each store
            const res = await fetch(`/api/stores?currentUserId=${currentUser.id}`);
            const data = await res.json();
            if (res.ok) {
                setStores(data);
            } else {
                throw new Error(data.error || 'Failed to fetch stores');
            }
        } catch (err) {
            console.error('Error loading stores:', err);
            setError('Could not refresh store list. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStoresData();
    }, [currentUser?.id]);

    // Sync state if currentUser changes
    useEffect(() => {
        if (currentUser) {
            setProfileName(currentUser.name || '');
            setProfileAddress(currentUser.address || '');
        }
    }, [currentUser]);

    // Handle Edit Profile Submission
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileError(null);
        setProfileSuccess(null);
        setProfileLoading(true);

        try {
            if (!isNameValid) {
                throw new Error('Name must be between 20 and 60 characters long.');
            }
            if (!isAddressValid) {
                throw new Error('Address must be at most 400 characters long.');
            }

            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    name: profileName,
                    address: profileAddress
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update profile');

            setProfileSuccess('Your profile has been updated successfully!');
            if (onUpdateUser) {
                onUpdateUser(data.user);
            }
        } catch (err) {
            setProfileError(err.message);
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
                throw new Error('Password does not satisfy all validation rules.');
            }

            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    password: newPassword,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to change password');

            setPwSuccess('Password updated successfully!');
            setNewPassword('');
        } catch (err) {
            setPwError(err.message);
        } finally {
            setPwLoading(false);
        }
    };

    // Submit Rating Submission
    const handleSubmitRating = async (e) => {
        e.preventDefault();
        if (!selectedStore) return;
        if (modalRatingValue < 1 || modalRatingValue > 5) {
            setRatingError('Please select a rating between 1 and 5 stars.');
            return;
        }

        setRatingError(null);
        setRatingSuccess(null);
        setRatingSubmitting(true);

        try {
            const res = await fetch('/api/user/rating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    storeId: selectedStore.id,
                    rating: modalRatingValue,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit rating');

            setRatingSuccess('Thank you! Your feedback has been saved.');
            // Refresh local stores list to show updated ratings
            await fetchStoresData();

            // Close modal after a short delay
            setTimeout(() => {
                setSelectedStore(null);
                setRatingSuccess(null);
            }, 1200);
        } catch (err) {
            setRatingError(err.message);
        } finally {
            setRatingSubmitting(false);
        }
    };

    // Open Rating modal
    const openRatingModal = (store) => {
        setSelectedStore(store);
        setModalRatingValue(store.userRating || 0);
        setHoverRatingValue(0);
        setRatingError(null);
        setRatingSuccess(null);
    };

    // Navigation callbacks from Navbar items
    const handleDiscover = () => {
        setActiveTab('browse');
        setSortField('name');
        setSortOrder('asc');
    };

    const handleTopRated = () => {
        setActiveTab('browse');
        setSortField('overallRating');
        setSortOrder('desc');
    };

    // Stats Calculations for Dashboard Home
    const totalStoresCount = stores.length;
    const ratedStores = stores.filter((s) => s.userRating !== undefined && s.userRating !== null);
    const myRatingsCount = ratedStores.length;

    const averageRatingGiven = myRatingsCount > 0
        ? (ratedStores.reduce((acc, s) => acc + s.userRating, 0) / myRatingsCount).toFixed(1)
        : 'N/A';

    // Categories list extracted from registered stores
    const categoriesList = ['all', ...new Set(stores.map((s) => s.category?.toLowerCase()).filter(Boolean))];

    // Sorting Helper
    const handleToggleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder(field === 'overallRating' ? 'desc' : 'asc'); // default descending for ratings
        }
    };

    const renderSortIcon = (field) => {
        if (sortField !== field) return <ArrowUpDown className="sort-icon-neutral" />;
        return sortOrder === 'asc'
            ? <ArrowUp className="sort-icon-active" />
            : <ArrowDown className="sort-icon-active" />;
    };

    // Filter & Sort Stores List for "Browse Stores" Tab
    const getFilteredStoresList = () => {
        let list = [...stores];

        // Search by Name or Address
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (s) =>
                    (s.name || '').toLowerCase().includes(q) ||
                    (s.address || '').toLowerCase().includes(q)
            );
        }

        // Filter by Category
        if (categoryFilter !== 'all') {
            list = list.filter((s) => (s.category || '').toLowerCase() === categoryFilter.toLowerCase());
        }

        // Sort
        list.sort((a, b) => {
            let valA, valB;

            if (sortField === 'overallRating') {
                valA = Number(a.overallRating) || 0;
                valB = Number(b.overallRating) || 0;
            } else {
                // Default by store name
                valA = (a.name || '').toLowerCase();
                valB = (b.name || '').toLowerCase();
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return list;
    };

    const processedBrowseStores = getFilteredStoresList();

    return (
        <div className="user-portal-root">

            {/* MAIN CONTAINER: SIDEBAR + CONTENT AREA */}
            <div className="user-portal-body">

                {/* 2. LEFT SIDEBAR */}
                <aside className="user-sidebar">

                    {/* User Session Info Card */}
                    <div className="sidebar-profile-card">
                        <div className="profile-avatar-circle">
                            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="profile-meta">
                            <h5 className="profile-name-truncated">{currentUser?.name}</h5>
                            <span className="profile-badge-user">Active Reviewer</span>
                        </div>
                    </div>

                    {/* Sidebar Nav links */}
                    <nav className="sidebar-nav">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                            id="user-nav-dashboard"
                        >
                            <LayoutDashboard className="sidebar-nav-icon" />
                            <span>Dashboard</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('browse')}
                            className={`sidebar-nav-item ${activeTab === 'browse' ? 'active' : ''}`}
                            id="user-nav-browse"
                        >
                            <StoreIcon className="sidebar-nav-icon" />
                            <span>Browse Stores</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('myratings')}
                            className={`sidebar-nav-item ${activeTab === 'myratings' ? 'active' : ''}`}
                            id="user-nav-myratings"
                        >
                            <Star className="sidebar-nav-icon" />
                            <span>My Ratings</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                            id="user-nav-profile"
                        >
                            <User className="sidebar-nav-icon" />
                            <span>Profile</span>
                        </button>
                    </nav>

                    <div className="sidebar-footer">
                        <button onClick={onLogout} className="sidebar-logout-btn" id="user-nav-logout">
                            <LogOut className="sidebar-logout-icon" />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* 3. RIGHT CONTENT AREA */}
                <main className="user-workspace-panel">

                    {/* Workspace Title bar */}
                    <header className="workspace-title-bar">
                        <div>
                            <span className="workspace-lead-pill">User Member Portal</span>
                            <h2 className="workspace-tab-title">
                                {activeTab === 'dashboard' && 'Welcome Back'}
                                {activeTab === 'browse' && 'Explore Local Businesses'}
                                {activeTab === 'myratings' && 'Your Rating History'}
                                {activeTab === 'profile' && 'Account Credentials'}
                            </h2>
                        </div>
                        <button onClick={fetchStoresData} className="workspace-refresh-btn" title="Sync stores from server">
                            <RefreshCw className={`btn-icon ${loading ? 'spinning' : ''}`} />
                            <span>Refresh Data</span>
                        </button>
                    </header>

                    {/* Global Loading screen */}
                    {loading && stores.length === 0 ? (
                        <div className="workspace-loader-state">
                            <RefreshCw className="spinning-icon" />
                            <p>Fetching the latest store metrics...</p>
                        </div>
                    ) : (
                        <div className="workspace-content-pane">

                            {/* TAB 1: 🏠 DASHBOARD HOME */}
                            {activeTab === 'dashboard' && (
                                <div className="tab-pane-container fade-in">

                                    {/* Primary Welcome & Stats Card matching user requested wireframe */}
                                    <div className="welcome-stats-dashboard-card">
                                        <div className="card-top-decoration"></div>
                                        <div className="welcome-card-header">
                                            <div className="hand-icon-wrapper">👋</div>
                                            <div>
                                                <h3 className="welcome-greeting-text">Welcome, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Member'} 👋</h3>
                                                <p className="welcome-subtext">Discover outstanding local storefronts, leave detailed star reviews, and keep track of your personal ratings logs.</p>
                                            </div>
                                        </div>

                                        <div className="dashboard-metrics-grid">

                                            {/* Metric 1: Total Stores */}
                                            <div className="metric-box-card">
                                                <div className="metric-box-header">
                                                    <StoreIcon className="metric-icon color-orange" />
                                                    <span className="metric-title-label">Total Stores</span>
                                                </div>
                                                <h4 className="metric-value-num">{totalStoresCount}</h4>
                                                <span className="metric-box-sub">Registered on RateNest</span>
                                            </div>

                                            {/* Metric 2: Stores Rated by Me */}
                                            <div className="metric-box-card">
                                                <div className="metric-box-header">
                                                    <Star className="metric-icon color-yellow filled" />
                                                    <span className="metric-title-label">My Ratings</span>
                                                </div>
                                                <h4 className="metric-value-num">{myRatingsCount}</h4>
                                                <span className="metric-box-sub">Reviewed storefronts</span>
                                            </div>

                                            {/* Metric 3: Average Rating Given */}
                                            <div className="metric-box-card">
                                                <div className="metric-box-header">
                                                    <Award className="metric-icon color-green" />
                                                    <span className="metric-title-label">Average Given</span>
                                                </div>
                                                <h4 className="metric-value-num">
                                                    {averageRatingGiven} <span className="text-amber-400">★</span>
                                                </h4>
                                                <span className="metric-box-sub">Mean stars submitted</span>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Quick Actions Hub */}
                                    <div className="quick-actions-section">
                                        <h4 className="section-title">Quick Actions Shortcuts</h4>
                                        <div className="quick-actions-grid">

                                            <button onClick={() => setActiveTab('browse')} className="quick-action-card border-amber">
                                                <StoreIcon className="quick-action-icon text-amber" />
                                                <div className="quick-action-text-block">
                                                    <h5>Browse Registered Stores</h5>
                                                    <p>Explore electronics, groceries, lifestyle hubs, and submit star evaluations instantly.</p>
                                                </div>
                                            </button>

                                            <button onClick={() => setActiveTab('myratings')} className="quick-action-card border-green">
                                                <Star className="quick-action-icon text-green" />
                                                <div className="quick-action-text-block">
                                                    <h5>View My Ratings</h5>
                                                    <p>Manage, edit, or adjust feedback and scores for businesses you've previously evaluated.</p>
                                                </div>
                                            </button>

                                            <button onClick={() => setActiveTab('profile')} className="quick-action-card border-blue">
                                                <User className="quick-action-icon text-blue" />
                                                <div className="quick-action-text-block">
                                                    <h5>Configure Settings</h5>
                                                    <p>Update your display name, secure password, physical delivery details and role.</p>
                                                </div>
                                            </button>

                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* TAB 2: 🏪 BROWSE STORES */}
                            {activeTab === 'browse' && (
                                <div className="tab-pane-container fade-in">

                                    {/* Interactive Filtering panel */}
                                    <div className="browse-filter-bar">

                                        {/* Search Field */}
                                        <div className="search-box-field">
                                            <Search className="search-field-icon" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search stores by Name or Address..."
                                                className="search-input"
                                            />
                                        </div>

                                        {/* Category Selector */}
                                        <div className="category-select-box">
                                            <span className="filter-label">Category:</span>
                                            <select
                                                value={categoryFilter}
                                                onChange={(e) => setCategoryFilter(e.target.value)}
                                                className="filter-select-dropdown"
                                            >
                                                <option value="all">All Categories</option>
                                                {categoriesList.filter(c => c !== 'all').map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Sort Badges */}
                                        <div className="sort-buttons-row">
                                            <span className="filter-label">Sort:</span>
                                            <button
                                                onClick={() => handleToggleSort('name')}
                                                className={`sort-pill-btn ${sortField === 'name' ? 'active' : ''}`}
                                            >
                                                Name {renderSortIcon('name')}
                                            </button>
                                            <button
                                                onClick={() => handleToggleSort('overallRating')}
                                                className={`sort-pill-btn ${sortField === 'overallRating' ? 'active' : ''}`}
                                            >
                                                Rating {renderSortIcon('overallRating')}
                                            </button>
                                        </div>

                                    </div>

                                    {/* Registered Stores Interactive Table */}
                                    <div className="stores-table-cardboard shadow-sm">
                                        <div className="table-container-scroller">
                                            <table className="stores-table-layout">
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => handleToggleSort('name')} className="clickable-th">
                                                            Store {renderSortIcon('name')}
                                                        </th>
                                                        <th>Category</th>
                                                        <th>Address</th>
                                                        <th onClick={() => handleToggleSort('overallRating')} className="clickable-th">
                                                            Overall Rating {renderSortIcon('overallRating')}
                                                        </th>
                                                        <th>My Rating</th>
                                                        <th className="align-right-th">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {processedBrowseStores.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={6} className="empty-table-fallback-row">
                                                                <div className="table-empty-graphic">
                                                                    <StoreIcon className="empty-icon" />
                                                                    <h5>No Matching Storefronts Found</h5>
                                                                    <p>Try adjusting your search criteria or choosing a different category filter.</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        processedBrowseStores.map((store) => {
                                                            const hasRated = store.userRating !== undefined && store.userRating !== null;
                                                            return (
                                                                <tr key={store.id} className="store-row-tr">
                                                                    <td className="store-name-cell">
                                                                        <div className="store-cell-title-block">
                                                                            <span className="store-main-name">{store.name}</span>
                                                                            {store.badge && (
                                                                                <span className="store-badge-pill">{store.badge}</span>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <span className="category-pill-label">
                                                                            {store.category || 'Lifestyle'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="address-cell">
                                                                        <div className="address-flex-box">
                                                                            <MapPin className="address-pin-icon" />
                                                                            <span>{store.address || 'N/A'}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="rating-overall-cell">
                                                                        <div className="rating-inline-flex">
                                                                            <Star className="star-mini-yellow" />
                                                                            <span className="bold-rating-value">{store.overallRating}</span>
                                                                            <span className="rating-count-label">({store.ratingCount || 0})</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="my-rating-cell">
                                                                        {hasRated ? (
                                                                            <div className="rating-inline-stars">
                                                                                {Array.from({ length: 5 }).map((_, idx) => (
                                                                                    <Star
                                                                                        key={idx}
                                                                                        className={`star-micro ${idx < store.userRating ? 'filled' : 'empty'}`}
                                                                                    />
                                                                                ))}
                                                                                <span className="star-num-val">({store.userRating}★)</span>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="not-rated-placeholder">Not Rated</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="action-cell align-right">
                                                                        <button
                                                                            onClick={() => openRatingModal(store)}
                                                                            className={`table-action-btn ${hasRated ? 'btn-update' : 'btn-rate'}`}
                                                                        >
                                                                            {hasRated ? 'Update Rating' : 'Rate'}
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* TAB 3: ⭐ MY RATINGS */}
                            {activeTab === 'myratings' && (
                                <div className="tab-pane-container fade-in">

                                    {/* Feedback table card */}
                                    <div className="stores-table-cardboard shadow-sm">
                                        <div className="table-container-scroller">
                                            <table className="stores-table-layout">
                                                <thead>
                                                    <tr>
                                                        <th>Store</th>
                                                        <th>My Rating</th>
                                                        <th>Overall Rating</th>
                                                        <th className="align-right-th">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ratedStores.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={4} className="empty-table-fallback-row">
                                                                <div className="table-empty-graphic">
                                                                    <Star className="empty-icon" />
                                                                    <h5>No Rated Stores Yet</h5>
                                                                    <p>You haven't submitted any reviews. Head to the "Browse Stores" tab to leave your first evaluation!</p>
                                                                    <button onClick={() => setActiveTab('browse')} className="empty-state-cta-btn">
                                                                        Browse & Rate Stores
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        ratedStores.map((store) => (
                                                            <tr key={store.id} className="store-row-tr">
                                                                <td className="store-name-cell">
                                                                    <div className="store-cell-title-block">
                                                                        <span className="store-main-name">{store.name}</span>
                                                                        <span className="category-pill-label">{store.category}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="my-rating-cell">
                                                                    <div className="rating-inline-stars">
                                                                        {Array.from({ length: 5 }).map((_, idx) => (
                                                                            <Star
                                                                                key={idx}
                                                                                className={`star-micro ${idx < store.userRating ? 'filled' : 'empty'}`}
                                                                            />
                                                                        ))}
                                                                        <span className="star-num-val font-semibold">{store.userRating}★</span>
                                                                    </div>
                                                                </td>
                                                                <td className="rating-overall-cell">
                                                                    <div className="rating-inline-flex">
                                                                        <Star className="star-mini-yellow" />
                                                                        <span className="bold-rating-value">{store.overallRating}</span>
                                                                        <span className="rating-count-label">({store.ratingCount || 0})</span>
                                                                    </div>
                                                                </td>
                                                                <td className="action-cell align-right">
                                                                    <button
                                                                        onClick={() => openRatingModal(store)}
                                                                        className="table-action-btn btn-update"
                                                                    >
                                                                        Edit
                                                                    </button>
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

                            {/* TAB 4: 👤 PROFILE SETTINGS */}
                            {activeTab === 'profile' && (
                                <div className="tab-pane-container fade-in">

                                    <div className="profile-grid-panels">

                                        {/* Section 1: Update Profile details */}
                                        <div className="form-settings-card">
                                            <div className="form-settings-header">
                                                <User className="form-icon-lead color-orange" />
                                                <div>
                                                    <h4 className="form-card-title">Personal Credentials</h4>
                                                    <p className="form-card-subtitle">Manage your personal details displayed on reviews</p>
                                                </div>
                                            </div>

                                            {profileError && (
                                                <div className="form-feedback-banner error">
                                                    <AlertCircle className="feedback-banner-icon" />
                                                    <span>{profileError}</span>
                                                </div>
                                            )}

                                            {profileSuccess && (
                                                <div className="form-feedback-banner success">
                                                    <Check className="feedback-banner-icon" />
                                                    <span>{profileSuccess}</span>
                                                </div>
                                            )}

                                            <form onSubmit={handleUpdateProfile} className="settings-action-form">

                                                {/* Display Name */}
                                                <div className="form-group-field">
                                                    <label className="field-label-text">Full Name (20 to 60 characters)</label>
                                                    <input
                                                        type="text"
                                                        value={profileName}
                                                        onChange={(e) => setProfileName(e.target.value)}
                                                        placeholder="Enter your full name"
                                                        className="input-text-field"
                                                        required
                                                    />
                                                    <div className={`input-rule-indicator ${isNameValid ? 'pass' : 'fail'}`}>
                                                        {profileName.length}/60 characters (Min: 20)
                                                    </div>
                                                </div>

                                                {/* Email Address (Read Only) */}
                                                <div className="form-group-field">
                                                    <label className="field-label-text">Email Address (Read-only)</label>
                                                    <div className="readonly-input-box">
                                                        <Mail className="readonly-input-icon" />
                                                        <span>{currentUser?.email}</span>
                                                    </div>
                                                    <span className="readonly-helper-note">Email address cannot be changed to ensure unique identifier safety.</span>
                                                </div>

                                                {/* Role Badge (Read Only) */}
                                                <div className="form-group-field">
                                                    <label className="field-label-text">Account Portal Role</label>
                                                    <div className="readonly-input-box">
                                                        <UserCheck className="readonly-input-icon" />
                                                        <span className="uppercase font-mono text-amber-500 font-bold">{currentUser?.role}</span>
                                                    </div>
                                                </div>

                                                {/* Physical Address */}
                                                <div className="form-group-field">
                                                    <label className="field-label-text">Physical Address (Max 400 characters)</label>
                                                    <textarea
                                                        value={profileAddress}
                                                        onChange={(e) => setProfileAddress(e.target.value)}
                                                        placeholder="Enter your physical address"
                                                        className="textarea-text-field"
                                                        rows={3}
                                                        required
                                                    />
                                                    <div className={`input-rule-indicator ${isAddressValid ? 'pass' : 'fail'}`}>
                                                        {profileAddress.length}/400 characters
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={profileLoading || !isNameValid || !isAddressValid}
                                                    className="settings-submit-btn"
                                                >
                                                    {profileLoading ? 'Saving changes...' : 'Save Profile Changes'}
                                                </button>

                                            </form>
                                        </div>

                                        {/* Section 2: Change password details */}
                                        <div className="form-settings-card">
                                            <div className="form-settings-header">
                                                <Award className="form-icon-lead color-yellow" />
                                                <div>
                                                    <h4 className="form-card-title">Change Password</h4>
                                                    <p className="form-card-subtitle">Keep your RateNest credentials secure</p>
                                                </div>
                                            </div>

                                            {pwError && (
                                                <div className="form-feedback-banner error">
                                                    <AlertCircle className="feedback-banner-icon" />
                                                    <span>{pwError}</span>
                                                </div>
                                            )}

                                            {pwSuccess && (
                                                <div className="form-feedback-banner success">
                                                    <Check className="feedback-banner-icon" />
                                                    <span>{pwSuccess}</span>
                                                </div>
                                            )}

                                            <form onSubmit={handleUpdatePassword} className="settings-action-form">

                                                <div className="form-group-field">
                                                    <label className="field-label-text">New Secure Password</label>
                                                    <div className="password-input-relative">
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            placeholder="Enter secure password"
                                                            className="input-password-field"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="password-eye-toggle-btn"
                                                        >
                                                            {showPassword ? <EyeOff className="eye-toggle-icon" /> : <Eye className="eye-toggle-icon" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Real-time rules checklist */}
                                                <div className="realtime-rules-list-container">
                                                    <p className="rules-lead-text">Password Requirements:</p>
                                                    <ul className="rules-unordered-list">
                                                        <li className={`rule-check-item ${isPassLength ? 'pass' : 'fail'}`}>
                                                            <Check className="rule-badge-icon" />
                                                            <span>8 to 16 characters long ({newPassword.length}/16)</span>
                                                        </li>
                                                        <li className={`rule-check-item ${isPassUpper ? 'pass' : 'fail'}`}>
                                                            <Check className="rule-badge-icon" />
                                                            <span>At least one uppercase letter (A-Z)</span>
                                                        </li>
                                                        <li className={`rule-check-item ${isPassSpecial ? 'pass' : 'fail'}`}>
                                                            <Check className="rule-badge-icon" />
                                                            <span>At least one special symbol (!, @, #, etc.)</span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={pwLoading || !isPassLength || !isPassUpper || !isPassSpecial}
                                                    className="settings-submit-btn"
                                                >
                                                    {pwLoading ? 'Updating password...' : 'Update Password'}
                                                </button>

                                            </form>
                                        </div>

                                    </div>

                                </div>
                            )}

                        </div>
                    )}

                </main>
            </div>

            {/* 4. ⭐ SUBMIT RATING POPUP MODAL */}
            {selectedStore && (
                <div className="modal-backdrop fade-in" onClick={() => setSelectedStore(null)}>
                    <div className="modal-card-overlay" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-top-accent-line"></div>

                        <header className="modal-card-header">
                            <div>
                                <span className="modal-lead-tag">Submit Store Rating</span>
                                <h3 className="modal-title-text">{selectedStore.name}</h3>
                                <p className="modal-subtitle-text">{selectedStore.category} • {selectedStore.address}</p>
                            </div>
                            <button onClick={() => setSelectedStore(null)} className="modal-close-header-btn">
                                &times;
                            </button>
                        </header>

                        {ratingError && (
                            <div className="modal-feedback-banner error">
                                <AlertCircle className="modal-feedback-icon" />
                                <span>{ratingError}</span>
                            </div>
                        )}

                        {ratingSuccess && (
                            <div className="modal-feedback-banner success">
                                <Check className="modal-feedback-icon" />
                                <span>{ratingSuccess}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmitRating} className="modal-form-body">

                            <div className="interactive-stars-block">

                                {/* Visual Feedback text indicating what their selection is */}
                                <div className="stars-current-selection-badge">
                                    {modalRatingValue > 0 ? (
                                        <span>Your Rating Selection: <strong className="text-amber-500 font-mono text-sm">{modalRatingValue} / 5 Stars</strong></span>
                                    ) : (
                                        <span className="text-slate-400">Hover and click to select a rating score</span>
                                    )}
                                </div>

                                {/* Stars Row */}
                                <div className="interactive-stars-row">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isLit = hoverRatingValue >= star || (!hoverRatingValue && modalRatingValue >= star);
                                        return (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setModalRatingValue(star)}
                                                onMouseEnter={() => setHoverRatingValue(star)}
                                                onMouseLeave={() => setHoverRatingValue(0)}
                                                className="interactive-star-selector-btn"
                                            >
                                                <Star
                                                    className={`large-modal-star ${isLit ? 'lit-active' : 'dim-inactive'}`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Subtext info */}
                                {selectedStore.userRating !== undefined && selectedStore.userRating !== null ? (
                                    <div className="previous-evaluation-notice">
                                        <Check className="notice-icon" />
                                        <span>You previously rated this store <strong>{selectedStore.userRating}★</strong>. You are updating your rating.</span>
                                    </div>
                                ) : (
                                    <div className="previous-evaluation-notice neutral">
                                        <HelpCircle className="notice-icon" />
                                        <span>Ratings cannot be empty. Please submit a value between 1★ and 5★.</span>
                                    </div>
                                )}

                            </div>

                            <div className="modal-actions-footer">
                                <button
                                    type="button"
                                    onClick={() => setSelectedStore(null)}
                                    className="modal-footer-cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={ratingSubmitting || modalRatingValue < 1}
                                    className="modal-footer-submit-btn"
                                >
                                    {ratingSubmitting ? 'Saving...' : selectedStore.userRating ? 'Update Rating' : 'Submit Rating'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* 5. ℹ️ HOW IT WORKS MODAL */}
            {showHowItWorksModal && (
                <div className="modal-backdrop fade-in" onClick={() => setShowHowItWorksModal(false)}>
                    <div className="modal-card-overlay width-medium" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-top-accent-line yellow"></div>

                        <header className="modal-card-header">
                            <div>
                                <span className="modal-lead-tag">Platform Guide</span>
                                <h3 className="modal-title-text">How RateNest Works</h3>
                                <p className="modal-subtitle-text">Your transparent storefront reviews evaluation system</p>
                            </div>
                            <button onClick={() => setShowHowItWorksModal(false)} className="modal-close-header-btn">
                                &times;
                            </button>
                        </header>

                        <div className="modal-how-it-works-body">

                            <div className="guide-step-row">
                                <div className="step-number-badge">1</div>
                                <div className="step-desc-block">
                                    <h5>Explore Stores</h5>
                                    <p>Browse through diverse local storefronts categorized by specialty, arts, fitness, grocery and electronics. Use search or sorting to discover the top businesses.</p>
                                </div>
                            </div>

                            <div className="guide-step-row">
                                <div className="step-number-badge bg-yellow">2</div>
                                <div className="step-desc-block">
                                    <h5>Submit Rating Feedback</h5>
                                    <p>Submit 1 to 5 star feedback based on your actual shopping experiences. You can rate any store once. Submitting a new rating automatically updates your past record instantly.</p>
                                </div>
                            </div>

                            <div className="guide-step-row">
                                <div className="step-number-badge bg-green">3</div>
                                <div className="step-desc-block">
                                    <h5>Track History Logs</h5>
                                    <p>View, organize, and edit all your previous ratings easily from the "My Ratings" history page. Store owners see cumulative scores, helping them improve services dynamically!</p>
                                </div>
                            </div>

                            <div className="guide-info-banner">
                                <ShieldAlert className="banner-alert-icon" />
                                <p className="banner-alert-text">
                                    To prevent review manipulation and preserve trust, our system verifies customer user roles and enforces strict limit counts.
                                </p>
                            </div>

                        </div>

                        <div className="modal-actions-footer">
                            <button
                                onClick={() => setShowHowItWorksModal(false)}
                                className="modal-footer-submit-btn width-full bg-amber"
                            >
                                Got It, Thanks!
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}