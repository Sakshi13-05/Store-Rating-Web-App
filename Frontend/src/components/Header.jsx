import React from 'react';
import { Star, LogOut, Shield, Store as StoreIcon, User as UserIcon } from 'lucide-react';
import './Header.css';

export default function Header({
    currentUser,
    onOpenAuth,
    onLogout,
    onNavigateHome,
    onOpenDashboard,
    currentTab,
}) {
    return (
        <header className="header">
            <div className="header-container max-container">
                {/* Logo */}
                <button
                    onClick={onNavigateHome}
                    className="logo-btn"
                    id="header-logo-btn"
                >
                    <div className="logo-icon-box">
                        <Star className="logo-star" />
                    </div>
                    <span className="logo-text">
                        Rate<span className="logo-nest">Nest</span>
                    </span>
                </button>

                {/* Nav Links */}
                <nav className="header-nav">
                    <button
                        onClick={onNavigateHome}
                        className={`nav-link ${currentTab === 'home' ? 'active' : ''}`}
                    >
                        Discover
                    </button>
                    <a
                        href="#curated-picks"
                        className="nav-link"
                    >
                        Top Rated
                    </a>
                    <a
                        href="#how-it-works"
                        className="nav-link"
                    >
                        How It Works
                    </a>
                    <a
                        href="#business-cta"
                        className="nav-link"
                    >
                        For Businesses
                    </a>
                </nav>

                {/* Right Buttons / User info */}
                <div className="header-actions">
                    {currentUser ? (
                        <div className="user-logged-in">
                            <button
                                onClick={onOpenDashboard}
                                className="portal-btn"
                                id="header-dashboard-btn"
                            >
                                {currentUser.role === 'admin' && <Shield className="portal-btn-icon" />}
                                {currentUser.role === 'owner' && <StoreIcon className="portal-btn-icon" />}
                                {currentUser.role === 'user' && <UserIcon className="portal-btn-icon" />}
                                <span className="portal-btn-text">
                                    {currentUser.role === 'admin'
                                        ? 'Admin Portal'
                                        : currentUser.role === 'owner'
                                            ? 'Store Portal'
                                            : 'My Ratings'}
                                </span>
                            </button>

                            <div className="user-profile-info">
                                <span className="user-profile-name">
                                    {currentUser.name}
                                </span>
                                <span className="user-profile-role">
                                    {currentUser.role}
                                </span>
                            </div>

                            <button
                                onClick={onLogout}
                                className="logout-btn"
                                title="Log Out"
                                id="header-logout-btn"
                            >
                                <LogOut className="logout-btn-icon" />
                            </button>
                        </div>
                    ) : (
                        <div className="user-logged-out">
                            <button
                                onClick={() => onOpenAuth('signin')}
                                className="signin-btn"
                                id="header-signin-btn"
                            >
                                Sign in
                            </button>
                            <button
                                onClick={() => onOpenAuth('signup')}
                                className="signup-btn"
                                id="header-signup-btn"
                            >
                                Get started free
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
