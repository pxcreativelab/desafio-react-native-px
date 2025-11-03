import { BiometricCredentials } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: '@ticketeria:auth_token',
  USER_DATA: '@ticketeria:user_data',
  BIOMETRIC_ENABLED: '@ticketeria:biometric_enabled',
  BIOMETRIC_CREDENTIALS: '@ticketeria:biometric_credentials',
};

/**
 * Salva o token de autenticação
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('[SecureStorage] Error saving auth token:', error);
    throw error;
  }
};

/**
 * Recupera o token de autenticação
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('[SecureStorage] Error getting auth token:', error);
    return null;
  }
};

/**
 * Remove o token de autenticação
 */
export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('[SecureStorage] Error removing auth token:', error);
    throw error;
  }
};

/**
 * Salva dados do usuário
 */
export const saveUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('[SecureStorage] Error saving user data:', error);
    throw error;
  }
};

/**
 * Recupera dados do usuário
 */
export const getUserData = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('[SecureStorage] Error getting user data:', error);
    return null;
  }
};

/**
 * Remove dados do usuário
 */
export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.USER_DATA);
  } catch (error) {
    console.error('[SecureStorage] Error removing user data:', error);
    throw error;
  }
};

/**
 * Verifica se a biometria está habilitada
 */
export const isBiometricEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await AsyncStorage.getItem(KEYS.BIOMETRIC_ENABLED);
    return enabled === 'true';
  } catch (error) {
    console.error('[SecureStorage] Error checking biometric enabled:', error);
    return false;
  }
};

/**
 * Habilita/desabilita biometria
 */
export const setBiometricEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.BIOMETRIC_ENABLED, enabled ? 'true' : 'false');
  } catch (error) {
    console.error('[SecureStorage] Error setting biometric enabled:', error);
    throw error;
  }
};

/**
 * Salva credenciais para login biométrico
 * Nota: Em produção, use encriptação mais robusta (ex: react-native-keychain)
 */
export const saveBiometricCredentials = async (
  credentials: BiometricCredentials
): Promise<void> => {
  try {
    // Salva como JSON string (em produção, use encriptação real)
    await AsyncStorage.setItem(KEYS.BIOMETRIC_CREDENTIALS, JSON.stringify(credentials));
  } catch (error) {
    console.error('[SecureStorage] Error saving biometric credentials:', error);
    throw error;
  }
};

/**
 * Recupera credenciais para login biométrico
 */
export const getBiometricCredentials = async (): Promise<BiometricCredentials | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.BIOMETRIC_CREDENTIALS);
    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.error('[SecureStorage] Error getting biometric credentials:', error);
    return null;
  }
};

/**
 * Remove credenciais biométricas
 */
export const removeBiometricCredentials = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.BIOMETRIC_CREDENTIALS);
  } catch (error) {
    console.error('[SecureStorage] Error removing biometric credentials:', error);
    throw error;
  }
};

/**
 * Limpa todos os dados de autenticação
 */
export const clearAllAuthData = async (): Promise<void> => {
  try {
    await Promise.all([
      removeAuthToken(),
      removeUserData(),
      removeBiometricCredentials(),
    ]);
  } catch (error) {
    console.error('[SecureStorage] Error clearing all auth data:', error);
    throw error;
  }
};

export default {
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
  saveUserData,
  getUserData,
  removeUserData,
  isBiometricEnabled,
  setBiometricEnabled,
  saveBiometricCredentials,
  getBiometricCredentials,
  removeBiometricCredentials,
  clearAllAuthData,
};
