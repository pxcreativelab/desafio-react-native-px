
import { navigationRef } from '@/helpers/NavigationService';
import { useAuthStore } from '@/stores/useAuthStore';
import { SyncStatusBadge } from '@components/_fragments/SyncStatusBadge';
import React from 'react';
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
  const { user } = useAuthStore();

  const handleProfilePress = () => {
    navigationRef.current?.navigate('Profile' as never);
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
        <AvatarButton activeOpacity={0.2} onPress={handleProfilePress}>
          <AvatarText>{initials}</AvatarText>
        </AvatarButton>
      </RightContainer>
    </HeaderContainer>
  );
};

export default AppHeader;
