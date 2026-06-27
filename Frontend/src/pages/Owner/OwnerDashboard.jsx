import React, { useState, useEffect } from 'react';
import {
    Star, Lock, Eye, EyeOff, Check, AlertCircle, Mail, MapPin,
    Users, RefreshCw, Calendar, Award, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import './OwnerDashboard.css';

export default function OwnerDashboard({ currentUser, onLogout }) {
    const [store, setStore] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Password update form
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [pwError, setPwError] = useState(null);
    const [pwSuccess, setPwSuccess] = useState(null);
    const [pwLoading, setPwLoading] = useState(false);

    // Sorting
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // Password validations
    const passLength = newPassword.length >= 8 && newPassword.length <= 16;
    const passUpper = /[A-Z]/.test(newPassword);
    const passSpecial = /[^A-Za-z0-9]/.test(newPassword);

    const fetchStoreData = async () => {
        if (!currentUser.storeId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            // Fetch specific store
            const storeRes = await fetch(`/api/stores?currentUserId=${currentUser.id}`);
            const storesData = await storeRes.json();
            const myStore = storesData.find((s) => s.id === currentUser.storeId || s.ownerId === currentUser.id);

            if (myStore) {
                setStore(myStore);

                // Fetch ratings for this store
                const ratingsRes = await fetch(`/api/stores/${myStore.id}/ratings`);
                let ratingsData = await ratingsRes.json();

                // Apply local client-side sorting for ratings table as requested ("All tables should support sorting")
                if (sortField) {
                    ratingsData.sort((a, b) => {
                        let valA = a[sortField];
                        let valB = b[sortField];

                        if (typeof valA === 'string') {
                            valA = valA.toLowerCase();
                            valB = (valB || '').toLowerCase();
                            return valA.localeCompare(valB) * (sortOrder === 'desc' ? -1 : 1);
                        } else if (typeof valA === 'number') {
                            return (valA - valB) * (sortOrder === 'desc' ? -1 : 1);
                        }
                        return 0;
                    });
                }

                setRatings(ratingsData);
            }
        } catch (err) {
            console.error('Error fetching store owner data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStoreData();
    }, [currentUser.id, currentUser.storeId, sortField, sortOrder]);

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

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc'); // Default to descending for ratings
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return <ArrowUpDown style={{ marginLeft: '4px', height: '14px', width: '14px', color: 'var(--color-slate-400)' }} />;
        return sortOrder === 'asc'
            ? <ArrowUp style={{ marginLeft: '4px', height: '14px', width: '14px', color: 'var(--color-amber-500)' }} />
            : <ArrowDown style={{ marginLeft: '4px', height: '14px', width: '14px', color: 'var(--color-amber-500)' }} />;
    };

    const formatDate = (isoStr) => {
        try {
            const d = new Date(isoStr);
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return 'N/A';
        }
    };

    if (loading) {
        return (
            <div className="owner-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                    <RefreshCw className="cta-btn-icon" style={{ height: '24px', width: '24px', animation: 'spin 1s linear infinite', color: 'var(--color-amber-600)', margin: '0 auto 8px' }} />
                    <p>Loading your Store Owner Portal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="owner-container">
            <div className="max-container">

                {/* Top welcome section */}
                <div className="owner-header-row">
                    <div>
                        <span className="owner-portal-badge">
                            Store Owner Portal
                        </span>
                        <h1 className="owner-title">
                            {store ? store.name : 'Unassigned Store'}
                        </h1>
                    </div>
                    <button
                        onClick={fetchStoreData}
                        className="admin-btn-secondary"
                    >
                        <RefreshCw className="cta-btn-icon-brand" />
                        <span>Refresh Data</span>
                    </button>
                </div>

                {!store ? (
                    <div className="owner-unassigned-card">
                        <Award className="unassigned-card-icon" />
                        <h3 className="unassigned-card-title">No Store Link Detected</h3>
                        <p className="unassigned-card-desc">
                            You are registered as a Store Owner, but no physical store has been linked to your account yet.
                            Please contact the <strong>System Administrator</strong> to link your business so you can view store stats and customer reviews.
                        </p>
                    </div>
                ) : (
                    <div className="owner-grid">

                        {/* Left Column: Store Stats & Password Update */}
                        <div className="ud-left-col">

                            {/* Store Summary Card */}
                            <div className="store-summary-card">
                                <div className="store-summary-header">
                                    <div className="store-summary-icon-box">
                                        <Award className="store-summary-icon" />
                                    </div>
                                    {store.badge && (
                                        <span className="store-badge-small">
                                            {store.badge}
                                        </span>
                                    )}
                                </div>

                                <h3 className="profile-name">{store.name}</h3>
                                <span className="profile-role">
                                    {store.category}
                                </span>

                                {/* Score Stats Widgets */}
                                <div className="store-score-widgets">
                                    <div className="store-score-box">
                                        <p className="score-box-label">Average Rating</p>
                                        <div className="score-box-val-row">
                                            <Star className="star-filled" style={{ height: '20px', width: '20px' }} />
                                            <span className="score-box-num">{store.overallRating}</span>
                                        </div>
                                    </div>

                                    <div className="store-score-box">
                                        <p className="score-box-label">Total Ratings</p>
                                        <div className="score-box-val-row">
                                            <Users className="cta-btn-icon" style={{ height: '20px', width: '20px', color: 'var(--color-slate-400)' }} />
                                            <span className="score-box-num">{store.ratingCount}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-info-list" style={{ marginTop: '20px', borderTop: '1px solid var(--color-slate-100)', paddingTop: '16px' }}>
                                    <div className="profile-info-item">
                                        <Mail className="profile-info-icon" />
                                        <span className="profile-info-text-truncate">{store.email}</span>
                                    </div>
                                    <div className="profile-info-item align-start">
                                        <MapPin className="profile-info-icon mt-half" />
                                        <span className="profile-info-leading-relaxed">{store.address}</span>
                                    </div>
                                </div>

                                <div className="store-decor-blurred"></div>
                            </div>

                            {/* Password update Form */}
                            <div className="password-card">
                                <div className="password-card-header">
                                    <Lock className="password-card-icon" />
                                    <h4 className="password-card-title">Update Owner Password</h4>
                                </div>

                                {pwError && (
                                    <div className="signup-alert error" style={{ marginBottom: '16px' }}>
                                        <AlertCircle className="signup-alert-icon" />
                                        <span>{pwError}</span>
                                    </div>
                                )}
                                {pwSuccess && (
                                    <div className="signup-alert success" style={{ marginBottom: '16px' }}>
                                        <span>{pwSuccess}</span>
                                    </div>
                                )}

                                <form onSubmit={handlePasswordChange} className="signup-form">
                                    <div className="form-group">
                                        <label className="form-label">New Owner Password</label>
                                        <div className="password-input-wrapper">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter password"
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

                                    {/* Password rules indicator */}
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

                        {/* Right Column: Submitted User Ratings List */}
                        <div className="ud-right-col">
                            <div>
                                <h3 className="ud-title">Store Ratings Log</h3>
                                <p className="ud-subtitle" style={{ marginTop: '4px' }}>Review feedback submitted by verified customers</p>
                            </div>

                            {/* Ratings table */}
                            <div className="table-panel">
                                <div className="table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th onClick={() => toggleSort('userName')} className="sortable">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>Customer {getSortIcon('userName')}</div>
                                                </th>
                                                <th onClick={() => toggleSort('userEmail')} className="sortable">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>Email {getSortIcon('userEmail')}</div>
                                                </th>
                                                <th onClick={() => toggleSort('ratingValue')} className="sortable">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>Rating {getSortIcon('ratingValue')}</div>
                                                </th>
                                                <th onClick={() => toggleSort('createdAt')} className="sortable">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>Date {getSortIcon('createdAt')}</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ratings.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-slate-400)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                                                        No customers have rated your store yet.
                                                    </td>
                                                </tr>
                                            ) : (
                                                ratings.map((rating) => (
                                                    <tr key={rating.id}>
                                                        <td className="name">{rating.userName}</td>
                                                        <td className="email">{rating.userEmail}</td>
                                                        <td>
                                                            <div className="admin-table-stars-row">
                                                                <div style={{ display: 'flex' }}>
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star
                                                                            key={star}
                                                                            className={`stars-list-icon ${star <= rating.ratingValue ? 'filled' : 'empty'
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="overall-rating-num" style={{ fontSize: '11px', marginLeft: '6px' }}>{rating.ratingValue}★</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ color: 'var(--color-slate-500)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                                <Calendar style={{ height: '14px', width: '14px', color: 'var(--color-slate-400)' }} />
                                                                <span>{formatDate(rating.createdAt)}</span>
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

                    </div>
                )}

            </div>
        </div>
    );
}
