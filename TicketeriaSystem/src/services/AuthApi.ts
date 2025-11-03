import { LoginCredentials, LoginResponse, RegisterData, User } from '@/types/auth';
import api from './Api';

/**
 * Faz login do usuário
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    console.error('[AuthApi] Error logging in:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Falha ao fazer login');
  }
};

/**
 * Registra um novo usuário
 */
export const register = async (data: RegisterData): Promise<User> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerPayload } = data;
    const response = await api.post<User>('/auth/register', registerPayload);
    return response.data;
  } catch (error: any) {
    console.error('[AuthApi] Error registering:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Falha ao criar conta');
  }
};

/**
 * Valida o token atual
 */
export const validateToken = async (token: string): Promise<User> => {
  try {
    const response = await api.get<User>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('[AuthApi] Error validating token:', error.response?.data || error.message);
    throw new Error('Token inválido');
  }
};

export default {
  login,
  register,
  validateToken,
};
