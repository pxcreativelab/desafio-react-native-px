import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard } from 'react-native';

import {
  Container,
  Content,
  ErrorText,
  FormContainer,
  Header,
  Input,
  InputGroup,
  Label,
  LoginButton,
  LoginButtonText,
  LoginContainer,
  LoginText,
  PasswordRequirements,
  RegisterButton,
  RegisterButtonText,
  RequirementText,
  ScrollContainer,
  Subtitle,
  Title
} from './styles';

const Register: React.FC = () => {
  const navigation = useNavigation();
  const { register } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  const passwordRequirements = {
    length: formData.password.length >= 6,
    match: formData.password === formData.confirmPassword && formData.password.length > 0,
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter no mínimo 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData);
      // Navegar de volta para login
      navigation.goBack();
    } catch {
      // Erro já tratado pelo toast no contexto
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.goBack();
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <Container>
      <ScrollContainer>
        <Content>
          <Header>
            <Title>Criar Conta</Title>
            <Subtitle>Preencha seus dados para começar</Subtitle>
          </Header>

          <FormContainer>
            <InputGroup>
              <Label>Nome completo</Label>
              <Input
                placeholder="João Silva"
                value={formData.name}
                onChangeText={(text) => updateField('name', text)}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!loading}
              />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
            </InputGroup>

            <InputGroup>
              <Label>E-mail</Label>
              <Input
                placeholder="seu@email.com"
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
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
                value={formData.password}
                onChangeText={(text) => updateField('password', text)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
            </InputGroup>

            <InputGroup>
              <Label>Confirmar senha</Label>
              <Input
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChangeText={(text) => updateField('confirmPassword', text)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
            </InputGroup>

            {(formData.password.length > 0 || formData.confirmPassword.length > 0) && (
              <PasswordRequirements>
                <RequirementText met={passwordRequirements.length}>
                  {passwordRequirements.length ? '✓' : '○'} Mínimo 6 caracteres
                </RequirementText>
                <RequirementText met={passwordRequirements.match}>
                  {passwordRequirements.match ? '✓' : '○'} As senhas coincidem
                </RequirementText>
              </PasswordRequirements>
            )}

            <RegisterButton onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <RegisterButtonText>Criar Conta</RegisterButtonText>
              )}
            </RegisterButton>
          </FormContainer>

          <LoginContainer>
            <LoginText>Já tem uma conta?</LoginText>
            <LoginButton onPress={handleLogin} disabled={loading}>
              <LoginButtonText>Fazer login</LoginButtonText>
            </LoginButton>
          </LoginContainer>
        </Content>
      </ScrollContainer>
    </Container>
  );
};

export default Register;
