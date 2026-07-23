import React, { useState } from 'react';
import { X, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import './AuthModal.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";


export default function AuthModal({ isOpen, onClose, initialView, onAuthSuccess }) {
    const [view, setView] = useState(initialView);
    const [showPassword, setShowPassword] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    // UI States
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    // Real-time Validations Checks for interactive UI helper
    const nameMin = name.length >= 20;
    const nameMax = name.length <= 60;
    const addressMax = address.length <= 400;

    const passLength = password.length >= 8 && password.length <= 16;
    const passUpper = /[A-Z]/.test(password);
    const passSpecial = /[^A-Za-z0-9]/.test(password);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (view === 'signup') {
                // Run validations before sending
                if (name.length < 20 || name.length > 60) {
                    throw new Error('Name must be between 20 and 60 characters long');
                }
                if (address.length > 400 || !address) {
                    throw new Error('Address is required and must be at most 400 characters');
                }
                if (!passLength || !passUpper || !passSpecial) {
                    throw new Error('Password must be 8-16 characters and contain an uppercase and special character');
                }
                if (!isEmailValid) {
                    throw new Error('Please enter a valid email address');
                }

                const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, address, password }),
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Registration failed');
                }

                setSuccess('Account created successfully! Please log in.');
                setTimeout(() => {
                    setView('signin');
                }, 1200);
            } else {
                // Sign In
                const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Login failed');
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                onAuthSuccess(data.user);
                onClose();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleView = () => {
        setView(view === 'signin' ? 'signup' : 'signin');
        setError(null);
        setSuccess(null);
        setEmail('');
        setPassword('');
        setName('');
        setAddress('');
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal-card" id="auth-modal-container">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="auth-modal-close-btn"
                    id="auth-modal-close"
                >
                    <X className="cta-btn-icon" style={{ height: '20px', width: '20px' }} />
                </button>

                {/* Title */}
                <div className="auth-modal-header">
                    <h2 className="auth-modal-title">
                        {view === 'signin' ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p className="auth-modal-desc">
                        {view === 'signin'
                            ? "Sign in to access store ratings and your dashboard"
                            : "Register on RateNest to submit feedback for your favorite stores"
                        }
                    </p>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="signup-alert error">
                        <AlertCircle className="signup-alert-icon" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="signup-alert success">
                        <Check className="signup-alert-icon" />
                        <span>{success}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="auth-modal-form" id="auth-modal-form">
                    {view === 'signup' && (
                        <>
                            {/* Name Field */}
                            <div className="form-group">
                                <label className="auth-modal-label">
                                    Full Name (20-60 characters)
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Maria Esperanza Frequent Shopper"
                                    className={`auth-modal-input ${name ? (nameMin && nameMax ? 'valid' : 'invalid') : ''
                                        }`}
                                    required
                                />
                                <div className="rules-grid">
                                    <span className={`rules-grid-item ${nameMin ? 'checked' : ''}`}>
                                        <Check className="rules-grid-item-icon" /> Min 20 chars ({name.length}/20)
                                    </span>
                                    <span className={`rules-grid-item ${nameMax ? 'checked' : 'error'}`}>
                                        <Check className="rules-grid-item-icon" /> Max 60 chars
                                    </span>
                                </div>
                            </div>

                            {/* Address Field */}
                            <div className="form-group">
                                <label className="auth-modal-label">
                                    Address (Max 400 characters)
                                </label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="e.g. 321 Maple Street, Brooklyn, NY 11201"
                                    rows={2}
                                    className={`auth-modal-input ${address ? (addressMax ? 'valid' : 'invalid') : ''
                                        }`}
                                    required
                                />
                                <div className="char-count-tracker">
                                    {address.length}/400 characters
                                </div>
                            </div>
                        </>
                    )}

                    {/* Email Field */}
                    <div className="form-group">
                        <label className="auth-modal-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. customer@example.com"
                            className={`auth-modal-input ${email ? (isEmailValid ? 'valid' : 'invalid') : ''
                                }`}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label className="auth-modal-label">
                            Password
                        </label>
                        <div className="auth-password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="auth-modal-input"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="auth-password-toggle-btn"
                            >
                                {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                            </button>
                        </div>

                        {view === 'signup' && (
                            <div className="password-rules-box">
                                <p className="password-rules-box-title">Password Rules:</p>
                                <div className={`rule-item ${passLength ? 'success' : ''}`}>
                                    <Check className="rule-icon" />
                                    <span>8-16 characters ({password.length} currently)</span>
                                </div>
                                <div className={`rule-item ${passUpper ? 'success' : ''}`}>
                                    <Check className="rule-icon" />
                                    <span>At least one uppercase letter (A-Z)</span>
                                </div>
                                <div className={`rule-item ${passSpecial ? 'success' : ''}`}>
                                    <Check className="rule-icon" />
                                    <span>At least one special character (!, @, #, etc.)</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-submit-btn"
                    >
                        {loading ? 'Processing...' : view === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {/* Demo credentials info box */}
                {view === 'signin' && (
                    <div className="demo-credentials-box">
                        <p className="demo-credentials-box-title">💡 Demo Quick Login Credentials:</p>
                        <ul className="demo-credentials-list">
                            <li><strong>Admin:</strong> admin@ratenest.com / RateNestAdmin!1</li>
                            <li><strong>User:</strong> maria@ratenest.com / Maria@123456</li>
                            <li><strong>Owner (Harlow):</strong> harlow@ratenest.com / Harlow@12345</li>
                        </ul>
                    </div>
                )}

                {/* Toggle View */}
                <div className="auth-modal-footer">
                    <span className="auth-modal-footer-text">
                        {view === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                    </span>
                    <button
                        onClick={handleToggleView}
                        className="auth-modal-toggle-btn"
                    >
                        {view === 'signin' ? 'Sign up' : 'Log in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
