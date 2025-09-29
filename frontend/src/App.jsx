import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { setUser, logout } from './store/authSlice';
import { setIsMobile } from './store/uiSlice';
import { authAPI } from './services/api';
import { icyTheme } from './styles/theme';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token, loading } = useSelector(state => state.auth);

  useEffect(() => {
    // Check for existing token on app start
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await authAPI.validateToken();
          if (response.data.valid) {
            dispatch(setUser(response.data.user));
          } else {
            dispatch(logout());
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          dispatch(logout());
        }
      }
    };

    checkAuth();
  }, [token, dispatch]);

  useEffect(() => {
    // Handle responsive design
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth <= 768));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Handle install prompt for PWA
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      deferredPrompt = e;
    });

    // Handle app installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
    });
  }, []);

  if (loading && token) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={icyTheme}>
      {isAuthenticated ? <ChatPage /> : <LoginPage />}
    </ThemeProvider>
  );
}

export default App;
