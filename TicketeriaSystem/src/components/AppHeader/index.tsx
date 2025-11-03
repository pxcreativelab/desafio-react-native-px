import { useAuthStore } from '@/stores/useAuthStore';
import { SyncStatusBadge } from '@components/_fragments/SyncStatusBadge';
import React from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import {
  HeaderContainer,
  LeftContainer,
  RightContainer,
  Title
} from './styles';

interface AppHeaderProps {
  title?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title = 'Ticketeria' }) => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <HeaderContainer>
      <LeftContainer>
        <Title>{title}</Title>
      </LeftContainer>
      <RightContainer>
        <SyncStatusBadge />
        <TouchableOpacity onPress={handleLogout}>
          <Text>👤</Text>
        </TouchableOpacity>
      </RightContainer>
    </HeaderContainer>
  );
};

export default AppHeader;
