import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.callbacks = {};
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    // Use native WebSocket for better control
    this.socket = new WebSocket(`${WS_URL}/ws`);

    this.socket.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('WebSocket połączony');
      
      // Authenticate immediately after connection
      this.send({
        type: 'auth',
        token: token
      });

      this.trigger('connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket wiadomość:', data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Błąd parsowania wiadomości WebSocket:', error);
      }
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      console.log('WebSocket rozłączony');
      this.trigger('disconnected');
      this.attemptReconnect(token);
    };

    this.socket.onerror = (error) => {
      console.error('Błąd WebSocket:', error);
      this.trigger('error', error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }

  send(data) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket nie jest połączony');
    }
  }

  sendMessage(message) {
    this.send({
      type: 'chat',
      text: message
    });
  }

  ping() {
    this.send({ type: 'ping' });
  }

  handleMessage(data) {
    switch (data.type) {
      case 'welcome':
        this.trigger('welcome', data.message);
        break;
      case 'auth_success':
        this.trigger('auth_success', data.user);
        break;
      case 'auth_error':
        this.trigger('auth_error', data.error);
        break;
      case 'chat_response':
        this.trigger('chat_response', data);
        break;
      case 'chat_error':
        this.trigger('chat_error', data);
        break;
      case 'typing':
        this.trigger('typing', data.message);
        break;
      case 'pong':
        this.trigger('pong', data.timestamp);
        break;
      case 'error':
        this.trigger('error', data.error);
        break;
      default:
        console.log('Nieznany typ wiadomości WebSocket:', data.type);
    }
  }

  attemptReconnect(token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      console.log(`Próba ponownego połączenia ${this.reconnectAttempts}/${this.maxReconnectAttempts} za ${delay}ms`);
      
      setTimeout(() => {
        this.connect(token);
      }, delay);
    } else {
      console.error('Przekroczono maksymalną liczbę prób ponownego połączenia');
      this.trigger('max_reconnect_exceeded');
    }
  }

  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }

  trigger(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }
}

export default new WebSocketService();