import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListTicketsResponse, Ticket } from '../services/TicketApi';

const STORAGE_KEYS = {
  TICKETS_LIST: '@ticketeria:tickets_list',
  TICKET_DETAILS: '@ticketeria:ticket_details',
  LAST_SYNC: '@ticketeria:last_sync',
  PENDING_ACTIONS: '@ticketeria:pending_actions',
  OFFLINE_TICKETS: '@ticketeria:offline_tickets',
};

export interface PendingAction {
  id: string;
  type: 'create' | 'update' | 'updateStatus' | 'addComment';
  ticketId?: number | string;
  data: any;
  timestamp: number;
  localTicketId?: string; // Para tickets criados offline
}

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

// ============ OFFLINE QUEUE ============

// Gerar ID único para tickets criados offline
const generateOfflineId = (): string => {
  return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Adicionar ação pendente à fila
export const addPendingAction = async (action: Omit<PendingAction, 'id' | 'timestamp'>): Promise<string> => {
  try {
    const actionId = generateOfflineId();
    const pendingAction: PendingAction = {
      ...action,
      id: actionId,
      timestamp: Date.now(),
    };

    const existingActions = await getPendingActions();
    const updatedActions = [...existingActions, pendingAction];

    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_ACTIONS, JSON.stringify(updatedActions));
    console.log('[TicketStorage] Pending action added:', pendingAction.type, actionId);

    return actionId;
  } catch (error) {
    console.error('Error adding pending action:', error);
    throw error;
  }
};

// Obter todas as ações pendentes
export const getPendingActions = async (): Promise<PendingAction[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting pending actions:', error);
    return [];
  }
};

// Remover ação pendente da fila
export const removePendingAction = async (actionId: string): Promise<void> => {
  try {
    const actions = await getPendingActions();
    const filtered = actions.filter(a => a.id !== actionId);
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_ACTIONS, JSON.stringify(filtered));
    console.log('[TicketStorage] Pending action removed:', actionId);
  } catch (error) {
    console.error('Error removing pending action:', error);
  }
};

// Limpar todas as ações pendentes
export const clearPendingActions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_ACTIONS);
    console.log('[TicketStorage] All pending actions cleared');
  } catch (error) {
    console.error('Error clearing pending actions:', error);
  }
};

// Salvar ticket criado offline
export const saveOfflineTicket = async (ticket: Ticket): Promise<void> => {
  try {
    const offlineTickets = await getOfflineTickets();
    const updated = [...offlineTickets, ticket];
    await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_TICKETS, JSON.stringify(updated));

    // Também salvar nos detalhes para acesso direto
    await saveTicketDetailsToStorage(ticket);

    console.log('[TicketStorage] Offline ticket saved:', ticket.id);
  } catch (error) {
    console.error('Error saving offline ticket:', error);
  }
};

// Obter todos os tickets criados offline
export const getOfflineTickets = async (): Promise<Ticket[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_TICKETS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting offline tickets:', error);
    return [];
  }
};

// Atualizar ticket offline localmente
export const updateOfflineTicket = async (ticketId: string | number, updates: Partial<Ticket>): Promise<void> => {
  try {
    // Atualizar na lista de offline tickets
    const offlineTickets = await getOfflineTickets();
    const index = offlineTickets.findIndex(t => String(t.id) === String(ticketId));

    if (index !== -1) {
      offlineTickets[index] = { ...offlineTickets[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_TICKETS, JSON.stringify(offlineTickets));
    }

    // Atualizar também no cache de detalhes
    const existingTicket = await getTicketDetailsFromStorage(ticketId);
    if (existingTicket) {
      const updatedTicket = { ...existingTicket, ...updates };
      await saveTicketDetailsToStorage(updatedTicket);
    }

    // Atualizar na lista principal se existir
    const cachedList = await getTicketsFromStorage();
    if (cachedList) {
      const listIndex = cachedList.data.findIndex(t => String(t.id) === String(ticketId));
      if (listIndex !== -1) {
        cachedList.data[listIndex] = { ...cachedList.data[listIndex], ...updates };
        await saveTicketsToStorage(cachedList);
      }
    }

    console.log('[TicketStorage] Offline ticket updated:', ticketId);
  } catch (error) {
    console.error('Error updating offline ticket:', error);
  }
};

// Remover ticket offline após sincronização
export const removeOfflineTicket = async (localTicketId: string): Promise<void> => {
  try {
    const offlineTickets = await getOfflineTickets();
    const filtered = offlineTickets.filter(t => String(t.id) !== localTicketId);
    await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_TICKETS, JSON.stringify(filtered));
    console.log('[TicketStorage] Offline ticket removed:', localTicketId);
  } catch (error) {
    console.error('Error removing offline ticket:', error);
  }
};

// Verificar se um ticket é offline (ID começa com "offline_")
export const isOfflineTicket = (ticketId: string | number): boolean => {
  return String(ticketId).startsWith('offline_');
};
