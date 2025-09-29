import React from 'react';
import styled from 'styled-components';
import { Flex, IconButton, Text } from '../styles/components';
import { icyTheme } from '../styles/theme';

const VoiceControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${icyTheme.spacing.xs};
`;

const MicButton = styled(IconButton)`
  position: relative;
  overflow: hidden;

  ${props => props.isListening && `
    background: #ef4444;
    color: white;
    animation: pulse 1.5s ease-in-out infinite;
    
    &:hover {
      background: #dc2626;
    }
  `}

  ${props => props.isSpeaking && `
    background: ${icyTheme.colors.primary[500]};
    color: white;
    animation: glow 1s ease-in-out infinite alternate;
  `}
`;

const SpeakerButton = styled(IconButton)`
  ${props => props.isSpeaking && `
    background: ${icyTheme.colors.primary[500]};
    color: white;
    animation: glow 1s ease-in-out infinite alternate;
  `}
`;

const ErrorTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fee2e2;
  color: #991b1b;
  padding: ${icyTheme.spacing.xs} ${icyTheme.spacing.sm};
  border-radius: ${icyTheme.borderRadius.md};
  font-size: ${icyTheme.typography.fontSize.xs};
  white-space: nowrap;
  margin-bottom: ${icyTheme.spacing.xs};
  border: 1px solid #fecaca;
  max-width: 200px;
  word-wrap: break-word;
  white-space: normal;
  z-index: 1000;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #fecaca;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${icyTheme.spacing.xs};
  font-size: ${icyTheme.typography.fontSize.xs};
  color: ${icyTheme.colors.ice[500]};
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
`;

const VoiceControls = ({
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  error
}) => {
  const handleMicClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  const getMicIcon = () => {
    if (isListening) return '🎤';
    return '🎙️';
  };

  const getMicTitle = () => {
    if (isListening) return 'Zatrzymaj nagrywanie (kliknij lub naciśnij ponownie)';
    return 'Rozpocznij nagrywanie głosu';
  };

  const getSpeakerIcon = () => {
    if (isSpeaking) return '🔊';
    return '🔇';
  };

  const getSpeakerTitle = () => {
    if (isSpeaking) return 'Blue Queen obecnie mówi';
    return 'Dźwięk wyłączony';
  };

  return (
    <VoiceControlsContainer>
      <div style={{ position: 'relative' }}>
        <MicButton
          variant="glass"
          onClick={handleMicClick}
          isListening={isListening}
          isSpeaking={isSpeaking}
          title={getMicTitle()}
          disabled={isSpeaking}
        >
          {getMicIcon()}
        </MicButton>

        {error && (
          <ErrorTooltip>
            {error}
          </ErrorTooltip>
        )}

        {(isListening || isSpeaking) && (
          <StatusIndicator>
            {isListening && '🎤 Słucham...'}
            {isSpeaking && '🔊 Mówię...'}
          </StatusIndicator>
        )}
      </div>

      <SpeakerButton
        variant="ghost"
        size="sm"
        isSpeaking={isSpeaking}
        title={getSpeakerTitle()}
        disabled
      >
        {getSpeakerIcon()}
      </SpeakerButton>
    </VoiceControlsContainer>
  );
};

export default VoiceControls;