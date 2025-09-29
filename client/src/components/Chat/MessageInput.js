import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, Trash2, Loader } from 'lucide-react';
import './MessageInput.css';

const MessageInput = ({ 
  onSendMessage, 
  onClearConversation, 
  disabled, 
  isTyping 
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [generateAudio, setGenerateAudio] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pl-PL';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (!message.trim() || disabled || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(message, { generateAudio });
      setMessage('');
      setGenerateAudio(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartRecording = () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not supported');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleClearConversation = () => {
    if (window.confirm('Czy na pewno chcesz wyczyścić historię rozmowy?')) {
      onClearConversation();
    }
  };

  const isMicAvailable = !!recognitionRef.current;

  return (
    <div className="message-input-container">
      <div className="input-options">
        <label className="audio-option">
          <input
            type="checkbox"
            checked={generateAudio}
            onChange={(e) => setGenerateAudio(e.target.checked)}
            disabled={disabled}
          />
          <Volume2 size={14} />
          <span>Generuj audio</span>
        </label>

        <button
          className="btn btn-ghost clear-btn"
          onClick={handleClearConversation}
          disabled={disabled}
          title="Wyczyść historię rozmowy"
        >
          <Trash2 size={14} />
          <span className="clear-text">Wyczyść</span>
        </button>
      </div>

      <div className="message-input">
        <div className="input-area">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Łączenie..." : "Napisz wiadomość do Blue Queen..."}
            disabled={disabled || isSending}
            className="message-textarea"
            rows={1}
            maxLength={2000}
          />
          
          {isMicAvailable && (
            <button
              className={`mic-btn ${isRecording ? 'recording' : ''} ${isListening ? 'listening' : ''}`}
              onClick={handleStartRecording}
              disabled={disabled || isSending}
              title={isRecording ? "Zatrzymaj nagrywanie" : "Nagrywaj głos"}
            >
              {isListening ? (
                <div className="mic-animation">
                  <Mic size={18} />
                  <div className="mic-pulse"></div>
                </div>
              ) : isRecording ? (
                <MicOff size={18} />
              ) : (
                <Mic size={18} />
              )}
            </button>
          )}
        </div>

        <button
          className="send-btn"
          onClick={handleSendMessage}
          disabled={!message.trim() || disabled || isSending || isTyping}
          title="Wyślij wiadomość (Enter)"
        >
          {isSending ? (
            <Loader size={18} className="spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>

      <div className="input-footer">
        <span className="char-count">
          {message.length}/2000
        </span>
        
        {isListening && (
          <span className="listening-indicator">
            🎤 Słucham...
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageInput;