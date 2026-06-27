import React, { useState, useEffect } from 'react';
import {
    Users, Store as StoreIcon, Star, Filter, Search, PlusCircle, ArrowUpDown,
    ArrowUp, ArrowDown, ChevronRight, X, Mail, MapPin, Briefcase, ShieldAlert
} from 'lucide-react';

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

    // Fetch all listings and stats
    const fetchData = async () => {
        try {
            const statsRes = await fetch('/api/stats');
            const statsData = await statsRes.json();
            setStats(statsData);

            // Build query string for users
            const userQuery = new URLSearchParams({
                search: userSearch,
                role: userRoleFilter,
                sortBy: userSortField,
                sortOrder: userSortOrder,
            }).toString();
            const usersRes = await fetch(`/api/users?${userQuery}`);
            const usersData = await usersRes.json();
            setUsers(usersData);

            // Build query string for stores
            const storeQuery = new URLSearchParams({
                search: storeSearch,
                sortBy: storeSortField,
                sortOrder: storeSortOrder,
            }).toString();
            const storesRes = await fetch(`/api/stores?${storeQuery}`);
            const storesData = await storesRes.json();
            setStores(storesData);
        } catch (err) {
            console.error('Error fetching admin data:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [
        userSearch, userRoleFilter, userSortField, userSortOrder,
        storeSearch, storeSortField, storeSortOrder, activeTab
    ]);

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
        if (currentField !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-slate-500" />;
        return order === 'asc'
            ? <ArrowUp className="ml-1 h-3.5 w-3.5 text-amber-400" />
            : <ArrowDown className="ml-1 h-3.5 w-3.5 text-amber-400" />;
    };

    // Find store linked to owner user
    const getLinkedStoreName = (user) => {
        if (user.role !== 'owner') return 'N/A';
        const store = stores.find((s) => s.ownerId === user.id || s.id === user.storeId);
        return store ? `${store.name} (${store.overallRating}★)` : 'No Store Assigned';
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                            System Admin Console
                        </span>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
                            Platform Overview
                        </h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowAddUser(true)}
                            className="flex items-center space-x-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer transition shadow-xs"
                        >
                            <PlusCircle className="h-4 w-4 text-amber-600" />
                            <span>Add User</span>
                        </button>
                        <button
                            onClick={() => setShowAddStore(true)}
                            className="flex items-center space-x-2 rounded-xl bg-amber-400 hover:bg-amber-300 px-4 py-2.5 text-sm font-bold text-slate-950 cursor-pointer transition shadow-md"
                        >
                            <PlusCircle className="h-4 w-4" />
                            <span>Add Store</span>
                        </button>
                    </div>
                </div>

                {/* Dynamic Count Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 flex items-center space-x-4 shadow-xs">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
                            <h4 className="text-2xl font-bold mt-1 text-slate-900">{stats.totalUsers}</h4>
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/2 rounded-full blur-xl"></div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 flex items-center space-x-4 shadow-xs">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <StoreIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Stores</p>
                            <h4 className="text-2xl font-bold mt-1 text-slate-900">{stats.totalStores}</h4>
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/2 rounded-full blur-xl"></div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 flex items-center space-x-4 shadow-xs">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                            <Star className="h-6 w-6 fill-amber-500/10" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted Ratings</p>
                            <h4 className="text-2xl font-bold mt-1 text-slate-900">{stats.totalRatings}</h4>
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/2 rounded-full blur-xl"></div>
                    </div>
                </div>

                {/* Tab Selection */}
                <div className="border-b border-slate-200 flex items-center space-x-4">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer ${activeTab === 'users' ? 'border-amber-555 text-amber-600 border-amber-500' : 'border-transparent text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        Registered Users ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer ${activeTab === 'stores' ? 'border-amber-555 text-amber-600 border-amber-500' : 'border-transparent text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        Stores & Ratings ({stores.length})
                    </button>
                </div>

                {/* Active List Panel */}
                {activeTab === 'users' ? (
                    <div className="space-y-6">
                        {/* Users Search, Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-455 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Filter users by Name, Email, Address..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-xs rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-amber-500 transition"
                                />
                            </div>
                            <div className="flex items-center space-x-3 w-full sm:w-auto">
                                <Filter className="h-4 w-4 text-amber-600 shrink-0" />
                                <span className="text-xs text-slate-600">Role:</span>
                                <select
                                    value={userRoleFilter}
                                    onChange={(e) => setUserRoleFilter(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-xl text-slate-755 text-slate-700 outline-none cursor-pointer focus:bg-white"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="admin">System Admin</option>
                                    <option value="user">Normal User</option>
                                    <option value="owner">Store Owner</option>
                                </select>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 font-mono">
                                            <th onClick={() => toggleUserSort('name')} className="py-4 px-6 cursor-pointer hover:bg-slate-100 transition">
                                                <div className="flex items-center">Name {getSortIcon('name', userSortField, userSortOrder)}</div>
                                            </th>
                                            <th onClick={() => toggleUserSort('email')} className="py-4 px-6 cursor-pointer hover:bg-slate-100 transition">
                                                <div className="flex items-center">Email {getSortIcon('email', userSortField, userSortOrder)}</div>
                                            </th>
                                            <th className="py-4 px-6">Address</th>
                                            <th onClick={() => toggleUserSort('role')} className="py-4 px-6 cursor-pointer hover:bg-slate-100 transition">
                                                <div className="flex items-center">Role {getSortIcon('role', userSortField, userSortOrder)}</div>
                                            </th>
                                            <th className="py-4 px-6 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-10 text-center text-slate-400 font-mono text-xs">
                                                    No registered users found matching the query.
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.id} className="hover:bg-slate-50/50 transition group">
                                                    <td className="py-4 px-6 font-semibold text-slate-900 group-hover:text-amber-600 transition">{user.name}</td>
                                                    <td className="py-4 px-6 text-slate-600 font-mono text-xs">{user.email}</td>
                                                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{user.address}</td>
                                                    <td className="py-4 px-6">
                                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold font-mono border ${user.role === 'admin'
                                                            ? 'bg-red-50 text-red-700 border-red-100'
                                                            : user.role === 'owner'
                                                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                                : 'bg-slate-50 text-slate-600 border-slate-100'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <button
                                                            onClick={() => setSelectedUserDetail(user)}
                                                            className="inline-flex items-center space-x-1 text-xs text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
                                                        >
                                                            <span>View Details</span>
                                                            <ChevronRight className="h-3.5 w-3.5" />
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
                    <div className="space-y-6">
                        {/* Stores Search & Filter */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search stores by Name or Address..."
                                    value={storeSearch}
                                    onChange={(e) => setStoreSearch(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-xs rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-amber-500 transition"
                                />
                            </div>
                        </div>

                        {/* Stores Table */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 font-mono">
                                            <th onClick={() => toggleStoreSort('name')} className="py-4 px-6 cursor-pointer hover:bg-slate-100 transition">
                                                <div className="flex items-center">Store Name {getSortIcon('name', storeSortField, storeSortOrder)}</div>
                                            </th>
                                            <th onClick={() => toggleStoreSort('category')} className="py-4 px-6 cursor-pointer hover:bg-slate-100 transition">
                                                <div className="flex items-center">Category {getSortIcon('category', storeSortField, storeSortOrder)}</div>
                                            </th>
                                            <th className="py-4 px-6">Address</th>
                                            <th onClick={() => toggleStoreSort('email')} className="py-4 px-6 cursor-pointer hover:bg-slate-100 transition">
                                                <div className="flex items-center">Contact Email {getSortIcon('email', storeSortField, storeSortOrder)}</div>
                                            </th>
                                            <th onClick={() => toggleStoreSort('overallRating')} className="py-4 px-6 cursor-pointer hover:bg-slate-100 transition">
                                                <div className="flex items-center">Rating {getSortIcon('overallRating', storeSortField, storeSortOrder)}</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {stores.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-10 text-center text-slate-400 font-mono text-xs">
                                                    No stores found matching the filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            stores.map((store) => (
                                                <tr key={store.id} className="hover:bg-slate-50/50 transition group">
                                                    <td className="py-4 px-6 font-semibold text-slate-900 group-hover:text-amber-600 transition">
                                                        <div className="flex items-center space-x-2">
                                                            <span>{store.name}</span>
                                                            {store.badge && (
                                                                <span className="inline-flex rounded bg-amber-50 text-amber-700 border border-amber-100 text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-bold">
                                                                    {store.badge}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-slate-600">{store.category}</td>
                                                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{store.address}</td>
                                                    <td className="py-4 px-6 text-slate-600 font-mono text-xs">{store.email}</td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center space-x-1.5">
                                                            <Star className="h-4 w-4 fill-amber-500 text-amber-500 shrink-0" />
                                                            <span className="font-bold text-slate-900">{store.overallRating}</span>
                                                            <span className="text-xs text-slate-400">({store.ratingCount})</span>
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
                    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 p-6 shadow-2xl">
                            <button
                                onClick={() => setSelectedUserDetail(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="flex flex-col items-center text-center space-y-4 mb-6">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                                    <Users className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedUserDetail.name}</h3>
                                    <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-amber-50 border border-amber-100 text-amber-700 uppercase tracking-widest">
                                        {selectedUserDetail.role}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 text-xs font-mono border-t border-slate-100 pt-4 text-slate-600">
                                <div className="flex items-start space-x-2.5">
                                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                                    <div>
                                        <span className="text-slate-500 block text-[10px] uppercase">Email Address</span>
                                        <span className="text-sm font-sans text-slate-800">{selectedUserDetail.email}</span>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2.5">
                                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-slate-500 block text-[10px] uppercase">Physical Address</span>
                                        <span className="text-sm font-sans text-slate-800 block mt-0.5 leading-relaxed">{selectedUserDetail.address}</span>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2.5">
                                    <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                                    <div>
                                        <span className="text-slate-500 block text-[10px] uppercase">Assigned Entity Details</span>
                                        <span className="text-sm font-sans block mt-0.5">
                                            {selectedUserDetail.role === 'owner' ? (
                                                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg mt-1 text-xs space-y-1">
                                                    <p className="font-bold text-amber-700">Store Assigned:</p>
                                                    <p className="text-slate-800 text-xs">{getLinkedStoreName(selectedUserDetail)}</p>
                                                </div>
                                            ) : selectedUserDetail.role === 'user' ? (
                                                <p className="text-slate-600">Has submitted <strong className="text-slate-900">{selectedUserDetail.ratingCount || 0}</strong> ratings overall with average score of <strong className="text-slate-900">{selectedUserDetail.averageRatingGiven || 0}★</strong></p>
                                            ) : (
                                                <p className="text-slate-600">Platform Administrator User with Universal Write/Read Permissions.</p>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedUserDetail(null)}
                                className="w-full mt-6 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 py-2.5 text-xs font-bold transition cursor-pointer text-slate-700"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                )}

                {/* MODAL: Add User Form */}
                {showAddUser && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 p-6 sm:p-8 shadow-2xl">
                            <button
                                onClick={() => { setShowAddUser(false); setFormError(null); }}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h3 className="text-xl font-bold text-slate-900 mb-1.5">Add New User</h3>
                            <p className="text-xs text-slate-500 mb-4">Register a new system administrator, normal user, or store owner.</p>

                            {formError && (
                                <div className="mb-4 flex items-start space-x-2 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-800">
                                    <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-600" />
                                    <span>{formError}</span>
                                </div>
                            )}
                            {formSuccess && (
                                <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800">
                                    {formSuccess}
                                </div>
                            )}

                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                        Full Name (20 - 60 chars)
                                    </label>
                                    <input
                                        type="text"
                                        value={uName}
                                        onChange={(e) => setUName(e.target.value)}
                                        placeholder="e.g. Test System Admin Manager User"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-amber-500 transition"
                                        required
                                    />
                                    <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                                        Length: {uName.length} characters (Must be 20 to 60)
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={uEmail}
                                        onChange={(e) => setUEmail(e.target.value)}
                                        placeholder="e.g. newuser@ratenest.com"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-amber-500 transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                        Password (8-16 chars, 1 Upper, 1 Special)
                                    </label>
                                    <input
                                        type="text"
                                        value={uPassword}
                                        onChange={(e) => setUPassword(e.target.value)}
                                        placeholder="e.g. SecretPassword!1"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-amber-500 transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                        Physical Address (Max 400 chars)
                                    </label>
                                    <textarea
                                        value={uAddress}
                                        onChange={(e) => setUAddress(e.target.value)}
                                        placeholder="e.g. 123 Pinecrest Avenue, Portland, OR 97201"
                                        rows={2}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-amber-500 transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                        System Role
                                    </label>
                                    <select
                                        value={uRole}
                                        onChange={(e) => setURole(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-xl text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-amber-500 transition"
                                    >
                                        <option value="user">Normal User</option>
                                        <option value="owner">Store Owner</option>
                                        <option value="admin">System Administrator</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-4 rounded-xl bg-amber-400 py-3 text-xs font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-50 cursor-pointer shadow-sm"
                                >
                                    {loading ? 'Creating...' : 'Register User'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: Add Store Form */}
                {showAddStore && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 p-6 sm:p-8 shadow-2xl">
                            <button
                                onClick={() => { setShowAddStore(false); setFormError(null); }}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h3 className="text-xl font-bold text-slate-900 mb-1.5">Register New Store</h3>
                            <p className="text-xs text-slate-500 mb-4">Add a new retail store or business and assign it an owner.</p>

                            {formError && (
                                <div className="mb-4 flex items-start space-x-2 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-800">
                                    <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-600" />
                                    <span>{formError}</span>
                                </div>
                            )}
                            {formSuccess && (
                                <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800">
                                    {formSuccess}
                                </div>
                            )}

                            <form onSubmit={handleCreateStore} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                        Store Name
                                    </label>
                                    <input
                                        type="text"
                                        value={sName}
                                        onChange={(e) => setSName(e.target.value)}
                                        placeholder="e.g. The Craft Woodworks"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-amber-500 transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                        Business Email
                                    </label>
                                    <input
                                        type="email"
                                        value={sEmail}
                                        onChange={(e) => setSEmail(e.target.value)}
                                        placeholder="e.g. hello@woodworks.co"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-amber-500 transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                        Physical Address (Max 400 chars)
                                    </label>
                                    <textarea
                                        value={sAddress}
                                        onChange={(e) => setSAddress(e.target.value)}
                                        placeholder="e.g. 742 Pinecrest Lane, Portland, OR 97201"
                                        rows={2}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-amber-500 transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                        Business Category
                                    </label>
                                    <select
                                        value={sCategory}
                                        onChange={(e) => setSCategory(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-xl text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-amber-500 transition"
                                    >
                                        <option value="Lifestyle & Home">Lifestyle & Home</option>
                                        <option value="Coffee & Specialty">Coffee & Specialty</option>
                                        <option value="Plants & Wellness">Plants & Wellness</option>
                                        <option value="Art & Design">Art & Design</option>
                                        <option value="Boutiques & Apparel">Boutiques & Apparel</option>
                                        <option value="Organic Grocers">Organic Grocers</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                        Link Store Owner User (Optional)
                                    </label>
                                    <select
                                        value={sOwnerId}
                                        onChange={(e) => setSOwnerId(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-xl text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-amber-500 transition"
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
                                    className="w-full mt-4 rounded-xl bg-amber-400 py-3 text-xs font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-50 cursor-pointer shadow-sm"
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
