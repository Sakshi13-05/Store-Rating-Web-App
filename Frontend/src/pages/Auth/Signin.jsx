import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import './Signin.css';
import { login } from '../../services/authservice';

export default function Signin({ onAuthSuccess, onToggleView }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSignin = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

            const response = await login({
                email,
                password
            });

            // Save JWT
            localStorage.setItem("token", response.data.token);

            // Save logged in user
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            // Update App state
            onAuthSuccess(response.data.user);

            alert("Login Successful");

            // Close modal
            onClose();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Login Failed"
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="signin-container">
            <div className="signin-card">
                <div className="signin-header">
                    <h2 className="signin-title">Welcome back</h2>
                    <p className="signin-subtitle">
                        Sign in to access store ratings and your dashboard portal
                    </p>
                </div>

                {error && (
                    <div className="signin-alert">
                        <AlertCircle className="signin-alert-icon" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSignin} className="signin-form">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. customer@example.com"
                            className="form-input"
                            required
                        />
                    </div>

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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="signin-submit-btn"
                    >
                        {loading ? 'Processing...' : 'Sign In'}
                    </button>
                </form>

                <div className="demo-credentials">
                    <p className="demo-title">💡 Demo Quick Login Credentials:</p>
                    <ul className="demo-list">
                        <li><strong>Admin:</strong> admin@ratenest.com / RateNestAdmin!1</li>
                        <li><strong>User:</strong> maria@ratenest.com / Maria@123456</li>
                        <li><strong>Owner:</strong> harlow@ratenest.com / Harlow@12345</li>
                    </ul>
                </div>

                <div className="signin-footer">
                    <span className="footer-text">Don't have an account?</span>
                    <button onClick={onToggleView} className="footer-link">
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}
