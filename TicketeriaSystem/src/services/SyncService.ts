import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL } from '@services/Api';
import {
  cleanupFailedActions,
  getPendingActions,
  PendingAction,
  removePendingAction,
  updatePendingActionAttempt,
} from '@services/OfflineQueue';
import {
  getUnsyncedComments,
  getUnsyncedTickets,
  markCommentAsSynced,
  markTicketAsSynced
} from '@services/SQLiteService';
import {
  addComment,
  createTicket,
  updateTicket,
} from '@services/TicketApi';
import axios from 'axios';

/**
 * Estado da sincronização
 */
let isSyncing = false;
let isOnline = false;
let syncListeners: Array<(status: SyncStatus) => void> = [];

export interface SyncStatus {
  isSyncing: boolean;
  isOnline: boolean;
  pendingCount: number;
  lastSync?: string;
  errors?: string[];
}

/**
 * Inicializa o serviço de sincronização
 */
export const initSyncService = () => {
  // Monitorar conexão
  NetInfo.addEventListener(state => {
    const wasOffline = !isOnline;
    // primeiro checa rede
    const networkConnected = state.isConnected === true;

    console.log(`[SyncService] Network status: ${networkConnected ? 'ONLINE' : 'OFFLINE'}`);

    if (networkConnected) {
      // antes de considerar online, testar se o servidor é alcançável
      checkServerReachable()
        .then((reachable) => {
          isOnline = reachable;
          console.log(`[SyncService] Server reachable: ${reachable}`);

          // Se passou de offline para online (servidor acessível), iniciar sync
          if (wasOffline && isOnline) {
            console.log('[SyncService] Connection restored, starting sync...');
            syncPendingData();
          }

          notifyListeners();
        })
        .catch((err) => {
          console.error('[SyncService] Error checking server reachability:', err);
          isOnline = false;
          notifyListeners();
        });
    } else {
      isOnline = false;
      notifyListeners();
    }
  });

  // Verificar estado inicial
  NetInfo.fetch().then(async (state) => {
    const networkConnected = state.isConnected === true;
    if (networkConnected) {
      const reachable = await checkServerReachable();
      isOnline = reachable;
      console.log(`[SyncService] Initial connection: ${isOnline ? 'ONLINE' : 'OFFLINE'}, server reachable: ${reachable}`);
    } else {
      isOnline = false;
      console.log('[SyncService] Initial connection: OFFLINE');
    }
    notifyListeners();
  });
};

/**
 * Tenta conectar no servidor API para verificar se o backend está acessível.
 * Retorna true se o servidor responder (qualquer código HTTP) dentro do timeout.
 */
export const checkServerReachable = async (): Promise<boolean> => {
  const target = `${API_BASE_URL}/api/v1/health`
  try {
    // Usa axios para permitir timeout
    const res = await axios.get(target, { timeout: 3000 });
    // Se obteve qualquer resposta, consideramos alcançável
    return res.status >= 0;
  } catch {
    // erro de rede ou timeout
    return false;
  }
};

/**
 * Adiciona um listener para mudanças no status de sincronização
 */
export const addSyncListener = (listener: (status: SyncStatus) => void) => {
  syncListeners.push(listener);
};

/**
 * Remove um listener
 */
export const removeSyncListener = (listener: (status: SyncStatus) => void) => {
  syncListeners = syncListeners.filter(l => l !== listener);
};

/**
 * Notifica todos os listeners
 */
const notifyListeners = async () => {
  const pendingActions = await getPendingActions();
  const status: SyncStatus = {
    isSyncing,
    isOnline,
    pendingCount: pendingActions.length,
    lastSync: new Date().toISOString(),
  };

  syncListeners.forEach(listener => listener(status));
};

/**
 * Sincroniza todos os dados pendentes
 */
const syncPendingData = async (): Promise<void> => {
  if (isSyncing) {
    console.log('[SyncService] Sync already in progress, skipping...');
    return;
  }

  if (!isOnline) {
    console.log('[SyncService] Device is offline, sync skipped');
    return;
  }

  isSyncing = true;
  notifyListeners();

  try {
    console.log('[SyncService] Starting sync process...');

    // 1. Sincronizar tickets não sincronizados
    await syncTickets();

    // 2. Sincronizar comentários não sincronizados
    await syncComments();

    // 3. Processar fila de ações pendentes
    await processPendingActions();

    // 4. Limpar ações falhadas após muitas tentativas
    await cleanupFailedActions(5);

    console.log('[SyncService] Sync completed successfully');
  } catch (error) {
    console.error('[SyncService] Sync failed:', error);
  } finally {
    isSyncing = false;
    notifyListeners();
  }
};

/**
 * Sincroniza tickets não sincronizados
 */
const syncTickets = async (): Promise<void> => {
  try {
    const unsyncedTickets = await getUnsyncedTickets();

    if (unsyncedTickets.length === 0) {
      console.log('[SyncService] No unsynced tickets found');
      return;
    }

    console.log(`[SyncService] Syncing ${unsyncedTickets.length} tickets...`);

    for (const ticket of unsyncedTickets) {
      try {
        // Se começa com "local_", é um ticket novo (criar no servidor)
        if (ticket._localId?.startsWith('local_')) {
          const response = await createTicket({
            title: ticket.title,
            description: ticket.description,
            category: ticket.category,
            priority: ticket.priority,
          });

          // Marcar como sincronizado
          await markTicketAsSynced(ticket._localId, response.id.toString());
          console.log(`[SyncService] Ticket created on server: ${ticket._localId} -> ${response.id}`);
        } else {
          // Ticket existente, atualizar no servidor
          await updateTicket(ticket.id.toString(), {
            title: ticket.title,
            description: ticket.description,
            category: ticket.category,
            priority: ticket.priority,
            status: ticket.status,
          });

          await markTicketAsSynced(ticket.id.toString(), ticket.id.toString());
          console.log(`[SyncService] Ticket updated on server: ${ticket.id}`);
        }
      } catch (error) {
        console.error(`[SyncService] Failed to sync ticket ${ticket.id}:`, error);
      }
    }
  } catch (error) {
    console.error('[SyncService] Error syncing tickets:', error);
    throw error;
  }
};

/**
 * Sincroniza comentários não sincronizados
 */
const syncComments = async (): Promise<void> => {
  try {
    const unsyncedComments = await getUnsyncedComments();

    if (unsyncedComments.length === 0) {
      console.log('[SyncService] No unsynced comments found');
      return;
    }

    console.log(`[SyncService] Syncing ${unsyncedComments.length} comments...`);

    for (const comment of unsyncedComments) {
      try {
        const response = await addComment(comment.ticketId, comment.text);
        await markCommentAsSynced(comment._localId!, response.id.toString());
        console.log(`[SyncService] Comment synced: ${comment._localId} -> ${response.id}`);
      } catch (error) {
        console.error(`[SyncService] Failed to sync comment ${comment.id}:`, error);
      }
    }
  } catch (error) {
    console.error('[SyncService] Error syncing comments:', error);
    throw error;
  }
};

/**
 * Processa ações pendentes da fila
 */
const processPendingActions = async (): Promise<void> => {
  try {
    const pendingActions = await getPendingActions();

    if (pendingActions.length === 0) {
      console.log('[SyncService] No pending actions to process');
      return;
    }

    console.log(`[SyncService] Processing ${pendingActions.length} pending actions...`);

    for (const action of pendingActions) {
      try {
        await processAction(action);
        await removePendingAction(action.id!);
        console.log(`[SyncService] Action processed: ${action.type} ${action.entityType} ${action.entityId}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await updatePendingActionAttempt(action.id!, errorMessage);
        console.error(`[SyncService] Failed to process action ${action.id}:`, error);
      }
    }
  } catch (error) {
    console.error('[SyncService] Error processing pending actions:', error);
    throw error;
  }
};

/**
 * Processa uma ação individual
 */
const processAction = async (action: PendingAction): Promise<void> => {
  const { type, entityType, entityId, data } = action;

  if (entityType === 'TICKET') {
    if (type === 'CREATE') {
      const response = await createTicket(data);
      await markTicketAsSynced(entityId, response.id.toString());
    } else if (type === 'UPDATE') {
      await updateTicket(entityId, data);
      await markTicketAsSynced(entityId, entityId);
    }
  } else if (entityType === 'COMMENT') {
    if (type === 'CREATE') {
      const response = await addComment(data.ticketId, data.text);
      await markCommentAsSynced(entityId, response.id.toString());
    }
  } else if (entityType === 'ATTACHMENT') {
    // TODO: Implementar sincronização de anexos quando necessário
    console.log('[SyncService] Attachment sync not implemented yet');
  }
};

/**
 * Verifica se o dispositivo está online
 */
export const checkConnection = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected === true;
};

/**
 * Retorna o status atual da sincronização
 */
export const getSyncStatus = async (): Promise<SyncStatus> => {
  const pendingActions = await getPendingActions();
  return {
    isSyncing,
    isOnline,
    pendingCount: pendingActions.length,
  };
};

export default {
  initSyncService,
  checkConnection,
  getSyncStatus,
  addSyncListener,
  removeSyncListener,
};
