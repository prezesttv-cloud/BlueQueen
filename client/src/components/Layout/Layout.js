import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Crown, LogOut, User } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <Crown size={24} className="logo-icon" />
              <h1>Blue Queen</h1>
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-info">
              <User size={16} />
              <span className="username">
                {user?.username}
                {user?.isGuest && <span className="guest-badge">Gość</span>}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="btn btn-ghost logout-btn"
              title="Wyloguj"
            >
              <LogOut size={16} />
              <span className="logout-text">Wyloguj</span>
            </button>
          </div>
        </div>
      </header>

      <main className="layout-main">
        {children}
      </main>

      <div className="layout-bg-effects">
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
      </div>
    </div>
  );
};

export default Layout;