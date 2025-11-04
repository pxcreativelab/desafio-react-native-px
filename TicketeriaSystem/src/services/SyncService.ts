import { TicketPriority, TicketStatus } from '@/interfaces/Ticket';
import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL } from '@services/Api';

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
import getPendingActions from './SQLiteService/getPendingActions';

/**
 * Estado da sincronização
 */
let isSyncing = false;
let isOnline = false;
let syncListeners: Array<(status: SyncStatus) => void> = [];
let syncInterval: ReturnType<typeof setInterval> | null = null;
let lastSyncAttempt: string | null = null;
let syncErrors: string[] = [];
let pendingSyncPromise: Promise<void> | null = null;

export interface SyncStatus {
  isSyncing: boolean;
  isOnline: boolean;
  pendingCount: number;
  lastSync?: string;
  errors?: string[];
}

// Configurações de sincronização
const SYNC_INTERVAL_MS = 2 * 60 * 1000; // 2 minutos
const MAX_SYNC_ERRORS = 5;

/**
 * Inicializa o serviço de sincronização
 */
export const initSyncService = () => {
  console.log('[SyncService] Initializing sync service...');

  // Limpar intervalo anterior se existir
  if (syncInterval) {
    clearInterval(syncInterval);
  }

  // Iniciar sincronização periódica
  syncInterval = setInterval(() => {
    if (isOnline && !isSyncing) {
      getPendingActions().then(pending => {
        if (pending.length > 0) {
          console.log(`[SyncService] Periodic sync: ${pending.length} pending items`);
          triggerSync().catch(err => {
            console.error('[SyncService] Periodic sync failed:', err);
          });
        }
      });
    }
  }, SYNC_INTERVAL_MS);

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
            triggerSync().catch(err => {
              console.error('[SyncService] Connection restored sync failed:', err);
            });
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

      // Se estiver online, tentar sincronizar pendências
      if (isOnline) {
        triggerSync().catch(err => {
          console.error('[SyncService] Initial sync failed:', err);
        });
      }
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
    lastSync: lastSyncAttempt || undefined,
    errors: syncErrors.length > 0 ? syncErrors.slice(-MAX_SYNC_ERRORS) : undefined,
  };

  syncListeners.forEach(listener => listener(status));
};

/**
 * Aciona manualmente a sincronização
 * Pode ser chamado após operações locais para tentar sincronizar imediatamente
 * Se já houver um sync em andamento, retorna a Promise existente
 */
export const triggerSync = async (): Promise<void> => {
  console.log('[SyncService] triggerSync called');

  // Se já existe um sync em andamento, retornar a promise existente
  if (pendingSyncPromise) {
    console.log('[SyncService] Sync already in progress, waiting for it to complete...');
    return pendingSyncPromise;
  }

  // Criar nova promise de sync
  pendingSyncPromise = syncPendingData().finally(() => {
    pendingSyncPromise = null;
  });

  return pendingSyncPromise;
};

/**
 * Sincroniza todos os dados pendentes
 */
const syncPendingData = async (): Promise<void> => {
  if (isSyncing) {
    console.log('[SyncService] Sync already in progress, skipping...');
    return;
  }

  // Verificar conexão em tempo real antes de sincronizar
  const netState = await NetInfo.fetch();
  const networkConnected = netState.isConnected === true;

  if (!networkConnected) {
    console.log('[SyncService] Network is offline, sync skipped');
    return;
  }

  // Verificar se servidor está acessível
  const serverReachable = await checkServerReachable();
  if (!serverReachable) {
    console.log('[SyncService] Server not reachable, sync skipped');
    return;
  }

  isSyncing = true;
  lastSyncAttempt = new Date().toISOString();
  notifyListeners();

  try {
    console.log('[SyncService] Starting sync process...');

    // Verificar diretamente se há tickets ou comentários não sincronizados
    const unsyncedTickets = await getUnsyncedTickets();
    const unsyncedComments = await getUnsyncedComments();
    const totalUnsynced = unsyncedTickets.length + unsyncedComments.length;

    if (totalUnsynced === 0) {
      console.log('[SyncService] No pending items to sync');
      return;
    }

    console.log(`[SyncService] Found ${totalUnsynced} items to sync (${unsyncedTickets.length} tickets, ${unsyncedComments.length} comments)`);

    // 1. Sincronizar tickets não sincronizados
    const ticketErrors = await syncTickets();

    // 2. Sincronizar comentários não sincronizados
    const commentErrors = await syncComments();

    // Atualizar erros
    const allErrors = [...ticketErrors, ...commentErrors];
    if (allErrors.length > 0) {
      syncErrors = [...syncErrors, ...allErrors].slice(-MAX_SYNC_ERRORS);
      console.warn(`[SyncService] Sync completed with ${allErrors.length} errors`);
    } else {
      syncErrors = []; // Limpar erros em caso de sucesso total
      console.log('[SyncService] Sync completed successfully');
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[SyncService] Sync failed:', error);
    syncErrors = [...syncErrors, errorMsg].slice(-MAX_SYNC_ERRORS);
  } finally {
    isSyncing = false;
    notifyListeners();
  }
};

/**
 * Sincroniza tickets não sincronizados
 * Retorna array de erros encontrados
 */
const syncTickets = async (): Promise<string[]> => {
  const errors: string[] = [];
  const syncingTickets = new Set<number>();

  try {
    console.log('[SyncService] Fetching unsynced tickets from database...');
    const unsyncedTickets = await getUnsyncedTickets();

    if (unsyncedTickets.length === 0) {
      console.log('[SyncService] No unsynced tickets found');
      return errors;
    }

    console.log(`[SyncService] Found ${unsyncedTickets.length} unsynced tickets to sync`);
    console.log('[SyncService] Tickets to sync:', unsyncedTickets.map(t => ({ id: t.id, serverId: t.serverId, syncStatus: t.syncStatus, title: t.title })));

    for (const ticket of unsyncedTickets) {
      try {
        // Verificar se já está sendo sincronizado (dupla proteção)
        if (ticket.syncStatus !== 'pending') {
          console.log(`[SyncService] Ticket ${ticket.id} already synced (status: ${ticket.syncStatus}), skipping...`);
          continue;
        }

        // Proteção adicional contra duplicação
        if (syncingTickets.has(ticket.id)) {
          console.log(`[SyncService] Ticket ${ticket.id} is already being synced in this batch, skipping...`);
          continue;
        }
        syncingTickets.add(ticket.id);

        // Se não tem serverId, é um ticket novo (criar no servidor)
        if (!ticket.serverId) {
          console.log(`[SyncService] Creating new ticket ${ticket.id} on server...`);
          const response = await createTicket({
            title: ticket.title,
            description: ticket.description,
            category: ticket.category,
            priority: ticket.priority,
            createdAt: ticket.createdAt,
            status: ticket.status,
            createdBy: {
              id: ticket.createdById?.toString() || 'unknown',
              name: ticket.createdByName || 'Unknown',
              email: ticket.createdByEmail || 'unknown@example.com',
            }
          });

          // Marcar como sincronizado
          await markTicketAsSynced(ticket.id, response.id);
          console.log(`[SyncService] Ticket ${ticket.id} created on server as ${response.id}`);
        } else {
          // Ticket existente, atualizar no servidor
          console.log(`[SyncService] Updating ticket ${ticket.serverId} on server...`);
          await updateTicket(ticket.serverId, {
            title: ticket.title,
            description: ticket.description,
            category: ticket.category,
            priority: ticket.priority as TicketPriority,
            status: ticket.status as TicketStatus,
          });

          await markTicketAsSynced(ticket.id, ticket.serverId);
          console.log(`[SyncService] Ticket ${ticket.serverId} updated on server`);
        }
      } catch (error) {
        const errorMsg = `Failed to sync ticket ${ticket.id}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`[SyncService] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    if (errors.length === 0) {
      console.log('[SyncService] All tickets synced successfully');
    }
  } catch (error) {
    const errorMsg = `Error syncing tickets: ${error instanceof Error ? error.message : String(error)}`;
    console.error(`[SyncService] ${errorMsg}`);
    errors.push(errorMsg);
  }

  return errors;
};

/**
 * Sincroniza comentários não sincronizados
 * Retorna array de erros encontrados
 */
const syncComments = async (): Promise<string[]> => {
  const errors: string[] = [];

  try {
    const unsyncedComments = await getUnsyncedComments();

    if (unsyncedComments.length === 0) {
      console.log('[SyncService] No unsynced comments found');
      return errors;
    }

    console.log(`[SyncService] Syncing ${unsyncedComments.length} comments...`);

    for (const comment of unsyncedComments) {
      try {
        console.log(`[SyncService] Creating comment ${comment.id} on server for ticket ${comment.ticketId}...`);
        const response = await addComment(comment.ticketId, {
          text: comment.text,
          createdAt: comment.createdAt,
          createdBy: {
            id: comment.createdById?.toString() || 'unknown',
            name: comment.createdByName || 'Unknown',
            email: comment.createdByEmail || 'unknown@example.com',
          }
        });
        await markCommentAsSynced(comment.id, response.id);
        console.log(`[SyncService] Comment ${comment.id} created on server as ${response.id}`);
      } catch (error) {
        const errorMsg = `Failed to sync comment ${comment.id}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`[SyncService] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    if (errors.length === 0) {
      console.log('[SyncService] All comments synced successfully');
    }
  } catch (error) {
    const errorMsg = `Error syncing comments: ${error instanceof Error ? error.message : String(error)}`;
    console.error(`[SyncService] ${errorMsg}`);
    errors.push(errorMsg);
  }

  return errors;
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

/**
 * Para a sincronização periódica
 */
export const stopSyncService = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('[SyncService] Sync service stopped');
  }
};

export default {
  initSyncService,
  stopSyncService,
  triggerSync,
  checkConnection,
  getSyncStatus,
  addSyncListener,
  removeSyncListener,
};
