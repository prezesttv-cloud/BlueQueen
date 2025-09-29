import React from 'react';
import styled from 'styled-components';
import { Flex, Text, IconButton } from '../styles/components';
import { icyTheme } from '../styles/theme';

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${icyTheme.spacing.sm};
  ${props => props.isUser && `
    flex-direction: row-reverse;
  `}
`;

const MessageBubbleWrapper = styled.div`
  max-width: 70%;
  min-width: 100px;
  padding: ${icyTheme.spacing.sm} ${icyTheme.spacing.md};
  border-radius: ${icyTheme.borderRadius.lg};
  position: relative;
  word-wrap: break-word;
  transition: all 0.2s ease;

  ${props => props.isUser ? `
    background: ${icyTheme.gradients.deepIce};
    color: ${icyTheme.colors.white};
    border-bottom-right-radius: ${icyTheme.borderRadius.sm};
  ` : `
    background: rgba(255, 255, 255, 0.9);
    color: ${icyTheme.colors.ice[800]};
    border: 1px solid ${icyTheme.colors.ice[200]};
    border-bottom-left-radius: ${icyTheme.borderRadius.sm};
    backdrop-filter: blur(10px);
  `}

  &:hover {
    transform: translateY(-1px);
    ${props => props.isUser ? `
      box-shadow: ${icyTheme.shadows.glow};
    ` : `
      box-shadow: ${icyTheme.shadows.frost};
    `}
  }

  @media (max-width: ${icyTheme.breakpoints.sm}) {
    max-width: 85%;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${icyTheme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
  
  ${props => props.isUser ? `
    background: ${icyTheme.gradients.deepIce};
    color: ${icyTheme.colors.white};
    box-shadow: ${icyTheme.shadows.ice};
  ` : `
    background: ${icyTheme.gradients.frost};
    color: ${icyTheme.colors.primary[700]};
    border: 1px solid ${icyTheme.colors.ice[200]};
  `}
`;

const MessageContent = styled.div`
  line-height: 1.5;
  
  p {
    margin: 0 0 ${icyTheme.spacing.sm} 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  code {
    background: rgba(0, 0, 0, 0.1);
    padding: 2px 4px;
    border-radius: 4px;
    font-family: ${icyTheme.typography.fontFamily.mono.join(', ')};
    font-size: 0.9em;
  }

  pre {
    background: rgba(0, 0, 0, 0.1);
    padding: ${icyTheme.spacing.sm};
    border-radius: ${icyTheme.borderRadius.md};
    overflow-x: auto;
    margin: ${icyTheme.spacing.xs} 0;
    
    code {
      background: none;
      padding: 0;
    }
  }

  strong {
    font-weight: ${icyTheme.typography.fontWeight.semibold};
  }

  em {
    font-style: italic;
  }
`;

const MessageActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${icyTheme.spacing.xs};
  margin-top: ${icyTheme.spacing.xs};
  opacity: 0;
  transition: opacity 0.2s ease;

  ${MessageBubbleWrapper}:hover & {
    opacity: 1;
  }
`;

const Timestamp = styled.span`
  font-size: ${icyTheme.typography.fontSize.xs};
  opacity: 0.7;
  margin-top: ${icyTheme.spacing.xs};
  display: block;
`;

const MessageBubble = ({ message, onSpeak, isSpeaking }) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // Less than 1 minute
      return 'przed chwilą';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes} min temu`;
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours} godz. temu`;
    } else {
      return date.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatMessageContent = (content) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => (
        <p key={index}>
          {line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .split(/(<[^>]+>.*?<\/[^>]+>)/)
            .map((part, i) => {
              if (part.startsWith('<') && part.endsWith('>')) {
                return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
              }
              return part;
            })
          }
        </p>
      ));
  };

  const handleSpeak = () => {
    if (onSpeak && message.content) {
      onSpeak(message.content);
    }
  };

  return (
    <MessageContainer isUser={isUser}>
      <Avatar isUser={isUser}>
        {isUser ? '👤' : '❄️'}
      </Avatar>
      
      <div style={{ flex: 1 }}>
        <MessageBubbleWrapper isUser={isUser}>
          <MessageContent>
            {formatMessageContent(message.content)}
          </MessageContent>
          
          {isAssistant && (
            <MessageActions>
              <IconButton
                size="sm"
                variant="ghost"
                onClick={handleSpeak}
                disabled={isSpeaking}
                title="Odczytaj wiadomość"
              >
                {isSpeaking ? '🔊' : '🔉'}
              </IconButton>
            </MessageActions>
          )}
          
          <Timestamp>
            {formatTimestamp(message.timestamp)}
          </Timestamp>
        </MessageBubbleWrapper>
      </div>
    </MessageContainer>
  );
};

export default MessageBubble;