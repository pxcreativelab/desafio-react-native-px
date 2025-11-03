/**
 * Ticketeria System App
 * Sistema completo de gestão de tickets
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastContainer } from './src/components/_fragments/Toast';
import AppRoutes from './src/routes';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppRoutes />
      <ToastContainer />
    </SafeAreaProvider>
  );
}

export default App;
