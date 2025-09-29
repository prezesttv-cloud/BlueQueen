import { io } from 'socket.io-client';
import { authService } from './api';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.eventHandlers = new Map();
  }

  connect() {
    const token = authService.getStoredToken();
    
    if (!token) {
      console.error('No token available for socket connection');
      return false;
    }

    const serverUrl = process.env.REACT_APP_SOCKET_URL || window.location.origin;

    this.socket = io(serverUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      autoConnect: true
    });

    this.setupEventHandlers();
    return true;
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected successfully');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connection_status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
      this.emit('connection_status', { connected: false, reason });
      
      // Auto-reconnect logic
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.attemptReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('connection_error', { error: error.message });
      this.attemptReconnect();
    });

    // AI chat events
    this.socket.on('chat_response', (data) => {
      console.log('Received chat response:', data);
      this.emit('chat_response', data);
    });

    this.socket.on('ai_typing', (data) => {
      this.emit('ai_typing', data);
    });

    this.socket.on('audio_generated', (data) => {
      console.log('Audio generated:', data);
      this.emit('audio_generated', data);
    });

    // System events
    this.socket.on('system_message', (data) => {
      console.log('System message:', data);
      this.emit('system_message', data);
    });

    this.socket.on('conversation_cleared', (data) => {
      this.emit('conversation_cleared', data);
    });

    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
      this.emit('socket_error', data);
    });

    this.socket.on('pong', (data) => {
      this.emit('pong', data);
    });
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnect_attempts_reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);

    setTimeout(() => {
      if (!this.isConnected && this.socket) {
        this.socket.connect();
      }
    }, delay);
  }

  // Event handling
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event).add(handler);
  }

  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).delete(handler);
    }
  }

  emit(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  // Chat methods
  sendMessage(message, generateAudio = false) {
    if (!this.isConnected || !this.socket) {
      console.error('Socket not connected');
      return false;
    }

    this.socket.emit('chat_message', {
      message,
      generateAudio,
      timestamp: new Date().toISOString()
    });
    return true;
  }

  generateAudio(text) {
    if (!this.isConnected || !this.socket) {
      console.error('Socket not connected');
      return false;
    }

    this.socket.emit('generate_audio', {
      text,
      timestamp: new Date().toISOString()
    });
    return true;
  }

  clearConversation() {
    if (!this.isConnected || !this.socket) {
      console.error('Socket not connected');
      return false;
    }

    this.socket.emit('clear_conversation');
    return true;
  }

  ping() {
    if (!this.isConnected || !this.socket) {
      return false;
    }

    this.socket.emit('ping');
    return true;
  }

  // Connection management
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.reconnectAttempts = 0;
    }
  }

  reconnect() {
    this.disconnect();
    return this.connect();
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      socketId: this.socket?.id || null
    };
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;