import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootRouter } from '@/routes/RootRouter';
import { useAuthStore } from '@/stores/useAuthStore';
import { ToastContainer } from '@components/_fragments/Toast';


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7b7b88',
  },
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

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
      <RootRouter isAuthenticated={isAuthenticated} />
      <ToastContainer />
    </SafeAreaProvider>
  );
}

export default App;
