import ConfirmModal from '@/components/ConfirmModal';
import AsyncStorageCache from '@/helpers/AsyncStorageCache';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useAuthStore } from '@/stores/useAuthStore';
import { SyncStatusBadge } from '@components/_fragments/SyncStatusBadge';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity } from 'react-native';
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
  const { preferences, updatePreferences } = useUserPreferences();

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

  const handleClearCache = () => {
    setConfirmTitle('Limpar Cache');
    setConfirmMessage('Deseja limpar o cache local? Isso forçará o recarregamento dos dados do servidor.');
    setConfirmAction(() => async () => {
      await AsyncStorageCache.clearTicketsCache();
      console.log('Cache cleared');
      setConfirmVisible(false);
    });
    setConfirmVisible(true);
  };

  const statusFilterOptions = [
    { label: 'Nenhum', value: undefined },
    { label: 'Abertos', value: 'open' },
    { label: 'Em Andamento', value: 'in_progress' },
    { label: 'Resolvidos', value: 'resolved' },
    { label: 'Fechados', value: 'closed' },
  ];

  const pageSizeOptions = [10, 20, 50, 100];

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
            <SectionTitle>Preferências de Visualização</SectionTitle>

            <InfoRow>
              <InfoLabel>Filtro Padrão</InfoLabel>
            </InfoRow>
            <SettingRow style={{ flexWrap: 'wrap', gap: 8 }}>
              {statusFilterOptions.map((option) => (
                <TouchableOpacity
                  key={option.value || 'none'}
                  onPress={() => updatePreferences({ defaultFilter: option.value })}
                  style={[
                    styles.optionButton,
                    preferences.defaultFilter === option.value && styles.optionButtonSelected
                  ]}
                >
                  <Text style={[
                    styles.optionText,
                    preferences.defaultFilter === option.value && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </SettingRow>

            <InfoRow style={{ marginTop: 16 }}>
              <InfoLabel>Itens por Página</InfoLabel>
            </InfoRow>
            <SettingRow style={{ flexWrap: 'wrap', gap: 8 }}>
              {pageSizeOptions.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => updatePreferences({ pageSize: size })}
                  style={[
                    styles.optionButton,
                    preferences.pageSize === size && styles.optionButtonSelected
                  ]}
                >
                  <Text style={[
                    styles.optionText,
                    preferences.pageSize === size && styles.optionTextSelected
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </SettingRow>
          </Section>

          <Divider />

          <Section>
            <LogoutButton onPress={handleClearCache}>
              <LogoutButtonText>Limpar Cache</LogoutButtonText>
            </LogoutButton>
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

const styles = StyleSheet.create({
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  optionButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
});

export default Profile;
