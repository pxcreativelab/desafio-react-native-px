import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/**
 * Hook para monitorar status de conexão de rede
 */
export const useSyncStatus = () => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Verificar estado inicial
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected ?? false);
    });

    // Listener para mudanças de conectividade
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return unsubscribe;
  }, []);

  return {
    isOnline,
    isSyncing: false,
    pendingCount: 0,
  };
};

