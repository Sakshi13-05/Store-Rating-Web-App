import React, { useState, useEffect } from 'react';
import {
    Search, Star, Lock, Eye, EyeOff, Check, AlertCircle, RefreshCw,
    ArrowUpDown, ArrowUp, ArrowDown, MapPin, Tag, Mail
} from 'lucide-react';
import './UserDashboard.css';

export default function UserDashboard({ currentUser, onLogout }) {
    const [stores, setStores] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Sorting
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    // Password update form
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [pwError, setPwError] = useState(null);
    const [pwSuccess, setPwSuccess] = useState(null);
    const [pwLoading, setPwLoading] = useState(false);

    // Active rating feedback
    const [ratingError, setRatingError] = useState(null);
    const [ratingSuccess, setRatingSuccess] = useState(null);
    const [activeRatingStoreId, setActiveRatingStoreId] = useState(null);
    const [hoverRatingValue, setHoverRatingValue] = useState(0);

    // Password rules tracking
    const passLength = newPassword.length >= 8 && newPassword.length <= 16;
    const passUpper = /[A-Z]/.test(newPassword);
    const passSpecial = /[^A-Za-z0-9]/.test(newPassword);

    const fetchStores = async () => {
        try {
            const query = new URLSearchParams({
                search: searchQuery,
                category: categoryFilter,
                sortBy: sortField,
                sortOrder: sortOrder,
                currentUserId: currentUser.id,
            }).toString();

            const res = await fetch(`/api/stores?${query}`);
            const data = await res.json();
            if (res.ok) {
                setStores(data);
            }
        } catch (err) {
            console.error('Error loading stores:', err);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [searchQuery, categoryFilter, sortField, sortOrder, currentUser.id]);

    // Handle password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwError(null);
        setPwSuccess(null);
        setPwLoading(true);

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    password: newPassword,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Password update failed');

            setPwSuccess('Password updated successfully!');
            setNewPassword('');
        } catch (err) {
            setPwError(err.message);
        } finally {
            setPwLoading(false);
        }
    };

    // Submit/Modify Store rating
    const handleRateStore = async (storeId, value) => {
        setRatingError(null);
        setRatingSuccess(null);
        setActiveRatingStoreId(storeId);

        try {
            const res = await fetch('/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    storeId,
                    ratingValue: value,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit rating');

            setRatingSuccess(`Successfully submitted rating of ${value}★!`);
            fetchStores();
            setTimeout(() => {
                setRatingSuccess(null);
                setActiveRatingStoreId(null);
            }, 1500);
        } catch (err) {
            setRatingError(err.message);
            setTimeout(() => {
                setRatingError(null);
                setActiveRatingStoreId(null);
            }, 2000);
        }
    };

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return <ArrowUpDown className="sort-icon" />;
        return sortOrder === 'asc'
            ? <ArrowUp className="sort-icon active" />
            : <ArrowDown className="sort-icon active" />;
    };

    return (
        <div className="ud-container">
            <div className="max-container ud-grid">

                {/* Left Column: Profile Card & Update Password Form */}
                <div className="ud-left-col">
                    {/* Profile Details */}
                    <div className="profile-card">
                        <div className="profile-avatar">
                            <span>{currentUser.name.substring(0, 1)}</span>
                        </div>
                        <h3 className="profile-name" title={currentUser.name}>{currentUser.name}</h3>
                        <span className="profile-role">
                            {currentUser.role}
                        </span>
                        <div className="profile-info-list">
                            <div className="profile-info-item">
                                <Mail className="profile-info-icon" />
                                <span className="profile-info-text-truncate">{currentUser.email}</span>
                            </div>
                            <div className="profile-info-item align-start">
                                <MapPin className="profile-info-icon mt-half" />
                                <span className="profile-info-leading-relaxed">{currentUser.address}</span>
                            </div>
                        </div>
                        <div className="profile-card-decor"></div>
                    </div>

                    {/* Change Password */}
                    <div className="password-card">
                        <div className="password-card-header">
                            <Lock className="password-card-icon" />
                            <h4 className="password-card-title">Update Password</h4>
                        </div>

                        {pwError && (
                            <div className="signup-alert error">
                                <AlertCircle className="signup-alert-icon" />
                                <span>{pwError}</span>
                            </div>
                        )}
                        {pwSuccess && (
                            <div className="signup-alert success">
                                <Check className="signup-alert-icon" />
                                <span>{pwSuccess}</span>
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="signup-form">
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="form-input password-input"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="password-toggle-btn"
                                    >
                                        {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                                    </button>
                                </div>
                            </div>

                            {/* Real-time rules checklist */}
                            <div className="password-rules-box">
                                <div className={`rule-item ${passLength ? 'success' : ''}`}>
                                    <Check className="rule-icon" />
                                    <span>8-16 characters ({newPassword.length})</span>
                                </div>
                                <div className={`rule-item ${passUpper ? 'success' : ''}`}>
                                    <Check className="rule-icon" />
                                    <span>At least 1 uppercase letter</span>
                                </div>
                                <div className={`rule-item ${passSpecial ? 'success' : ''}`}>
                                    <Check className="rule-icon" />
                                    <span>At least 1 special character (!, @, etc.)</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={pwLoading || !passLength || !passUpper || !passSpecial}
                                className="signup-submit-btn"
                            >
                                {pwLoading ? 'Updating...' : 'Save New Password'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Stores List and Rating Panel */}
                <div className="ud-right-col">
                    <div className="ud-header-row">
                        <div>
                            <h2 className="ud-title">Registered Stores</h2>
                            <p className="ud-subtitle">Submit feedback or modify previous ratings below</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button
                                onClick={fetchStores}
                                className="refresh-btn"
                                title="Refresh Store Ratings"
                            >
                                <RefreshCw className="cta-btn-icon" />
                            </button>
                        </div>
                    </div>

                    {/* Search and category filters */}
                    <div className="filters-bar">
                        <div className="search-input-wrapper">
                            <Search className="search-icon-small" />
                            <input
                                type="text"
                                placeholder="Search stores by Name or Address..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input-field"
                            />
                        </div>
                        <div className="category-select-wrapper">
                            <Tag className="category-select-icon" />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="category-select-dropdown"
                            >
                                <option value="all">All Categories</option>
                                <option value="lifestyle & home">Lifestyle & Home</option>
                                <option value="coffee & specialty">Coffee & Specialty</option>
                                <option value="plants & wellness">Plants & Wellness</option>
                                <option value="art & design">Art & Design</option>
                            </select>
                        </div>
                    </div>

                    {/* Sorting controls */}
                    <div className="sorting-row">
                        <span>Sort stores by:</span>
                        <button
                            onClick={() => toggleSort('name')}
                            className={`sort-btn ${sortField === 'name' ? 'active' : ''}`}
                        >
                            Name {getSortIcon('name')}
                        </button>
                        <button
                            onClick={() => toggleSort('category')}
                            className={`sort-btn ${sortField === 'category' ? 'active' : ''}`}
                        >
                            Category {getSortIcon('category')}
                        </button>
                        <button
                            onClick={() => toggleSort('overallRating')}
                            className={`sort-btn ${sortField === 'overallRating' ? 'active' : ''}`}
                        >
                            Rating {getSortIcon('overallRating')}
                        </button>
                    </div>

                    {/* Feedback Status for rating submissions */}
                    {ratingSuccess && (
                        <div className="signup-alert success" style={{ justifyContent: 'center' }}>
                            <span>{ratingSuccess}</span>
                        </div>
                    )}
                    {ratingError && (
                        <div className="signup-alert error" style={{ justifyContent: 'center' }}>
                            <span>{ratingError}</span>
                        </div>
                    )}

                    {/* Stores Listing */}
                    <div className="stores-listing">
                        {stores.length === 0 ? (
                            <div className="no-stores-fallback">
                                No registered stores match your search criteria.
                            </div>
                        ) : (
                            stores.map((store) => (
                                <div key={store.id} className="store-dashboard-card">
                                    <div className="store-info-block">
                                        <div className="store-title-row">
                                            <h4 className="store-title">{store.name}</h4>
                                            {store.badge && (
                                                <span className="store-badge-small">
                                                    {store.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="store-meta-row">
                                            <span className="store-category-pill">
                                                {store.category}
                                            </span>
                                            <span className="store-meta-divider">•</span>
                                            <span className="store-meta-address">{store.address}</span>
                                        </div>

                                        {/* Overall Rating Score Display */}
                                        <div className="store-ratings-row">
                                            <div className="stars-list">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`stars-list-icon ${star <= Math.round(store.overallRating) ? 'filled' : 'empty'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="overall-rating-num">{store.overallRating}</span>
                                            <span className="overall-rating-reviews">({store.ratingCount} reviews)</span>
                                        </div>
                                    </div>

                                    {/* Rating Selector Block */}
                                    <div className="rating-selector-block">
                                        <div className="selector-label">
                                            {store.userRating ? "Your Rating: " + store.userRating + "★" : "Submit Rating"}
                                        </div>

                                        {/* Interactive Stars */}
                                        <div className="interactive-stars-row">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => handleRateStore(store.id, star)}
                                                    onMouseEnter={() => {
                                                        setActiveRatingStoreId(store.id);
                                                        setHoverRatingValue(star);
                                                    }}
                                                    onMouseLeave={() => {
                                                        setActiveRatingStoreId(null);
                                                        setHoverRatingValue(0);
                                                    }}
                                                    className="star-interactive-btn"
                                                >
                                                    <Star
                                                        className={`star-interactive-icon ${(activeRatingStoreId === store.id && hoverRatingValue >= star) ||
                                                                (!activeRatingStoreId && store.userRating && store.userRating >= star)
                                                                ? 'active'
                                                                : 'inactive'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>

                                        <p className="selector-helper-text">
                                            {store.userRating ? "Click any star to modify rating" : "Select 1 to 5 stars above"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
