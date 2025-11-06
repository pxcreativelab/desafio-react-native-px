import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ticket } from '@services/TicketApi';

// Chaves para o AsyncStorage
const CACHE_KEYS = {
  TICKETS_LIST: '@ticketeria:tickets_list',
  TICKET_DETAIL: '@ticketeria:ticket_detail:',
  USER_PREFERENCES: '@ticketeria:user_preferences',
  LAST_SYNC: '@ticketeria:last_sync',
};

export interface CachedTicketsList {
  data: Ticket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters?: {
    status?: string;
    search?: string;
  };
  timestamp: number;
}

export interface UserPreferences {
  defaultFilter?: string;
  defaultSort?: string;
  pageSize?: number;
}

/**
 * Helper para gerenciar cache de tickets no AsyncStorage
 */
class AsyncStorageCache {
  /**
   * Salva lista de tickets no cache
   */
  async saveTicketsList(data: CachedTicketsList): Promise<void> {
    try {
      const cacheData = {
        ...data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(CACHE_KEYS.TICKETS_LIST, JSON.stringify(cacheData));
      console.log('[AsyncStorageCache] Tickets list saved to cache');
    } catch (error) {
      console.error('[AsyncStorageCache] Error saving tickets list:', error);
    }
  }

  /**
   * Carrega lista de tickets do cache
   */
  async loadTicketsList(): Promise<CachedTicketsList | null> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.TICKETS_LIST);
      if (cached) {
        const data = JSON.parse(cached) as CachedTicketsList;
        console.log('[AsyncStorageCache] Tickets list loaded from cache:', data.data.length, 'items');
        return data;
      }
      return null;
    } catch (error) {
      console.error('[AsyncStorageCache] Error loading tickets list:', error);
      return null;
    }
  }

  /**
   * Salva detalhes de um ticket específico no cache
   */
  async saveTicketDetail(ticketId: number | string, ticket: Ticket): Promise<void> {
    try {
      const key = `${CACHE_KEYS.TICKET_DETAIL}${ticketId}`;
      const cacheData = {
        ticket,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
      console.log('[AsyncStorageCache] Ticket detail saved to cache:', ticketId);
    } catch (error) {
      console.error('[AsyncStorageCache] Error saving ticket detail:', error);
    }
  }

  /**
   * Carrega detalhes de um ticket específico do cache
   */
  async loadTicketDetail(ticketId: number | string): Promise<Ticket | null> {
    try {
      const key = `${CACHE_KEYS.TICKET_DETAIL}${ticketId}`;
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const data = JSON.parse(cached) as { ticket: Ticket; timestamp: number };
        console.log('[AsyncStorageCache] Ticket detail loaded from cache:', ticketId);
        return data.ticket;
      }
      return null;
    } catch (error) {
      console.error('[AsyncStorageCache] Error loading ticket detail:', error);
      return null;
    }
  }

  /**
   * Salva preferências do usuário
   */
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      console.log('[AsyncStorageCache] User preferences saved');
    } catch (error) {
      console.error('[AsyncStorageCache] Error saving user preferences:', error);
    }
  }

  /**
   * Carrega preferências do usuário
   */
  async loadUserPreferences(): Promise<UserPreferences | null> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.USER_PREFERENCES);
      if (cached) {
        return JSON.parse(cached) as UserPreferences;
      }
      return null;
    } catch (error) {
      console.error('[AsyncStorageCache] Error loading user preferences:', error);
      return null;
    }
  }

  /**
   * Limpa todo o cache de tickets
   */
  async clearTicketsCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.TICKETS_LIST);

      // Limpar também todos os detalhes de tickets
      const allKeys = await AsyncStorage.getAllKeys();
      const ticketDetailKeys = allKeys.filter(key => key.startsWith(CACHE_KEYS.TICKET_DETAIL));
      if (ticketDetailKeys.length > 0) {
        await AsyncStorage.multiRemove(ticketDetailKeys);
      }

      console.log('[AsyncStorageCache] Tickets cache cleared');
    } catch (error) {
      console.error('[AsyncStorageCache] Error clearing tickets cache:', error);
    }
  }

  /**
   * Limpa cache de um ticket específico
   */
  async clearTicketDetail(ticketId: number | string): Promise<void> {
    try {
      const key = `${CACHE_KEYS.TICKET_DETAIL}${ticketId}`;
      await AsyncStorage.removeItem(key);
      console.log('[AsyncStorageCache] Ticket detail cache cleared:', ticketId);
    } catch (error) {
      console.error('[AsyncStorageCache] Error clearing ticket detail:', error);
    }
  }

  /**
   * Atualiza timestamp da última sincronização
   */
  async updateLastSync(): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
    } catch (error) {
      console.error('[AsyncStorageCache] Error updating last sync:', error);
    }
  }

  /**
   * Obtém timestamp da última sincronização
   */
  async getLastSync(): Promise<number | null> {
    try {
      const timestamp = await AsyncStorage.getItem(CACHE_KEYS.LAST_SYNC);
      return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
      console.error('[AsyncStorageCache] Error getting last sync:', error);
      return null;
    }
  }

  /**
   * Verifica se o cache está desatualizado (mais de X minutos)
   */
  isCacheStale(cacheTimestamp: number, maxAgeMinutes: number = 5): boolean {
    const now = Date.now();
    const ageMs = now - cacheTimestamp;
    const ageMinutes = ageMs / (1000 * 60);
    return ageMinutes > maxAgeMinutes;
  }
}

export default new AsyncStorageCache();
