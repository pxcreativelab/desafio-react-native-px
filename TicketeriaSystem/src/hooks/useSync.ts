import {
  addSyncListener,
  getSyncStatus,
  removeSyncListener,
  syncPendingData,
  SyncStatus,
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

/**
 * Hook para forçar sincronização manual
 */
export const useManualSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sync = async () => {
    setIsSyncing(true);
    setError(null);

    try {
      await syncPendingData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  return { sync, isSyncing, error };
};
