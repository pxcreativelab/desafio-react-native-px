import {
  Container,
  PendingCount,
  StatusBadge,
  StatusText,
  SyncingIndicator,
} from '@components/_fragments/SyncStatusBadge/styles';
import { useSyncStatus } from '@hooks/useSync';
import React from 'react';
import { ActivityIndicator } from 'react-native';

export const SyncStatusBadge: React.FC = () => {
  const { isOnline, isSyncing, pendingCount } = useSyncStatus();

  return (
    <Container>
      {isSyncing && isOnline && (
        <SyncingIndicator>
          <ActivityIndicator size="small" color="#2196f3" />
          <StatusText>Sincronizando...</StatusText>
        </SyncingIndicator>
      )}

      {pendingCount > 0 && (
        <PendingCount>
          {pendingCount} {pendingCount === 1 ? 'pendência' : 'pendências'}
        </PendingCount>
      )}



      <StatusBadge >
        <StatusText>{isOnline ? '🟢 Online' : '🔴 Offline'}</StatusText>
      </StatusBadge>

    </Container>
  );
};
