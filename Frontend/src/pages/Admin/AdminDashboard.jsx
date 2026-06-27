import React, { useState, useEffect } from 'react';
import {
    Users, Store as StoreIcon, Star, Filter, Search, PlusCircle, ArrowUpDown,
    ArrowUp, ArrowDown, ChevronRight, X, Mail, MapPin, Briefcase, ShieldAlert
} from 'lucide-react';
import './AdminDashboard.css';
import { getDashboardStats } from '../../services/adminService';
import { getAllUsers } from '../../services/adminService';
export default function AdminDashboard({ onLogout }) {
    // Stats
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

    // Listings
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    // Active View Tab: 'users' or 'stores'
    const [activeTab, setActiveTab] = useState('users');

    // Search & Filters
    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('all');
    const [userSortField, setUserSortField] = useState('name');
    const [userSortOrder, setUserSortOrder] = useState('asc');

    const [storeSearch, setStoreSearch] = useState('');
    const [storeSortField, setStoreSortField] = useState('name');
    const [storeSortOrder, setStoreSortOrder] = useState('asc');

    // Form Modals
    const [showAddUser, setShowAddUser] = useState(false);
    const [showAddStore, setShowAddStore] = useState(false);
    const [selectedUserDetail, setSelectedUserDetail] = useState(null);

    // Form Fields: User
    const [uName, setUName] = useState('');
    const [uEmail, setUEmail] = useState('');
    const [uAddress, setUAddress] = useState('');
    const [uPassword, setUPassword] = useState('');
    const [uRole, setURole] = useState('user');

    // Form Fields: Store
    const [sName, setSName] = useState('');
    const [sEmail, setSEmail] = useState('');
    const [sAddress, setSAddress] = useState('');
    const [sCategory, setSCategory] = useState('Lifestyle & Home');
    const [sOwnerId, setSOwnerId] = useState('');

    // Form status / errors
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // fetchstats
    useEffect(() => {
        fetchStats();
        fetchUsers();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await getDashboardStats();

            setStats(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // Handle Create User
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);
        setLoading(true);

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: uName,
                    email: uEmail,
                    address: uAddress,
                    password: uPassword,
                    role: uRole,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create user');

            setFormSuccess('User created successfully!');
            setTimeout(() => {
                setShowAddUser(false);
                // Clear fields
                setUName('');
                setUEmail('');
                setUAddress('');
                setUPassword('');
                setURole('user');
                setFormSuccess(null);
                fetchData();
            }, 1000);
        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle Create Store
    const handleCreateStore = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);
        setLoading(true);

        try {
            const res = await fetch('/api/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: sName,
                    email: sEmail,
                    address: sAddress,
                    category: sCategory,
                    ownerId: sOwnerId || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create store');

            setFormSuccess('Store created successfully!');
            setTimeout(() => {
                setShowAddStore(false);
                setSName('');
                setSEmail('');
                setSAddress('');
                setSCategory('Lifestyle & Home');
                setSOwnerId('');
                setFormSuccess(null);
                fetchData();
            }, 1000);
        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserSort = (field) => {
        if (userSortField === field) {
            setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setUserSortField(field);
            setUserSortOrder('asc');
        }
    };

    const toggleStoreSort = (field) => {
        if (storeSortField === field) {
            setStoreSortOrder(storeSortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setStoreSortField(field);
            setStoreSortOrder('asc');
        }
    };

    const getSortIcon = (field, currentField, order) => {
        if (currentField !== field) return <ArrowUpDown style={{ marginLeft: '4px', height: '14px', width: '14px', color: 'var(--color-slate-400)' }} />;
        return order === 'asc'
            ? <ArrowUp style={{ marginLeft: '4px', height: '14px', width: '14px', color: 'var(--color-amber-500)' }} />
            : <ArrowDown style={{ marginLeft: '4px', height: '14px', width: '14px', color: 'var(--color-amber-500)' }} />;
    };

    // Find store linked to owner user
    const getLinkedStoreName = (user) => {
        if (user.role !== 'owner') return 'N/A';
        const store = stores.find((s) => s.ownerId === user.id || s.id === user.storeId);
        return store ? `${store.name} (${store.overallRating}★)` : 'No Store Assigned';
    };

    return (
        <div className="admin-container">
            <div className="max-container">

                {/* Top Header */}
                <div className="admin-header-row">
                    <div>
                        <span className="admin-console-badge">
                            System Admin Console
                        </span>
                        <h1 className="admin-title">
                            Platform Overview
                        </h1>
                    </div>
                    <div className="admin-actions">
                        <button
                            onClick={() => setShowAddUser(true)}
                            className="admin-btn-secondary"
                        >
                            <PlusCircle className="cta-btn-icon-brand" />
                            <span>Add User</span>
                        </button>
                        <button
                            onClick={() => setShowAddStore(true)}
                            className="admin-btn-primary"
                        >
                            <PlusCircle className="cta-btn-icon" />
                            <span>Add Store</span>
                        </button>
                    </div>
                </div>

                {/* Dynamic Count Widgets */}
                <div className="stats-row">
                    <div className="stat-widget">
                        <div className="stat-icon-wrapper users">
                            <Users className="cta-btn-icon" style={{ height: '24px', width: '24px' }} />
                        </div>
                        <div>
                            <p className="stat-label">Total Users</p>
                            <h4 className="stat-number">{stats.totalUsers}</h4>
                        </div>
                        <div className="stat-widget-decor users"></div>
                    </div>

                    <div className="stat-widget">
                        <div className="stat-icon-wrapper stores">
                            <StoreIcon className="cta-btn-icon" style={{ height: '24px', width: '24px' }} />
                        </div>
                        <div>
                            <p className="stat-label">Total Stores</p>
                            <h4 className="stat-number">{stats.totalStores}</h4>
                        </div>
                        <div className="stat-widget-decor stores"></div>
                    </div>

                    <div className="stat-widget">
                        <div className="stat-icon-wrapper ratings">
                            <Star className="cta-btn-icon" style={{ height: '24px', width: '24px' }} />
                        </div>
                        <div>
                            <p className="stat-label">Submitted Ratings</p>
                            <h4 className="stat-number">{stats.totalRatings}</h4>
                        </div>
                        <div className="stat-widget-decor ratings"></div>
                    </div>
                </div>

                {/* Tab Selection */}
                <div className="tabs-bar">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    >
                        Registered Users ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`tab-btn ${activeTab === 'stores' ? 'active' : ''}`}
                    >
                        Stores & Ratings ({stores.length})
                    </button>
                </div>

                {/* Active List Panel */}
                {activeTab === 'users' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Users Search, Filters */}
                        <div className="admin-filters-bar">
                            <div className="admin-search-wrapper">
                                <Search className="search-icon-small" />
                                <input
                                    type="text"
                                    placeholder="Filter users by Name, Email, Address..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="search-input-field"
                                />
                            </div>
                            <div className="admin-filter-selectors">
                                <Filter className="admin-filter-icon" />
                                <span className="admin-filter-label">Role:</span>
                                <select
                                    value={userRoleFilter}
                                    onChange={(e) => setUserRoleFilter(e.target.value)}
                                    className="admin-filter-dropdown"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="admin">System Admin</option>
                                    <option value="user">Normal User</option>
                                    <option value="owner">Store Owner</option>
                                </select>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="table-panel">
                            <div className="table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th onClick={() => toggleUserSort('name')} className="sortable">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>Name {getSortIcon('name', userSortField, userSortOrder)}</div>
                                            </th>
                                            <th onClick={() => toggleUserSort('email')} className="sortable">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>Email {getSortIcon('email', userSortField, userSortOrder)}</div>
                                            </th>
                                            <th>Address</th>
                                            <th onClick={() => toggleUserSort('role')} className="sortable">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>Role {getSortIcon('role', userSortField, userSortOrder)}</div>
                                            </th>
                                            <th style={{ textAlign: 'right' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-slate-400)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                                                    No registered users found matching the query.
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="name">{user.name}</td>
                                                    <td className="email">{user.email}</td>
                                                    <td className="address">{user.address}</td>
                                                    <td>
                                                        <span className={`role-badge ${user.role}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <button
                                                            onClick={() => setSelectedUserDetail(user)}
                                                            className="action-view-btn"
                                                        >
                                                            <span>View Details</span>
                                                            <ChevronRight style={{ height: '14px', width: '14px' }} />
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
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Stores Search & Filter */}
                        <div className="admin-filters-bar">
                            <div className="admin-search-wrapper">
                                <Search className="search-icon-small" />
                                <input
                                    type="text"
                                    placeholder="Search stores by Name or Address..."
                                    value={storeSearch}
                                    onChange={(e) => setStoreSearch(e.target.value)}
                                    className="search-input-field"
                                />
                            </div>
                        </div>

                        {/* Stores Table */}
                        <div className="table-panel">
                            <div className="table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th onClick={() => toggleStoreSort('name')} className="sortable">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>Store Name {getSortIcon('name', storeSortField, storeSortOrder)}</div>
                                            </th>
                                            <th onClick={() => toggleStoreSort('category')} className="sortable">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>Category {getSortIcon('category', storeSortField, storeSortOrder)}</div>
                                            </th>
                                            <th>Address</th>
                                            <th onClick={() => toggleStoreSort('email')} className="sortable">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>Contact Email {getSortIcon('email', storeSortField, storeSortOrder)}</div>
                                            </th>
                                            <th onClick={() => toggleStoreSort('overallRating')} className="sortable">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>Rating {getSortIcon('overallRating', storeSortField, storeSortOrder)}</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stores.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-slate-400)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                                                    No stores found matching the filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            stores.map((store) => (
                                                <tr key={store.id}>
                                                    <td className="name">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span>{store.name}</span>
                                                            {store.badge && (
                                                                <span className="store-badge-small" style={{ fontSize: '9px', padding: '0.125rem 0.375rem' }}>
                                                                    {store.badge}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td style={{ color: 'var(--color-slate-600)' }}>{store.category}</td>
                                                    <td className="address">{store.address}</td>
                                                    <td className="email">{store.email}</td>
                                                    <td>
                                                        <div className="admin-table-stars-row">
                                                            <Star className="star-filled" style={{ height: '16px', width: '16px' }} />
                                                            <span className="admin-table-rating-val">{store.overallRating}</span>
                                                            <span className="admin-table-rating-reviews">({store.ratingCount})</span>
                                                        </div>
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

                {/* MODAL: View User Details */}
                {selectedUserDetail && (
                    <div className="modal-overlay">
                        <div className="modal-container">
                            <button
                                onClick={() => setSelectedUserDetail(null)}
                                className="modal-close-btn"
                            >
                                <X style={{ height: '20px', width: '20px' }} />
                            </button>

                            <div className="user-detail-header">
                                <div className="user-detail-avatar-box">
                                    <Users className="user-detail-avatar-box-icon" />
                                </div>
                                <div>
                                    <h3 className="user-detail-title">{selectedUserDetail.name}</h3>
                                    <span className="user-detail-badge">
                                        {selectedUserDetail.role}
                                    </span>
                                </div>
                            </div>

                            <div className="user-detail-info-list">
                                <div className="user-detail-info-item">
                                    <Mail className="user-detail-icon" />
                                    <div>
                                        <span className="user-detail-label-mono">Email Address</span>
                                        <span className="user-detail-val-sans">{selectedUserDetail.email}</span>
                                    </div>
                                </div>

                                <div className="user-detail-info-item">
                                    <MapPin className="user-detail-icon" />
                                    <div>
                                        <span className="user-detail-label-mono">Physical Address</span>
                                        <span className="user-detail-val-sans block">{selectedUserDetail.address}</span>
                                    </div>
                                </div>

                                <div className="user-detail-info-item">
                                    <Briefcase className="user-detail-icon" />
                                    <div>
                                        <span className="user-detail-label-mono">Assigned Entity Details</span>
                                        <div className="user-detail-val-sans" style={{ marginTop: '4px' }}>
                                            {selectedUserDetail.role === 'owner' ? (
                                                <div className="user-detail-assigned-box">
                                                    <p className="assigned-box-label">Store Assigned:</p>
                                                    <p className="assigned-box-val">{getLinkedStoreName(selectedUserDetail)}</p>
                                                </div>
                                            ) : selectedUserDetail.role === 'user' ? (
                                                <p style={{ color: 'var(--color-slate-600)', fontSize: '0.75rem' }}>Has submitted <strong style={{ color: 'var(--color-slate-900)' }}>{selectedUserDetail.ratingCount || 0}</strong> ratings overall with average score of <strong style={{ color: 'var(--color-slate-900)' }}>{selectedUserDetail.averageRatingGiven || 0}★</strong></p>
                                            ) : (
                                                <p style={{ color: 'var(--color-slate-600)', fontSize: '0.75rem' }}>Platform Administrator User with Universal Write/Read Permissions.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedUserDetail(null)}
                                className="user-detail-close-btn"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                )}

                {/* MODAL: Add User Form */}
                {showAddUser && (
                    <div className="modal-overlay">
                        <div className="modal-container wide">
                            <button
                                onClick={() => { setShowAddUser(false); setFormError(null); }}
                                className="modal-close-btn"
                            >
                                <X style={{ height: '20px', width: '20px' }} />
                            </button>

                            <h3 className="user-detail-title" style={{ marginBottom: '6px' }}>Add New User</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', marginBottom: '16px' }}>Register a new system administrator, normal user, or store owner.</p>

                            {formError && (
                                <div className="signup-alert error" style={{ marginBottom: '16px' }}>
                                    <ShieldAlert className="signup-alert-icon" />
                                    <span>{formError}</span>
                                </div>
                            )}
                            {formSuccess && (
                                <div className="signup-alert success" style={{ marginBottom: '16px' }}>
                                    <span>{formSuccess}</span>
                                </div>
                            )}

                            <form onSubmit={handleCreateUser} className="signup-form">
                                <div className="form-group">
                                    <label className="form-label">
                                        Full Name (20 - 60 chars)
                                    </label>
                                    <input
                                        type="text"
                                        value={uName}
                                        onChange={(e) => setUName(e.target.value)}
                                        placeholder="e.g. Test System Admin Manager User"
                                        className="form-input"
                                        required
                                    />
                                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-slate-400)', marginTop: '4px', display: 'block' }}>
                                        Length: {uName.length} characters (Must be 20 to 60)
                                    </span>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={uEmail}
                                        onChange={(e) => setUEmail(e.target.value)}
                                        placeholder="e.g. newuser@ratenest.com"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Password (8-16 chars, 1 Upper, 1 Special)
                                    </label>
                                    <input
                                        type="text"
                                        value={uPassword}
                                        onChange={(e) => setUPassword(e.target.value)}
                                        placeholder="e.g. SecretPassword!1"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Physical Address (Max 400 chars)
                                    </label>
                                    <textarea
                                        value={uAddress}
                                        onChange={(e) => setUAddress(e.target.value)}
                                        placeholder="e.g. 123 Pinecrest Avenue, Portland, OR 97201"
                                        rows={2}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        System Role
                                    </label>
                                    <select
                                        value={uRole}
                                        onChange={(e) => setURole(e.target.value)}
                                        className="category-select-dropdown"
                                        style={{ height: '42px' }}
                                    >
                                        <option value="user">Normal User</option>
                                        <option value="owner">Store Owner</option>
                                        <option value="admin">System Administrator</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="signup-submit-btn"
                                >
                                    {loading ? 'Creating...' : 'Register User'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: Add Store Form */}
                {showAddStore && (
                    <div className="modal-overlay">
                        <div className="modal-container wide">
                            <button
                                onClick={() => { setShowAddStore(false); setFormError(null); }}
                                className="modal-close-btn"
                            >
                                <X style={{ height: '20px', width: '20px' }} />
                            </button>

                            <h3 className="user-detail-title" style={{ marginBottom: '6px' }}>Register New Store</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', marginBottom: '16px' }}>Add a new retail store or business and assign it an owner.</p>

                            {formError && (
                                <div className="signup-alert error" style={{ marginBottom: '16px' }}>
                                    <ShieldAlert className="signup-alert-icon" />
                                    <span>{formError}</span>
                                </div>
                            )}
                            {formSuccess && (
                                <div className="signup-alert success" style={{ marginBottom: '16px' }}>
                                    <span>{formSuccess}</span>
                                </div>
                            )}

                            <form onSubmit={handleCreateStore} className="signup-form">
                                <div className="form-group">
                                    <label className="form-label">
                                        Store Name
                                    </label>
                                    <input
                                        type="text"
                                        value={sName}
                                        onChange={(e) => setSName(e.target.value)}
                                        placeholder="e.g. The Craft Woodworks"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Business Email
                                    </label>
                                    <input
                                        type="email"
                                        value={sEmail}
                                        onChange={(e) => setSEmail(e.target.value)}
                                        placeholder="e.g. hello@woodworks.co"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Physical Address (Max 400 chars)
                                    </label>
                                    <textarea
                                        value={sAddress}
                                        onChange={(e) => setSAddress(e.target.value)}
                                        placeholder="e.g. 742 Pinecrest Lane, Portland, OR 97201"
                                        rows={2}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Business Category
                                    </label>
                                    <select
                                        value={sCategory}
                                        onChange={(e) => setSCategory(e.target.value)}
                                        className="category-select-dropdown"
                                        style={{ height: '42px' }}
                                    >
                                        <option value="Lifestyle & Home">Lifestyle & Home</option>
                                        <option value="Coffee & Specialty">Coffee & Specialty</option>
                                        <option value="Plants & Wellness">Plants & Wellness</option>
                                        <option value="Art & Design">Art & Design</option>
                                        <option value="Boutiques & Apparel">Boutiques & Apparel</option>
                                        <option value="Organic Grocers">Organic Grocers</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Link Store Owner User (Optional)
                                    </label>
                                    <select
                                        value={sOwnerId}
                                        onChange={(e) => setSOwnerId(e.target.value)}
                                        className="category-select-dropdown"
                                        style={{ height: '42px' }}
                                    >
                                        <option value="">No Owner assigned (Can set later)</option>
                                        {users
                                            .filter((u) => u.role === 'owner' && !u.storeId)
                                            .map((owner) => (
                                                <option key={owner.id} value={owner.id}>
                                                    {owner.name} ({owner.email})
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="signup-submit-btn"
                                >
                                    {loading ? 'Creating...' : 'Register Store'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
