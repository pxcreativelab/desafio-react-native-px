import {
  addSyncListener,
  getSyncStatus,
  removeSyncListener,
  SyncStatus
} from '@services/SyncService';
import { useEffect, useState } from 'react';

/**
 * Hook para monitorar status de sincronização e conexão
 */
export const useSyncStatus = () => {
  const [status, setStatus] = useState<SyncStatus>({
    isSyncing: false,
    isOnline: false,
    pendingCount: 0,
  });

  useEffect(() => {
    // Buscar status inicial
    getSyncStatus().then(setStatus);

    // Adicionar listener para mudanças
    const listener = (newStatus: SyncStatus) => {
      setStatus(newStatus);
    };

    addSyncListener(listener);

    // Cleanup
    return () => {
      removeSyncListener(listener);
    };
  }, []);

  return status;
};

