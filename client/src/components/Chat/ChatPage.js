import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ConnectionStatus from './ConnectionStatus';
import AudioPlayer from './AudioPlayer';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import './ChatPage.css';

const ChatPage = () => {
  const { user } = useAuth();
  const { 
    isConnected, 
    connectionError, 
    isTyping, 
    sendMessage, 
    generateAudio, 
    clearConversation,
    reconnect,
    socketService 
  } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const messagesEndRef = useRef(null);

  const addSystemMessage = useCallback((text, type = 'info') => {
    addMessage({
      id: `system_${Date.now()}`,
      text,
      sender: 'system',
      type,
      timestamp: new Date().toISOString()
    });
  }, []);

  useEffect(() => {
    // Add welcome message when connected
    if (isConnected && messages.length === 0) {
      addSystemMessage('Połączono z Blue Queen. Jak mogę Ci pomóc?');
    }
  }, [isConnected, messages.length, addSystemMessage]);

  useEffect(() => {
    // Set up socket event listeners
    const handlers = {
      chat_response: (data) => {
        console.log('Received chat response:', data);
        addMessage({
          id: data.id,
          text: data.message,
          sender: 'assistant',
          timestamp: data.timestamp,
          audioUrl: data.audioUrl
        });

        // Auto-play audio if available
        if (data.audioUrl) {
          setCurrentAudio({
            url: `${window.location.origin}${data.audioUrl}`,
            text: data.message
          });
        }
      },

      system_message: (data) => {
        addMessage({
          id: `system_${Date.now()}`,
          text: data.message,
          sender: 'system',
          type: data.type || 'info',
          timestamp: new Date().toISOString()
        });
      },

      conversation_cleared: (data) => {
        setMessages([]);
        addMessage({
          id: `system_${Date.now()}`,
          text: 'Historia rozmowy została wyczyszczona.',
          sender: 'system',
          type: 'info',
          timestamp: new Date().toISOString()
        });
        toast.success('Historia rozmowy została wyczyszczona');
      },

      audio_generated: (data) => {
        setCurrentAudio({
          url: `${window.location.origin}${data.audioUrl}`,
          text: data.originalText
        });
        toast.success('Audio zostało wygenerowane');
      },

      socket_error: (data) => {
        console.error('Socket error:', data);
        toast.error(data.message || 'Wystąpił błąd połączenia');
      }
    };

    // Register handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      socketService.on(event, handler);
    });

    return () => {
      // Cleanup handlers
      Object.entries(handlers).forEach(([event, handler]) => {
        socketService.off(event, handler);
      });
    };
  }, [socketService]); // Remove addSystemMessage dependency

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      ...message,
      timestamp: message.timestamp || new Date().toISOString()
    }]);
  };

  const handleSendMessage = async (text, options = {}) => {
    if (!text.trim()) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);

    // Send message via socket
    const success = sendMessage(text.trim(), options.generateAudio);
    
    if (!success) {
      toast.error('Nie udało się wysłać wiadomości. Sprawdź połączenie.');
      addSystemMessage('Błąd wysyłania wiadomości. Spróbuj ponownie.', 'error');
    }
  };

  const handleClearConversation = () => {
    const success = clearConversation();
    if (!success) {
      toast.error('Nie udało się wyczyścić historii rozmowy.');
    }
  };

  const handleGenerateAudio = (text) => {
    const success = generateAudio(text);
    if (!success) {
      toast.error('Nie udało się wygenerować audio.');
    } else {
      toast.loading('Generowanie audio...', { id: 'audio-generation' });
    }
  };

  const handleAudioComplete = () => {
    setCurrentAudio(null);
    toast.dismiss('audio-generation');
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <ConnectionStatus 
          isConnected={isConnected}
          connectionError={connectionError}
          onReconnect={reconnect}
        />
        
        <div className="chat-content">
          <MessageList 
            messages={messages}
            isTyping={isTyping}
            onGenerateAudio={handleGenerateAudio}
            currentUser={user}
          />
          <div ref={messagesEndRef} />
        </div>

        <MessageInput 
          onSendMessage={handleSendMessage}
          onClearConversation={handleClearConversation}
          disabled={!isConnected}
          isTyping={isTyping}
        />
      </div>

      {currentAudio && (
        <AudioPlayer
          audioUrl={currentAudio.url}
          text={currentAudio.text}
          onComplete={handleAudioComplete}
          onClose={() => setCurrentAudio(null)}
        />
      )}
    </div>
  );
};

export default ChatPage;