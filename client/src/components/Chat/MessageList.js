import React from 'react';
import { Crown, User, Bot, Info, AlertCircle, CheckCircle } from 'lucide-react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import './MessageList.css';

const MessageList = ({ messages, isTyping, onGenerateAudio, currentUser }) => {
  const getMessageIcon = (sender, type) => {
    switch (sender) {
      case 'user':
        return <User size={16} />;
      case 'assistant':
        return <Crown size={16} className="assistant-icon" />;
      case 'system':
        switch (type) {
          case 'error':
            return <AlertCircle size={16} className="error-icon" />;
          case 'success':
            return <CheckCircle size={16} className="success-icon" />;
          default:
            return <Info size={16} className="info-icon" />;
        }
      default:
        return <Bot size={16} />;
    }
  };

  const getMessageSender = (sender, type) => {
    switch (sender) {
      case 'user':
        return currentUser?.username || 'Ty';
      case 'assistant':
        return 'Blue Queen';
      case 'system':
        return 'System';
      default:
        return 'Nieznany';
    }
  };

  if (messages.length === 0 && !isTyping) {
    return (
      <div className="message-list empty">
        <div className="empty-state">
          <Crown size={64} className="empty-icon" />
          <h3>Witaj w Blue Queen</h3>
          <p>
            Jestem Twoim asystentem AI. Możesz zadać mi pytanie lub poprosić o pomoc.
            Rozmawiam w języku polskim i mogę generować odpowiedzi audio.
          </p>
          <div className="example-messages">
            <p className="example-title">Przykładowe pytania:</p>
            <ul>
              <li>"Opowiedz mi o pogodzie"</li>
              <li>"Pomóż mi napisać email"</li>
              <li>"Co potrafisz robić?"</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      <div className="messages-container">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            icon={getMessageIcon(message.sender, message.type)}
            senderName={getMessageSender(message.sender, message.type)}
            onGenerateAudio={onGenerateAudio}
            currentUser={currentUser}
          />
        ))}
        
        {isTyping && (
          <div className="typing-container">
            <div className="message-header">
              <div className="message-avatar assistant">
                <Crown size={16} className="assistant-icon" />
              </div>
              <div className="message-sender">
                <span className="sender-name">Blue Queen</span>
                <span className="message-time">pisze...</span>
              </div>
            </div>
            <div className="message-content">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;