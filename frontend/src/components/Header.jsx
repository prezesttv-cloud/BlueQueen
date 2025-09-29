import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex, Text, Button, IconButton } from '../styles/components';
import { icyTheme } from '../styles/theme';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${icyTheme.colors.ice[200]};
  padding: ${icyTheme.spacing.md} ${icyTheme.spacing.lg};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${icyTheme.shadows.ice};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${icyTheme.spacing.sm};
  font-size: ${icyTheme.typography.fontSize.lg};
  font-weight: ${icyTheme.typography.fontWeight.bold};
  color: ${icyTheme.colors.primary[700]};
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${icyTheme.gradients.deepIce};
  border-radius: ${icyTheme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${icyTheme.spacing.sm};
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: ${icyTheme.colors.primary[100]};
  border: 1px solid ${icyTheme.colors.primary[300]};
  border-radius: ${icyTheme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${icyTheme.spacing.xs};
  font-size: ${icyTheme.typography.fontSize.sm};
  
  ${props => props.connected ? `
    color: #059669;
  ` : `
    color: #dc2626;
  `}
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  ${props => props.connected ? `
    background: #10b981;
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
  ` : `
    background: #ef4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
  `}
  animation: ${props => props.connected ? 'none' : 'pulse 2s infinite'};
`;

const MenuButton = styled(IconButton)`
  @media (min-width: ${icyTheme.breakpoints.md}) {
    display: none;
  }
`;

const DesktopActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${icyTheme.spacing.sm};

  @media (max-width: ${icyTheme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  position: absolute;
  top: 100%;
  right: ${icyTheme.spacing.lg};
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid ${icyTheme.colors.ice[200]};
  border-radius: ${icyTheme.borderRadius.lg};
  padding: ${icyTheme.spacing.md};
  box-shadow: ${icyTheme.shadows.frost};
  display: flex;
  flex-direction: column;
  gap: ${icyTheme.spacing.sm};
  min-width: 200px;
  z-index: 1000;

  @media (min-width: ${icyTheme.breakpoints.md}) {
    display: none;
  }
`;

const Header = ({ user, isConnected, onClearMessages, onLogout }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleClearMessages = () => {
    if (window.confirm('Czy na pewno chcesz wyczyścić historię rozmów?')) {
      onClearMessages();
    }
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    if (window.confirm('Czy na pewno chcesz się wylogować?')) {
      onLogout();
    }
    setShowMobileMenu(false);
  };

  return (
    <HeaderContainer>
      <Flex justify="space-between" align="center">
        <Logo>
          <LogoIcon>❄️</LogoIcon>
          Blue Queen
        </Logo>

        <Flex align="center" gap="lg">
          <ConnectionStatus connected={isConnected}>
            <StatusDot connected={isConnected} />
            {isConnected ? 'Połączono' : 'Rozłączono'}
          </ConnectionStatus>

          <UserInfo>
            <UserAvatar>
              {user?.username?.charAt(0).toUpperCase() || '?'}
            </UserAvatar>
            <Text size="sm" style={{ display: 'none' }}>
              {user?.username}
            </Text>
          </UserInfo>

          <DesktopActions>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearMessages}
              title="Wyczyść historię"
            >
              🗑️ Wyczyść
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Wyloguj się"
            >
              🚪 Wyloguj
            </Button>
          </DesktopActions>

          <MenuButton
            variant="ghost"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            title="Menu"
          >
            ☰
          </MenuButton>
        </Flex>
      </Flex>

      {showMobileMenu && (
        <MobileMenu>
          <Text size="sm" muted>
            Zalogowany jako: <strong>{user?.username}</strong>
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearMessages}
            fullWidth
          >
            🗑️ Wyczyść historię
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            fullWidth
          >
            🚪 Wyloguj się
          </Button>
        </MobileMenu>
      )}
    </HeaderContainer>
  );
};

export default Header;