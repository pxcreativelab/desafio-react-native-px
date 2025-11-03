import {
  Container,
  PendingCount,
  StatusBadge,
  StatusText,
  SyncButton,
  SyncButtonText,
} from '@components/_fragments/SyncStatusBadge/styles';
import { useManualSync, useSyncStatus } from '@hooks/useSync';
import React from 'react';
import { ActivityIndicator } from 'react-native';

export const SyncStatusBadge: React.FC = () => {
  const { isOnline, isSyncing, pendingCount } = useSyncStatus();
  const { sync, isSyncing: isManualSyncing } = useManualSync();

  const handleSync = () => {
    if (!isSyncing && !isManualSyncing && isOnline) {
      sync();
    }
  };

  return (
    <Container>
      <StatusBadge $isOnline={isOnline}>
        <StatusText>{isOnline ? '🟢 Online' : '🔴 Offline'}</StatusText>
      </StatusBadge>

      {pendingCount > 0 && (
        <>
          <PendingCount>
            {pendingCount} {pendingCount === 1 ? 'pendência' : 'pendências'}
          </PendingCount>

          {isOnline && (
            <SyncButton onPress={handleSync} disabled={isSyncing || isManualSyncing}>
              {isSyncing || isManualSyncing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <SyncButtonText>🔄 Sincronizar</SyncButtonText>
              )}
            </SyncButton>
          )}
        </>
      )}
    </Container>
  );
};
