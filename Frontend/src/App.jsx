import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import LandingPage from './pages/Landing/LandingPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserDashboard from './pages/Users/UserDashboard';
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import Footer from './components/Footer';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState('signin');
  const [currentTab, setCurrentTab] = useState('home'); // 'home' or 'dashboard'

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('ratenest_session_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
        setCurrentTab('dashboard'); // Automatically take them to their workspace if logged in!
      }
    } catch (err) {
      console.error('Error parsing stored session:', err);
    }
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('ratenest_session_user', JSON.stringify(user));
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ratenest_session_user');
    setCurrentTab('home');
  };

  const handleOpenAuth = (view) => {
    setAuthModalInitialView(view);
    setAuthModalOpen(true);
  };

  const handleSelectStoreToRate = (storeId) => {
    if (!currentUser) {
      // Prompt auth first
      handleOpenAuth('signin');
    } else if (currentUser.role === 'user') {
      // Take them to user dashboard to rate
      setCurrentTab('dashboard');
    } else {
      // Admins or owners cannot rate directly as standard users, so we can notify them or show the view
      setCurrentTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-amber-400 selection:text-slate-950">

      {/* 1. Header */}
      <Header
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onNavigateHome={() => setCurrentTab('home')}
        onOpenDashboard={() => setCurrentTab('dashboard')}
        currentTab={currentTab}
      />

      {/* 2. Main Body (Conditional routing) */}
      <main className="flex-grow">
        {currentTab === 'home' ? (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onSelectStoreToRate={handleSelectStoreToRate}
          />
        ) : currentUser ? (
          <>
            {currentUser.role === 'admin' && <AdminDashboard onLogout={handleLogout} />}
            {currentUser.role === 'user' && <UserDashboard currentUser={currentUser} onLogout={handleLogout} />}
            {currentUser.role === 'owner' && <OwnerDashboard currentUser={currentUser} onLogout={handleLogout} />}
          </>
        ) : (
          // Fallback if they are on dashboard view but not logged in
          <div className="py-24 text-center space-y-4">
            <p className="text-slate-500 font-mono text-xs">Please sign in to view your dashboard portal.</p>
            <button
              onClick={() => handleOpenAuth('signin')}
              className="rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition cursor-pointer"
            >
              Sign In Now
            </button>
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialView={authModalInitialView}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
