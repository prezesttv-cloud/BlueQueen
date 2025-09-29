import React from 'react';
import styled from 'styled-components';
import { FloatingElement, Title, Text, Spinner } from '../styles/components';
import { icyTheme } from '../styles/theme';

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${icyTheme.gradients.ice};
  padding: ${icyTheme.spacing.xl};
`;

const Logo = styled(FloatingElement)`
  width: 120px;
  height: 120px;
  margin-bottom: ${icyTheme.spacing.xl};
  background: ${icyTheme.gradients.deepIce};
  border-radius: ${icyTheme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  box-shadow: ${icyTheme.shadows.glow};
`;

const LoadingContent = styled.div`
  text-align: center;
  max-width: 400px;
`;

const LoadingScreen = ({ message = 'Ładowanie...' }) => {
  return (
    <LoadingContainer>
      <Logo delay={0}>
        ❄️
      </Logo>
      
      <LoadingContent>
        <Title gradient center>
          Blue Queen
        </Title>
        
        <Text center muted>
          Twoja inteligentna asystentka AI
        </Text>
        
        <div style={{ margin: `${icyTheme.spacing.xl} 0` }}>
          <Spinner size="32px" />
        </div>
        
        <Text center size="sm" muted>
          {message}
        </Text>
      </LoadingContent>
    </LoadingContainer>
  );
};

export default LoadingScreen;