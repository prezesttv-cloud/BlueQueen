import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { authAPI } from '../services/api';
import { Card, Button, Input, Title, Text, Flex, Spinner } from '../styles/components';
import { icyTheme } from '../styles/theme';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${icyTheme.spacing.lg};
  background: ${icyTheme.gradients.ice};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${icyTheme.spacing.lg};
  background: ${icyTheme.gradients.deepIce};
  border-radius: ${icyTheme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: ${icyTheme.shadows.glow};
  animation: ${props => props.animate ? 'glow 2s ease-in-out infinite alternate' : 'none'};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${icyTheme.spacing.md};
`;

const ErrorMessage = styled(Text)`
  color: #dc2626;
  background: #fee2e2;
  padding: ${icyTheme.spacing.sm};
  border-radius: ${icyTheme.borderRadius.md};
  border: 1px solid #fecaca;
  margin: 0;
`;

const DemoInfo = styled.div`
  background: ${icyTheme.colors.primary[50]};
  border: 1px solid ${icyTheme.colors.primary[200]};
  border-radius: ${icyTheme.borderRadius.md};
  padding: ${icyTheme.spacing.md};
  margin-top: ${icyTheme.spacing.lg};
`;

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      dispatch(loginFailure('Wszystkie pola są wymagane'));
      return;
    }

    dispatch(loginStart());

    try {
      const response = await authAPI.login(formData);
      dispatch(loginSuccess(response.data));
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Błąd logowania';
      dispatch(loginFailure(errorMessage));
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      username: 'demo',
      password: 'password'
    });
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo animate={!loading}>
          ❄️
        </Logo>
        
        <Title gradient center>
          Blue Queen
        </Title>
        
        <Text center muted>
          Twoja inteligentna asystentka AI
        </Text>

        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="username"
            placeholder="Nazwa użytkownika"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            variant="glass"
          />
          
          <Input
            type="password"
            name="password"
            placeholder="Hasło"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            variant="glass"
          />

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            isLoading={loading}
          >
            {loading ? (
              <Flex align="center" gap="sm">
                <Spinner size="20px" />
                Logowanie...
              </Flex>
            ) : (
              'Zaloguj się'
            )}
          </Button>
        </Form>

        <DemoInfo>
          <Text size="sm" center>
            <strong>Demo:</strong> Kliknij poniżej, aby wypełnić dane demo
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Użyj konta demo
          </Button>
        </DemoInfo>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;