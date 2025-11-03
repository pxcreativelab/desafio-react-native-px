import { SyncStatusBadge } from '@components/_fragments/SyncStatusBadge';
import React from 'react';
import {
  HeaderContainer,
  LeftContainer,
  RightContainer,
  Title
} from './styles';

interface AppHeaderProps {
  title?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title = 'DSF' }) => {
  return (
    <HeaderContainer>
      <LeftContainer>
        <Title>{title}</Title>
      </LeftContainer>
      <RightContainer>
        <SyncStatusBadge />
      </RightContainer>
    </HeaderContainer>
  );
};

export default AppHeader;
