import ConfirmModal from '@/components/ConfirmModal';
import { useAuthStore } from '@/stores/useAuthStore';
import { SyncStatusBadge } from '@components/_fragments/SyncStatusBadge';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, Switch } from 'react-native';
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

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState<string | undefined>(undefined);
  const [confirmMessage, setConfirmMessage] = useState<string | undefined>(undefined);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void> | (() => void) | null>();

  const handleBiometricToggle = async (value: boolean) => {
    try {
      if (value) {
        // Show modal to instruct user to confirm credentials before enabling biometric
        setConfirmTitle('Habilitar Biometria');
        setConfirmMessage('Para habilitar o login biométrico, você precisa confirmar suas credenciais.');
        setConfirmAction(() => async () => {
          // In a real app you'd start a credential flow. For now show info in console and close modal.
          console.info('User confirmed biometric setup flow (placeholder)');
          setConfirmVisible(false);
        });
        setConfirmVisible(true);
      } else {
        await disableBiometric();
      }
    } catch (error) {
      console.error('Error toggling biometric:', error);
    }
  };

  const handleLogout = () => {
    console.log('Initiating logout process');
    setConfirmTitle('Sair');
    setConfirmMessage('Deseja fazer logout?');
    setConfirmAction(() => async () => {
      await logout();
      setConfirmVisible(false);
    });
    setConfirmVisible(true);
  };

  const handleClearData = () => {
    setConfirmTitle('Limpar Dados');
    setConfirmMessage('Não há mais dados locais para limpar. Todos os dados são gerenciados no servidor.');
    setConfirmAction(() => async () => {
      console.log('No local data to clear (API-first mode)');
      setConfirmVisible(false);
    });
    setConfirmVisible(true);
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
            <LogoutButton onPress={handleClearData}>
              <LogoutButtonText>Limpar Dados</LogoutButtonText>
            </LogoutButton>
          </Section>


          <Section>
            <ButtonRow>
              <LogoutButton onPress={handleLogout}>
                <LogoutButtonText>Sair da Conta</LogoutButtonText>
              </LogoutButton>
              <BackButton onPress={() => goBack()}>
                <BackButtonText>Voltar</BackButtonText>
              </BackButton>
            </ButtonRow>
          </Section>
        </Content>
      </ScrollView>
      <ConfirmModal
        visible={confirmVisible}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          if (confirmAction) {
            // call and ignore returned promise
            const res = confirmAction();
            if (res && typeof (res as any).then === 'function') {
              (res as any).then(() => {}).catch(() => {});
            }
          }
        }}
      />
    </Container>
  );
};

export default Profile;
