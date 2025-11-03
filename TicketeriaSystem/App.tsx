/**
 * Ticketeria System App
 * Sistema completo de gestão de tickets
 *
 * @format
 */

import { queryClient } from '@/services/queryClient';
import { ToastContainer } from '@components/_fragments/Toast';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppRoutes from './src/routes';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppRoutes />
        <ToastContainer />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
