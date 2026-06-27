import React, { useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import './Signup.css';

export default function Signup({ onAuthSuccess, onToggleView }) {
    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // UI States
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // Real-time Validations Checks
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

            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, address, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setSuccess('Account created successfully! Logging you in...');
            setTimeout(() => {
                onAuthSuccess(data.user);
            }, 1200);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h2 className="signup-title">Create an account</h2>
                    <p className="signup-subtitle">
                        Register on RateNest to submit feedback for your favorite stores
                    </p>
                </div>

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

                <form onSubmit={handleSubmit} className="signup-form">
                    {/* Name Field */}
                    <div className="form-group">
                        <label className="form-label">Full Name (20-60 characters)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Maria Esperanza Frequent Shopper"
                            className={`form-input ${name ? (nameMin && nameMax ? 'input-success' : 'input-warning') : ''
                                }`}
                            required
                        />
                        <div className="form-helper-row">
                            <span className={`helper-item ${nameMin ? 'success' : ''}`}>
                                <Check className="helper-icon" /> Min 20 chars ({name.length}/20)
                            </span>
                            <span className={`helper-item ${nameMax ? 'success' : 'error'}`}>
                                <Check className="helper-icon" /> Max 60 chars
                            </span>
                        </div>
                    </div>

                    {/* Address Field */}
                    <div className="form-group">
                        <label className="form-label">Address (Max 400 characters)</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g. 321 Maple Street, Brooklyn, NY 11201"
                            rows={2}
                            className={`form-input ${address ? (addressMax ? 'input-success' : 'input-error') : ''
                                }`}
                            required
                        />
                        <div className="form-counter">
                            {address.length}/400 characters
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. customer@example.com"
                            className={`form-input ${email ? (isEmailValid ? 'input-success' : 'input-warning') : ''
                                }`}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                        <div className="password-rules-box">
                            <p className="rules-title">Password Rules:</p>
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="signup-submit-btn"
                    >
                        {loading ? 'Processing...' : 'Create Account'}
                    </button>
                </form>

                <div className="signup-footer">
                    <span className="footer-text">Already have an account?</span>
                    <button onClick={onToggleView} className="footer-link">
                        Log in
                    </button>
                </div>
            </div>
        </div>
    );
}
