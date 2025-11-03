import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import * as BiometricService from '@services/BiometricService';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard } from 'react-native';

import {
  BiometricButton,
  BiometricButtonText,
  BiometricIcon,
  Container,
  Content,
  Divider,
  DividerLine,
  DividerText,
  ErrorText,
  FormContainer,
  Input,
  InputGroup,
  Label,
  LoadingContainer,
  LoginButton,
  LoginButtonText,
  Logo,
  LogoSubtitle,
  LogoText,
  RegisterButton,
  RegisterButtonText,
  RegisterContainer,
  RegisterText,
  ScrollContainer
} from './styles';

const Login: React.FC = () => {
  const navigation = useNavigation();
  const { login, loginWithBiometric, isLoading, biometricEnabled } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const { available } = await BiometricService.isBiometricAvailable();
    setBiometricAvailable(available);
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login({ email: email.trim(), password }, true);
      // Navegação será feita automaticamente pelo AuthContext
    } catch {
      // Erro já tratado pelo toast no contexto
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setLoading(true);
    try {
      await loginWithBiometric();
    } catch {
      // Erro já tratado pelo toast no contexto
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };



  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#007AFF" />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollContainer>
        <Content>
          <Logo>
            <LogoText>🎫 Ticketeria</LogoText>
            <LogoSubtitle>Sistema de Gestão de Tickets</LogoSubtitle>
          </Logo>

          <FormContainer>
            <InputGroup>
              <Label>E-mail</Label>
              <Input
                placeholder="seu@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </InputGroup>

            <InputGroup>
              <Label>Senha</Label>
              <Input
                placeholder="••••••••"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
            </InputGroup>


            <LoginButton onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <LoginButtonText>Entrar</LoginButtonText>
              )}
            </LoginButton>

            {biometricAvailable && biometricEnabled && (
              <>
                <Divider>
                  <DividerLine />
                  <DividerText>ou</DividerText>
                  <DividerLine />
                </Divider>

                <BiometricButton onPress={handleBiometricLogin} disabled={loading}>
                  <BiometricIcon>👆</BiometricIcon>
                  <BiometricButtonText>Entrar com Biometria</BiometricButtonText>
                </BiometricButton>
              </>
            )}
          </FormContainer>

          <RegisterContainer>
            <RegisterText>Não tem uma conta?</RegisterText>
            <RegisterButton onPress={handleRegister} disabled={loading}>
              <RegisterButtonText>Criar conta</RegisterButtonText>
            </RegisterButton>
          </RegisterContainer>
        </Content>
      </ScrollContainer>
    </Container>
  );
};

export default Login;
