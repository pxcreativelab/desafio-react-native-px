/**
 * Ticketeria System App
 * Sistema completo de gestão de tickets
 *
 * @format
 */

import AppHeader from '@/components/AppHeader';
import { openDatabase } from '@/database/database';
import { queryClient } from '@/services/queryClient';
import { ToastContainer } from '@components/_fragments/Toast';
import { initSyncService } from '@services/SyncService';
import { QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppRoutes from './src/routes';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Inicializar banco de dados SQLite
    openDatabase()
      .then(() => {
        console.log('[App] SQLite database initialized');
      })
      .catch(error => {
        console.error('[App] Failed to initialize SQLite:', error);
      });

    // Inicializar serviço de sincronização
    initSyncService();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppHeader />
        <AppRoutes />
        <ToastContainer />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
