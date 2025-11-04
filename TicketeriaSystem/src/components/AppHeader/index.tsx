import { dropTables } from '@/database/database';
import { useAuthStore } from '@/stores/useAuthStore';
import { SyncStatusBadge } from '@components/_fragments/SyncStatusBadge';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import {
  AvatarButton, AvatarText,
  HeaderContainer,
  LeftContainer,
  RightContainer,
  Title
} from './styles';

interface AppHeaderProps {
  title?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title = 'Ticketeria' }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    console.log('Logout initiated');

    Alert.alert('Sair', 'Deseja fazer logout?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
          dropTables();
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
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return '?';
  };

  const initials = getInitials(user?.name || undefined, user?.email || undefined);

  return (
    <HeaderContainer>
      <LeftContainer>
        <Title>{title}</Title>
      </LeftContainer>
      <RightContainer>
        <SyncStatusBadge />
        <TouchableOpacity onPress={handleLogout} accessibilityLabel="Perfil">
          {/* Avatar with initials */}
          <AvatarButton activeOpacity={0.2}>
            <AvatarText>{initials}</AvatarText>
          </AvatarButton>
        </TouchableOpacity>
      </RightContainer>
    </HeaderContainer>
  );
};

export default AppHeader;
