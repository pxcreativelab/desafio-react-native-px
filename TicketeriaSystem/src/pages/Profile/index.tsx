import { dropTables } from '@/database/database';
import { useAuthStore } from '@/stores/useAuthStore';
import { SyncStatusBadge } from '@components/_fragments/SyncStatusBadge';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, ScrollView, Switch } from 'react-native';
import {
  Container,
  Content,
  Divider,
  Header,
  HeaderButton,
  HeaderButtonText,
  HeaderTitle,
  InfoLabel,
  InfoRow,
  InfoValue,
  LogoutButton,
  LogoutButtonText,
  Section,
  SectionTitle,
  SettingLabel,
  SettingRow,
} from './styles';

const Profile: React.FC = () => {
  const { goBack } = useNavigation();
  const { user, logout, biometricEnabled, disableBiometric } = useAuthStore();

  const handleBiometricToggle = async (value: boolean) => {
    try {
      if (value) {
        // User needs to provide credentials to enable biometric
        Alert.alert(
          'Habilitar Biometria',
          'Para habilitar o login biométrico, você precisa confirmar suas credenciais.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Configurar',
              onPress: () => {
                // In a real app, you'd show a modal to collect credentials
                Alert.alert('Info', 'Funcionalidade disponível no login');
              },
            },
          ]
        );
      } else {
        await disableBiometric();
      }
    } catch (error) {
      console.error('Error toggling biometric:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja fazer logout?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } finally {
            try {
              dropTables();
            } catch {
              // ignore
            }
          }
        },
      },
    ]);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    if (email) return email.charAt(0).toUpperCase();
    return '?';
  };

  const initials = getInitials(user?.name, user?.email);

  return (
    <Container>
      <Header>
        <HeaderButton onPress={goBack}>
          <HeaderButtonText>Voltar</HeaderButtonText>
        </HeaderButton>
        <HeaderTitle>Perfil</HeaderTitle>
        <HeaderButton style={{ opacity: 0 }} disabled pointerEvents="none">
          <HeaderButtonText> </HeaderButtonText>
        </HeaderButton>
      </Header>

      <ScrollView>
        <Content>
          <Section>
            <SectionTitle>Informações do Usuário</SectionTitle>
            <InfoRow>
              <InfoLabel>Nome</InfoLabel>
              <InfoValue>{user?.name || 'Não informado'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{user?.email || 'Não informado'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Iniciais</InfoLabel>
              <InfoValue>{initials}</InfoValue>
            </InfoRow>
          </Section>

          <Divider />

          <Section>
            <SectionTitle>Sincronização</SectionTitle>
            <InfoRow>
              <SyncStatusBadge />
            </InfoRow>
          </Section>

          <Divider />

          <Section>
            <SectionTitle>Configurações</SectionTitle>
            <SettingRow>
              <SettingLabel>Login Biométrico</SettingLabel>
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: '#ccc', true: '#007aff' }}
              />
            </SettingRow>
          </Section>

          <Divider />

          <Section>
            <LogoutButton onPress={handleLogout}>
              <LogoutButtonText>Sair da Conta</LogoutButtonText>
            </LogoutButton>
          </Section>
        </Content>
      </ScrollView>
    </Container>
  );
};

export default Profile;
