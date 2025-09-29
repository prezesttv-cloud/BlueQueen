import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blue_queen_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('blue_queen_token');
      localStorage.removeItem('blue_queen_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AuthService {
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      
      localStorage.setItem('blue_queen_token', token);
      localStorage.setItem('blue_queen_user', JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Błąd logowania'
      };
    }
  }

  async register(username, password) {
    try {
      const response = await api.post('/auth/register', { username, password });
      const { token, user } = response.data;
      
      localStorage.setItem('blue_queen_token', token);
      localStorage.setItem('blue_queen_user', JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Błąd rejestracji'
      };
    }
  }

  async guestAccess() {
    try {
      const response = await api.post('/auth/guest');
      const { token, user } = response.data;
      
      localStorage.setItem('blue_queen_token', token);
      localStorage.setItem('blue_queen_user', JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error) {
      console.error('Guest access error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Błąd dostępu gościa'
      };
    }
  }

  async verifyToken() {
    try {
      const response = await api.post('/auth/verify');
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('Token verification error:', error);
      this.logout();
      return { success: false };
    }
  }

  logout() {
    localStorage.removeItem('blue_queen_token');
    localStorage.removeItem('blue_queen_user');
  }

  getStoredUser() {
    try {
      const userStr = localStorage.getItem('blue_queen_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  getStoredToken() {
    return localStorage.getItem('blue_queen_token');
  }

  isAuthenticated() {
    return !!(this.getStoredToken() && this.getStoredUser());
  }
}

class ChatService {
  async sendMessage(message, generateAudio = false) {
    try {
      const response = await api.post('/chat/message', {
        message,
        generateAudio
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Send message error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Błąd wysyłania wiadomości'
      };
    }
  }

  async generateAudio(text) {
    try {
      const response = await api.post('/chat/audio', { text });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Audio generation error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Błąd generowania audio'
      };
    }
  }

  async getConversationHistory() {
    try {
      const response = await api.get('/chat/history');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('History fetch error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Błąd pobierania historii'
      };
    }
  }
}

// Service instances
export const authService = new AuthService();
export const chatService = new ChatService();
export { api };
export default api;