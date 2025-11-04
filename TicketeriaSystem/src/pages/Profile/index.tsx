import { dropTables } from '@/database/database';
import { useAuthStore } from '@/stores/useAuthStore';
import { SyncStatusBadge } from '@components/_fragments/SyncStatusBadge';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, ScrollView, Switch } from 'react-native';
import {
  BackButton,
  BackButtonText,
  ButtonRow,
  Container,
  Content,
  Divider,
  InfoLabel,
  InfoRow,
  InfoValue,
  LogoutButton,
  LogoutButtonText,
  Section,
  SectionTitle,
  SettingLabel,
  SettingRow
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
    console.log('Initiating logout process');
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



  return (
    <Container>
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
              <InfoLabel>ID</InfoLabel>
              <InfoValue>{user?.id || 'Não informado'}</InfoValue>
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
            <ButtonRow>
              <BackButton onPress={() => goBack()}>
                <BackButtonText>Voltar</BackButtonText>
              </BackButton>
              <LogoutButton onPress={handleLogout}>
                <LogoutButtonText>Sair da Conta</LogoutButtonText>
              </LogoutButton>
            </ButtonRow>
          </Section>
        </Content>
      </ScrollView>
    </Container>
  );
};

export default Profile;
