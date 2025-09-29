import styled, { css, keyframes } from 'styled-components';
import { icyTheme } from './theme';

// Animations
export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

export const glow = keyframes`
  0% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  100% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
`;

export const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Container Components
export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${icyTheme.spacing.md};

  @media (max-width: ${icyTheme.breakpoints.sm}) {
    padding: 0 ${icyTheme.spacing.sm};
  }
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${icyTheme.borderRadius.lg};
  padding: ${icyTheme.spacing.lg};
  box-shadow: ${icyTheme.shadows.frost};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${icyTheme.shadows.crystal};
    transform: translateY(-2px);
  }

  ${props => props.variant === 'glass' && css`
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
  `}

  ${props => props.variant === 'solid' && css`
    background: ${icyTheme.colors.white};
    backdrop-filter: none;
    border: 1px solid ${icyTheme.colors.ice[200]};
  `}
`;

export const GlassCard = styled(Card)`
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

export const FrostCard = styled(Card)`
  background: ${icyTheme.gradients.frost};
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

// Button Components
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${icyTheme.spacing.sm};
  padding: ${icyTheme.spacing.sm} ${icyTheme.spacing.lg};
  border-radius: ${icyTheme.borderRadius.md};
  font-size: ${icyTheme.typography.fontSize.base};
  font-weight: ${icyTheme.typography.fontWeight.medium};
  font-family: ${icyTheme.typography.fontFamily.sans.join(', ')};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  position: relative;
  overflow: hidden;

  &:focus {
    outline: 2px solid ${icyTheme.colors.primary[500]};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => props.variant === 'primary' && css`
    background: ${icyTheme.gradients.deepIce};
    color: ${icyTheme.colors.white};
    box-shadow: ${icyTheme.shadows.ice};

    &:hover:not(:disabled) {
      box-shadow: ${icyTheme.shadows.glow};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${props => props.variant === 'secondary' && css`
    background: rgba(255, 255, 255, 0.9);
    color: ${icyTheme.colors.primary[700]};
    border: 1px solid ${icyTheme.colors.primary[200]};

    &:hover:not(:disabled) {
      background: ${icyTheme.colors.primary[50]};
      border-color: ${icyTheme.colors.primary[300]};
    }
  `}

  ${props => props.variant === 'ghost' && css`
    background: transparent;
    color: ${icyTheme.colors.primary[600]};

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }
  `}

  ${props => props.variant === 'glass' && css`
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: ${icyTheme.colors.ice[800]};

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.35);
    }
  `}

  ${props => props.size === 'sm' && css`
    padding: ${icyTheme.spacing.xs} ${icyTheme.spacing.sm};
    font-size: ${icyTheme.typography.fontSize.sm};
  `}

  ${props => props.size === 'lg' && css`
    padding: ${icyTheme.spacing.lg} ${icyTheme.spacing.xl};
    font-size: ${icyTheme.typography.fontSize.lg};
  `}

  ${props => props.fullWidth && css`
    width: 100%;
  `}

  ${props => props.isLoading && css`
    opacity: 0.7;
    pointer-events: none;
  `}
`;

export const IconButton = styled(Button)`
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: ${icyTheme.borderRadius.full};

  ${props => props.size === 'sm' && css`
    width: 36px;
    height: 36px;
  `}

  ${props => props.size === 'lg' && css`
    width: 56px;
    height: 56px;
  `}
`;

// Input Components
export const Input = styled.input`
  width: 100%;
  padding: ${icyTheme.spacing.sm} ${icyTheme.spacing.md};
  border: 1px solid ${icyTheme.colors.ice[300]};
  border-radius: ${icyTheme.borderRadius.md};
  background: rgba(255, 255, 255, 0.9);
  font-size: ${icyTheme.typography.fontSize.base};
  font-family: ${icyTheme.typography.fontFamily.sans.join(', ')};
  color: ${icyTheme.colors.ice[800]};
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

  ${props => props.variant === 'glass' && css`
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
  `}
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${icyTheme.spacing.sm} ${icyTheme.spacing.md};
  border: 1px solid ${icyTheme.colors.ice[300]};
  border-radius: ${icyTheme.borderRadius.md};
  background: rgba(255, 255, 255, 0.9);
  font-size: ${icyTheme.typography.fontSize.base};
  font-family: ${icyTheme.typography.fontFamily.sans.join(', ')};
  color: ${icyTheme.colors.ice[800]};
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 100px;

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

  ${props => props.variant === 'glass' && css`
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
  `}
`;

// Typography Components
export const Title = styled.h1`
  font-size: ${icyTheme.typography.fontSize['3xl']};
  font-weight: ${icyTheme.typography.fontWeight.bold};
  color: ${icyTheme.colors.ice[800]};
  margin: 0 0 ${icyTheme.spacing.lg} 0;
  line-height: 1.2;

  ${props => props.gradient && css`
    background: ${icyTheme.gradients.deepIce};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}

  ${props => props.center && css`
    text-align: center;
  `}

  @media (max-width: ${icyTheme.breakpoints.sm}) {
    font-size: ${icyTheme.typography.fontSize['2xl']};
  }
`;

export const Subtitle = styled.h2`
  font-size: ${icyTheme.typography.fontSize.xl};
  font-weight: ${icyTheme.typography.fontWeight.semibold};
  color: ${icyTheme.colors.ice[700]};
  margin: 0 0 ${icyTheme.spacing.md} 0;
  line-height: 1.3;

  ${props => props.center && css`
    text-align: center;
  `}
`;

export const Text = styled.p`
  font-size: ${icyTheme.typography.fontSize.base};
  color: ${icyTheme.colors.ice[600]};
  margin: 0 0 ${icyTheme.spacing.md} 0;
  line-height: 1.6;

  ${props => props.muted && css`
    color: ${icyTheme.colors.ice[500]};
  `}

  ${props => props.center && css`
    text-align: center;
  `}

  ${props => props.size === 'sm' && css`
    font-size: ${icyTheme.typography.fontSize.sm};
  `}

  ${props => props.size === 'lg' && css`
    font-size: ${icyTheme.typography.fontSize.lg};
  `}
`;

// Layout Components
export const Flex = styled.div`
  display: flex;
  
  ${props => props.direction && css`
    flex-direction: ${props.direction};
  `}
  
  ${props => props.align && css`
    align-items: ${props.align};
  `}
  
  ${props => props.justify && css`
    justify-content: ${props.justify};
  `}
  
  ${props => props.gap && css`
    gap: ${icyTheme.spacing[props.gap] || props.gap};
  `}
  
  ${props => props.wrap && css`
    flex-wrap: wrap;
  `}
`;

export const Grid = styled.div`
  display: grid;
  
  ${props => props.cols && css`
    grid-template-columns: repeat(${props.cols}, 1fr);
  `}
  
  ${props => props.gap && css`
    gap: ${icyTheme.spacing[props.gap] || props.gap};
  `}
  
  @media (max-width: ${icyTheme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Animation Components
export const FloatingElement = styled.div`
  animation: ${float} 3s ease-in-out infinite;
  
  ${props => props.delay && css`
    animation-delay: ${props.delay}s;
  `}
`;

export const GlowingElement = styled.div`
  animation: ${glow} 2s ease-in-out infinite alternate;
`;

export const PulsingElement = styled.div`
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

// Utility Components
export const Spinner = styled.div`
  width: ${props => props.size || '24px'};
  height: ${props => props.size || '24px'};
  border: 2px solid ${icyTheme.colors.ice[200]};
  border-top: 2px solid ${icyTheme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${icyTheme.colors.ice[200]}, transparent);
  margin: ${icyTheme.spacing.lg} 0;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${icyTheme.spacing.xs} ${icyTheme.spacing.sm};
  border-radius: ${icyTheme.borderRadius.full};
  font-size: ${icyTheme.typography.fontSize.xs};
  font-weight: ${icyTheme.typography.fontWeight.medium};
  
  ${props => props.variant === 'primary' && css`
    background: ${icyTheme.colors.primary[100]};
    color: ${icyTheme.colors.primary[800]};
  `}
  
  ${props => props.variant === 'success' && css`
    background: #dcfce7;
    color: #166534;
  `}
  
  ${props => props.variant === 'error' && css`
    background: #fef2f2;
    color: #991b1b;
  `}
  
  ${props => props.variant === 'warning' && css`
    background: #fefce8;
    color: #a16207;
  `}
`;

export default {
  Container,
  Card,
  GlassCard,
  FrostCard,
  Button,
  IconButton,
  Input,
  TextArea,
  Title,
  Subtitle,
  Text,
  Flex,
  Grid,
  FloatingElement,
  GlowingElement,
  PulsingElement,
  Spinner,
  Divider,
  Badge,
};