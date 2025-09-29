import React, { useState } from 'react';
import { Volume2, Copy, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import './Message.css';

const Message = ({ message, icon, senderName, onGenerateAudio, currentUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState(null);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // If less than 1 minute ago
    if (diff < 60000) {
      return 'Przed chwilą';
    }
    
    // If today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('pl-PL', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    // Otherwise show date
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (error) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus(null), 2000);
    }
    setIsMenuOpen(false);
  };

  const handleGenerateAudio = () => {
    onGenerateAudio(message.text);
    setIsMenuOpen(false);
  };

  const getMessageClass = () => {
    const baseClass = 'message';
    const senderClass = `message-${message.sender}`;
    const typeClass = message.type ? `message-${message.type}` : '';
    
    return [baseClass, senderClass, typeClass].filter(Boolean).join(' ');
  };

  return (
    <div className={getMessageClass()}>
      <div className="message-header">
        <div className={`message-avatar ${message.sender}`}>
          {icon}
        </div>
        <div className="message-sender">
          <span className="sender-name">{senderName}</span>
          <span className="message-time">{formatTimestamp(message.timestamp)}</span>
        </div>
        
        {(message.sender === 'assistant' || message.sender === 'user') && (
          <div className="message-actions">
            <button
              className="action-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Więcej opcji"
            >
              <MoreVertical size={16} />
            </button>
            
            {isMenuOpen && (
              <div className="message-menu">
                <button
                  className="menu-item"
                  onClick={handleCopyMessage}
                  disabled={copyStatus === 'success'}
                >
                  {copyStatus === 'success' ? (
                    <>
                      <CheckCircle size={14} />
                      Skopiowano
                    </>
                  ) : copyStatus === 'error' ? (
                    <>
                      <XCircle size={14} />
                      Błąd
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Kopiuj
                    </>
                  )}
                </button>
                
                {message.text.length <= 500 && (
                  <button
                    className="menu-item"
                    onClick={handleGenerateAudio}
                  >
                    <Volume2 size={14} />
                    Generuj audio
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="message-content">
        <div className="message-text">
          {message.text}
        </div>
        
        {message.audioUrl && (
          <div className="message-audio-indicator">
            <Volume2 size={14} />
            <span>Audio dostępne</span>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div 
          className="menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Message;