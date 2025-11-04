import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { openDatabase } from '@/database/database';
import { useAuthStore } from '@/stores/useAuthStore';
import { ToastContainer } from '@components/_fragments/Toast';
import { initSyncService } from '@services/SyncService';


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();

  useEffect(() => {
    // Restaurar sessão ao iniciar
    restoreSession();

    // Inicializar banco de dados SQLite
    openDatabase()
      .then(() => {
        console.log('[App] SQLite database initialized');
      })
      .catch(error => {
        console.error('[App] Failed to initialize SQLite:', error);
      });
  }, [restoreSession]);

  useEffect(() => {
    // Inicializar serviço de sincronização apenas se autenticado
    if (isAuthenticated) {
      initSyncService();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* <RootRouter isAuthenticated={isAuthenticated} /> */}
      <ToastContainer />
    </SafeAreaProvider>
  );
}

export default App;
