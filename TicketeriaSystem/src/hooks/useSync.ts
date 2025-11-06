import AsyncStorageCache from '@/helpers/AsyncStorageCache';
import OfflineSyncService from '@/services/OfflineSyncService';
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/**
 * Hook para monitorar status de conexão de rede e sincronizar quando voltar online
 * 
 * @param onReconnect - Callback a ser executado quando detectar volta de conexão
 */
export const useSyncStatus = (onReconnect?: () => void) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [wasOffline, setWasOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Atualizar contagem de ações pendentes
  const updatePendingCount = async () => {
    const count = await OfflineSyncService.getPendingCount();
    setPendingCount(count);
  };

  useEffect(() => {
    // Carregar timestamp da última sincronização
    AsyncStorageCache.getLastSync().then(timestamp => {
      setLastSyncTime(timestamp);
    });

    // Atualizar contagem inicial
    updatePendingCount();

    // Verificar estado inicial
    NetInfo.fetch().then(state => {
      const connected = state.isConnected ?? false;
      setIsOnline(connected);
      if (!connected) {
        setWasOffline(true);
      }
    });

    // Listener para mudanças de conectividade
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? false;
      const previouslyOnline = isOnline;

      setIsOnline(connected);

      // Detectar volta de conexão (estava offline e agora está online)
      if (!previouslyOnline && connected && wasOffline) {
        console.log('[useSyncStatus] Connection restored, triggering sync...');
        setWasOffline(false);

        // Sincronizar ações pendentes
        setIsSyncing(true);
        OfflineSyncService.syncAll()
          .then(result => {
            console.log('[useSyncStatus] Sync completed:', result);
            updatePendingCount();

            // Executar callback de reconexão
            if (onReconnect) {
              onReconnect();
            }
          })
          .catch(error => {
            console.error('[useSyncStatus] Sync failed:', error);
          })
          .finally(() => {
            setIsSyncing(false);
          });

        // Atualizar timestamp de sincronização
        AsyncStorageCache.updateLastSync().then(() => {
          AsyncStorageCache.getLastSync().then(timestamp => {
            setLastSyncTime(timestamp);
          });
        });
      }

      // Marcar que esteve offline
      if (!connected) {
        setWasOffline(true);
      }
    });

    return unsubscribe;
  }, [isOnline, wasOffline, onReconnect]);

  return {
    isOnline,
    lastSyncTime,
    isSyncing,
    pendingCount,
  };
};

