import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Crown, User, Lock, UserPlus, Users } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
  const { login, register, guestLogin, isAuthenticated, isLoading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clear errors when switching modes
    setErrors({});
  }, [mode]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Nazwa użytkownika jest wymagana';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nazwa użytkownika musi mieć co najmniej 3 znaki';
    }

    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Hasło musi mieć co najmniej 6 znaków';
    }

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      let result;
      if (mode === 'login') {
        result = await login(formData.username, formData.password);
      } else {
        result = await register(formData.username, formData.password);
      }

      if (!result.success) {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Wystąpił nieoczekiwany błąd' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsSubmitting(true);
    try {
      const result = await guestLogin();
      if (!result.success) {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Wystąpił błąd podczas logowania gościa' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="logo">
            <Crown size={48} className="logo-icon" />
            <h1>Blue Queen</h1>
          </div>
          <p className="subtitle">
            Twój zawsze dostępny asystent AI
          </p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <User size={16} />
              Nazwa użytkownika
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`input ${errors.username ? 'input-error' : ''}`}
              placeholder="Wprowadź nazwę użytkownika"
              disabled={isSubmitting}
            />
            {errors.username && (
              <span className="field-error">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock size={16} />
              Hasło
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`input ${errors.password ? 'input-error' : ''}`}
              placeholder="Wprowadź hasło"
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <Lock size={16} />
                Potwierdź hasło
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Potwierdź hasło"
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" />
                {mode === 'login' ? 'Logowanie...' : 'Tworzenie konta...'}
              </>
            ) : (
              <>
                {mode === 'login' ? <User size={16} /> : <UserPlus size={16} />}
                {mode === 'login' ? 'Zaloguj się' : 'Utwórz konto'}
              </>
            )}
          </button>
        </form>

        {/* Mode toggle */}
        <div className="mode-toggle">
          {mode === 'login' ? (
            <p>
              Nie masz konta?{' '}
              <button
                type="button"
                className="text-button"
                onClick={() => setMode('register')}
                disabled={isSubmitting}
              >
                Zarejestruj się
              </button>
            </p>
          ) : (
            <p>
              Masz już konto?{' '}
              <button
                type="button"
                className="text-button"
                onClick={() => setMode('login')}
                disabled={isSubmitting}
              >
                Zaloguj się
              </button>
            </p>
          )}
        </div>

        {/* Guest access */}
        <div className="guest-access">
          <div className="divider">
            <span>lub</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-full"
            onClick={handleGuestLogin}
            disabled={isSubmitting || isLoading}
          >
            <Users size={16} />
            Kontynuuj jako gość
          </button>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>
            Blue Queen wykorzystuje sztuczną inteligencję do prowadzenia rozmów w języku polskim
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;