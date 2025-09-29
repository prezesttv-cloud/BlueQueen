import { useState, useEffect } from 'react';
import socketService from '../services/socketService';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Connect to socket when hook is used
    const connected = socketService.connect();
    
    if (!connected) {
      setConnectionError('Failed to initialize socket connection');
      return;
    }

    // Set up event handlers
    const handlers = {
      connection_status: ({ connected, reason }) => {
        setIsConnected(connected);
        if (!connected && reason) {
          setConnectionError(`Connection lost: ${reason}`);
        } else if (connected) {
          setConnectionError(null);
        }
      },
      
      connection_error: ({ error }) => {
        setConnectionError(error);
      },
      
      ai_typing: ({ isTyping: typing }) => {
        setIsTyping(typing);
      },

      max_reconnect_attempts_reached: () => {
        setConnectionError('Unable to connect to server. Please refresh the page.');
      }
    };

    // Register handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      socketService.on(event, handler);
    });

    // Store current handlers for cleanup
    const currentHandlers = { ...handlers };

    return () => {
      // Cleanup handlers using stored reference
      Object.entries(currentHandlers).forEach(([event, handler]) => {
        socketService.off(event, handler);
      });
      
      // Disconnect socket
      socketService.disconnect();
    };
  }, []); // Empty dependency array is correct here

  const sendMessage = (message, generateAudio = false) => {
    return socketService.sendMessage(message, generateAudio);
  };

  const generateAudio = (text) => {
    return socketService.generateAudio(text);
  };

  const clearConversation = () => {
    return socketService.clearConversation();
  };

  const reconnect = () => {
    setConnectionError(null);
    return socketService.reconnect();
  };

  return {
    isConnected,
    connectionError,
    isTyping,
    sendMessage,
    generateAudio,
    clearConversation,
    reconnect,
    socketService
  };
};