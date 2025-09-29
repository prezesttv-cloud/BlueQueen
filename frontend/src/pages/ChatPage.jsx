import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { addMessage, setTyping, setConnected, clearMessages } from '../store/chatSlice';
import { logout } from '../store/authSlice';
import { setIsListening, setIsSpeaking } from '../store/uiSlice';
import { Card, Button, Input, Flex, Text, IconButton } from '../styles/components';
import { icyTheme } from '../styles/theme';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import websocketService from '../services/websocket';
import ttsService from '../services/tts';
import MessageBubble from '../components/MessageBubble';
import Header from '../components/Header';
import VoiceControls from '../components/VoiceControls';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${icyTheme.gradients.ice};
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${icyTheme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${icyTheme.spacing.md};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${icyTheme.colors.primary[300]};
    border-radius: 3px;
  }
`;

const InputContainer = styled(Card)`
  margin: ${icyTheme.spacing.lg};
  padding: ${icyTheme.spacing.md};
  background: rgba(255, 255, 255, 0.95);
`;

const InputForm = styled.form`
  display: flex;
  gap: ${icyTheme.spacing.sm};
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  min-height: 50px;
  max-height: 120px;
  padding: ${icyTheme.spacing.sm} ${icyTheme.spacing.md};
  border: 1px solid ${icyTheme.colors.ice[300]};
  border-radius: ${icyTheme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.9);
  font-size: ${icyTheme.typography.fontSize.base};
  font-family: ${icyTheme.typography.fontFamily.sans.join(', ')};
  color: ${icyTheme.colors.ice[800]};
  resize: none;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${icyTheme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: ${icyTheme.colors.ice[400]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SendButton = styled(IconButton)`
  align-self: flex-end;
  margin-bottom: 2px;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${icyTheme.spacing.sm};
  padding: ${icyTheme.spacing.sm} ${icyTheme.spacing.md};
  color: ${icyTheme.colors.ice[500]};
  font-style: italic;
  animation: pulse 1.5s ease-in-out infinite;
`;

const WelcomeMessage = styled(Card)`
  text-align: center;
  margin: ${icyTheme.spacing.xl} ${icyTheme.spacing.lg};
  background: rgba(255, 255, 255, 0.8);
`;

const ChatPage = () => {
  const dispatch = useDispatch();
  const { messages, isTyping, isConnected } = useSelector(state => state.chat);
  const { user, token } = useSelector(state => state.auth);
  const { isListening, isSpeaking } = useSelector(state => state.ui);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const {
    transcript,
    isListening: speechListening,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError
  } = useSpeechRecognition();

  useEffect(() => {
    // Initialize WebSocket connection
    if (token) {
      websocketService.connect(token);

      // Set up WebSocket event listeners
      websocketService.on('connected', () => {
        dispatch(setConnected(true));
      });

      websocketService.on('disconnected', () => {
        dispatch(setConnected(false));
      });

      websocketService.on('chat_response', (data) => {
        dispatch(addMessage({
          role: 'assistant',
          content: data.message,
          timestamp: data.timestamp
        }));
        dispatch(setTyping(false));
        setIsLoading(false);

        // Auto-speak if enabled
        if (data.message) {
          handleAutoSpeak(data.message);
        }
      });

      websocketService.on('typing', (message) => {
        dispatch(setTyping(true));
      });

      websocketService.on('auth_success', (userData) => {
        console.log('WebSocket authenticated successfully');
      });

      websocketService.on('error', (error) => {
        console.error('WebSocket error:', error);
        setIsLoading(false);
        dispatch(setTyping(false));
      });
    }

    return () => {
      websocketService.disconnect();
    };
  }, [token, dispatch]);

  useEffect(() => {
    // Update listening state
    dispatch(setIsListening(speechListening));
  }, [speechListening, dispatch]);

  useEffect(() => {
    // Handle speech recognition transcript
    if (transcript) {
      setInputValue(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  useEffect(() => {
    // Auto-scroll to bottom
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message to chat
    dispatch(addMessage({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }));

    // Send via WebSocket
    websocketService.sendMessage(message);
  };

  const handleAutoSpeak = async (text) => {
    try {
      dispatch(setIsSpeaking(true));
      const cleanText = ttsService.cleanTextForTTS(text);
      await ttsService.speak(cleanText);
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      dispatch(setIsSpeaking(false));
    }
  };

  const handleSpeak = async (text) => {
    try {
      dispatch(setIsSpeaking(true));
      const cleanText = ttsService.cleanTextForTTS(text);
      await ttsService.speak(cleanText);
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      dispatch(setIsSpeaking(false));
    }
  };

  const handleClearMessages = () => {
    dispatch(clearMessages());
  };

  const handleLogout = () => {
    websocketService.disconnect();
    dispatch(logout());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <ChatContainer>
      <Header
        user={user}
        isConnected={isConnected}
        onClearMessages={handleClearMessages}
        onLogout={handleLogout}
      />

      <MessagesContainer>
        {messages.length === 0 ? (
          <WelcomeMessage>
            <Text size="lg" center>
              Witaj, {user?.username}! 👋
            </Text>
            <Text center muted>
              Jestem Blue Queen, Twoją inteligentną asystentką AI.
              Możesz ze mną rozmawiać po polsku pisząc wiadomości lub używając mikrofonu.
            </Text>
          </WelcomeMessage>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
            />
          ))
        )}

        {isTyping && (
          <TypingIndicator>
            <span>💭</span>
            Blue Queen pisze...
          </TypingIndicator>
        )}

        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputForm onSubmit={handleSendMessage}>
          <MessageInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Napisz wiadomość do Blue Queen..."
            disabled={isLoading}
            rows={1}
          />
          
          <VoiceControls
            isListening={isListening}
            isSpeaking={isSpeaking}
            onStartListening={startListening}
            onStopListening={stopListening}
            error={speechError}
          />

          <SendButton
            variant="primary"
            disabled={!inputValue.trim() || isLoading}
            type="submit"
          >
            {isLoading ? '⏳' : '🚀'}
          </SendButton>
        </InputForm>

        {!isConnected && (
          <Text size="sm" muted center style={{ marginTop: icyTheme.spacing.sm }}>
            ⚠️ Brak połączenia z serwerem. Próbowanie ponownego połączenia...
          </Text>
        )}
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatPage;