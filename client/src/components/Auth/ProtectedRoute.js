import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#e2e8f0'
        }}>
          <div className="spin" style={{
            width: '40px',
            height: '40px',
            border: '3px solid #334155',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            margin: '0 auto 16px'
          }}></div>
          <p>Ładowanie Blue Queen...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;