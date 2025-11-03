import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListTicketsResponse, Ticket } from '../services/TicketApi';

const STORAGE_KEYS = {
  TICKETS_LIST: '@ticketeria:tickets_list',
  TICKET_DETAILS: '@ticketeria:ticket_details',
  LAST_SYNC: '@ticketeria:last_sync',
};

// Cache da lista de tickets
export const saveTicketsToStorage = async (data: ListTicketsResponse): Promise<void> => {
  try {
    const cacheData = {
      ...data,
      cachedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.TICKETS_LIST, JSON.stringify(cacheData));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (error) {
    console.error('Error saving tickets to storage:', error);
  }
};

export const getTicketsFromStorage = async (): Promise<ListTicketsResponse | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TICKETS_LIST);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting tickets from storage:', error);
    return null;
  }
};

// Cache de detalhes do ticket
export const saveTicketDetailsToStorage = async (ticket: Ticket): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.TICKET_DETAILS}:${ticket.id}`;
    const cacheData = {
      ...ticket,
      cachedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving ticket details to storage:', error);
  }
};

export const getTicketDetailsFromStorage = async (ticketId: string | number): Promise<Ticket | null> => {
  try {
    const key = `${STORAGE_KEYS.TICKET_DETAILS}:${ticketId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting ticket details from storage:', error);
    return null;
  }
};

// Verificar se o cache é válido (menos de 5 minutos)
export const isCacheValid = async (maxAgeInMinutes: number = 5): Promise<boolean> => {
  try {
    const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    if (!lastSync) return false;

    const lastSyncDate = new Date(lastSync);
    const now = new Date();
    const diffInMinutes = (now.getTime() - lastSyncDate.getTime()) / (1000 * 60);

    return diffInMinutes < maxAgeInMinutes;
  } catch (error) {
    console.error('Error checking cache validity:', error);
    return false;
  }
};

// Limpar cache
export const clearTicketsCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TICKETS_LIST);
    await AsyncStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
  } catch (error) {
    console.error('Error clearing tickets cache:', error);
  }
};

// Limpar todo o cache de detalhes
export const clearAllTicketDetailsCache = async (): Promise<void> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const detailsKeys = allKeys.filter(key => key.startsWith(STORAGE_KEYS.TICKET_DETAILS));
    await AsyncStorage.multiRemove(detailsKeys);
  } catch (error) {
    console.error('Error clearing ticket details cache:', error);
  }
};

// Limpar todo o cache
export const clearAllCache = async (): Promise<void> => {
  try {
    await clearTicketsCache();
    await clearAllTicketDetailsCache();
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
};
