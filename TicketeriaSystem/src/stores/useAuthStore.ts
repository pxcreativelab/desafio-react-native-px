import { AuthState, LoginCredentials, RegisterData, User } from '@/interfaces/auth';
import * as SecureStorage from '@helpers/secureStorage';
import * as AuthApi from '@services/AuthApi';
import * as BiometricService from '@services/BiometricService';
import { create } from 'zustand';
import { useToastStore } from './useToastStore';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials, remember?: boolean) => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  enableBiometric: (credentials: LoginCredentials) => Promise<void>;
  disableBiometric: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  biometricEnabled: false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),

  restoreSession: async () => {
    try {
      const token = await SecureStorage.getAuthToken();
      const userData = await SecureStorage.getUserData();
      const biometricEnabled = await SecureStorage.isBiometricEnabled();

      if (token && userData) {
        set({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
          biometricEnabled,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('[AuthStore] Error restoring session:', error);
      set({ isLoading: false });
    }
  },

  login: async (credentials, remember = true) => {
    const { showToast } = useToastStore.getState();

    try {
      const response = await AuthApi.login(credentials);

      if (remember) {
        await SecureStorage.saveAuthToken(response.token);
        await SecureStorage.saveUserData(response.user);
      }

      const biometricEnabled = await SecureStorage.isBiometricEnabled();

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        biometricEnabled,
      });
    } catch (error: any) {
      showToast(error.message || 'Erro ao fazer login', 'error');
      throw error;
    }
  },

  loginWithBiometric: async () => {
    const { showToast } = useToastStore.getState();

    try {
      // Verificar se biometria está disponível
      const { available } = await BiometricService.isBiometricAvailable();
      if (!available) {
        showToast('Biometria não disponível neste dispositivo', 'error');
        return;
      }

      // Autenticar com biometria
      const { success, error } = await BiometricService.authenticateWithBiometric(
        'Faça login com sua biometria'
      );

      if (!success) {
        showToast(error || 'Falha na autenticação biométrica', 'error');
        return;
      }

      // Recuperar credenciais salvas
      const credentials = await SecureStorage.getBiometricCredentials();
      if (!credentials) {
        showToast('Credenciais não encontradas', 'error');
        await SecureStorage.setBiometricEnabled(false);
        set({ biometricEnabled: false });
        return;
      }

      // Fazer login
      await get().login(credentials, true);
    } catch (error: any) {
      showToast(error.message || 'Erro no login biométrico', 'error');
      throw error;
    }
  },

  register: async (data) => {
    const { showToast } = useToastStore.getState();

    try {
      // Validar senha
      if (data.password !== data.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      await AuthApi.register(data);

      showToast('Conta criada com sucesso! Faça login para continuar.', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao criar conta', 'error');
      throw error;
    }
  },

  logout: async () => {
    const { showToast } = useToastStore.getState();

    try {
      await SecureStorage.clearAllAuthData();

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        biometricEnabled: false,
      });

      showToast('Logout realizado', 'info');
    } catch (error: any) {
      console.error('[AuthStore] Error logging out:', error);
      showToast('Erro ao fazer logout', 'error');
    }
  },

  enableBiometric: async (credentials) => {
    const { showToast } = useToastStore.getState();

    try {
      // Verificar disponibilidade
      const { available } = await BiometricService.isBiometricAvailable();
      if (!available) {
        showToast('Biometria não disponível neste dispositivo', 'error');
        return;
      }

      // Autenticar uma vez para confirmar
      const { success, error } = await BiometricService.authenticateWithBiometric(
        'Confirme para habilitar login biométrico'
      );

      if (!success) {
        showToast(error || 'Falha na autenticação biométrica', 'error');
        return;
      }

      // Salvar credenciais e habilitar
      await SecureStorage.saveBiometricCredentials(credentials);
      await SecureStorage.setBiometricEnabled(true);

      set({ biometricEnabled: true });
      showToast('Login biométrico habilitado!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao habilitar biometria', 'error');
      throw error;
    }
  },

  disableBiometric: async () => {
    const { showToast } = useToastStore.getState();

    try {
      await SecureStorage.removeBiometricCredentials();
      await SecureStorage.setBiometricEnabled(false);

      set({ biometricEnabled: false });
      showToast('Login biométrico desabilitado', 'info');
    } catch (error: any) {
      showToast(error.message || 'Erro ao desabilitar biometria', 'error');
      throw error;
    }
  },
}));
