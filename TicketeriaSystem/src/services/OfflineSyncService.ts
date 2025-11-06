import AsyncStorageCache from '@/helpers/AsyncStorageCache';
import {
  getPendingActions,
  PendingAction,
  removeOfflineTicket,
  removePendingAction,
} from '@/helpers/ticketStorage';
import { addComment, createTicket, updateTicket } from './TicketApi';

/**
 * Serviço para sincronizar ações offline com o servidor
 */
class OfflineSyncService {
  private isSyncing = false;

  /**
   * Sincroniza todas as ações pendentes
   */
  async syncAll(): Promise<{ success: number; failed: number }> {
    if (this.isSyncing) {
      console.log('[OfflineSyncService] Sync already in progress');
      return { success: 0, failed: 0 };
    }

    try {
      this.isSyncing = true;
      console.log('[OfflineSyncService] Starting sync...');

      const pendingActions = await getPendingActions();
      console.log(`[OfflineSyncService] Found ${pendingActions.length} pending actions`);

      if (pendingActions.length === 0) {
        return { success: 0, failed: 0 };
      }

      let success = 0;
      let failed = 0;

      // Processar ações em ordem (FIFO)
      for (const action of pendingActions) {
        try {
          await this.syncAction(action);
          await removePendingAction(action.id);
          success++;
          console.log(`[OfflineSyncService] Action synced successfully:`, action.type, action.id);
        } catch (error) {
          failed++;
          console.error(`[OfflineSyncService] Failed to sync action:`, action.type, action.id, error);
          // Continuar com as próximas ações mesmo se uma falhar
        }
      }

      // Limpar cache para forçar reload
      await AsyncStorageCache.clearTicketsCache();

      console.log(`[OfflineSyncService] Sync completed. Success: ${success}, Failed: ${failed}`);
      return { success, failed };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sincroniza uma ação específica
   */
  private async syncAction(action: PendingAction): Promise<void> {
    switch (action.type) {
      case 'create':
        await this.syncCreateTicket(action);
        break;
      case 'update':
        await this.syncUpdateTicket(action);
        break;
      case 'updateStatus':
        await this.syncUpdateStatus(action);
        break;
      case 'addComment':
        await this.syncAddComment(action);
        break;
      default:
        console.warn('[OfflineSyncService] Unknown action type:', (action as any).type);
    }
  }

  /**
   * Sincroniza criação de ticket
   */
  private async syncCreateTicket(action: PendingAction): Promise<void> {
    console.log('[OfflineSyncService] Syncing create ticket:', action.localTicketId);

    const ticket = await createTicket(action.data);
    console.log(`[OfflineSyncService] Ticket created on server with ID: ${ticket.id}`);

    // Remover ticket offline local
    if (action.localTicketId) {
      await removeOfflineTicket(action.localTicketId);
    }
  }

  /**
   * Sincroniza atualização de ticket
   */
  private async syncUpdateTicket(action: PendingAction): Promise<void> {
    if (!action.ticketId) {
      throw new Error('Missing ticketId for update action');
    }

    console.log('[OfflineSyncService] Syncing update ticket:', action.ticketId);
    await updateTicket(Number(action.ticketId), action.data);
  }

  /**
   * Sincroniza atualização de status
   */
  private async syncUpdateStatus(action: PendingAction): Promise<void> {
    if (!action.ticketId) {
      throw new Error('Missing ticketId for updateStatus action');
    }

    console.log('[OfflineSyncService] Syncing update status:', action.ticketId, action.data.status);
    await updateTicket(Number(action.ticketId), { status: action.data.status });
  }

  /**
   * Sincroniza adição de comentário
   */
  private async syncAddComment(action: PendingAction): Promise<void> {
    if (!action.ticketId) {
      throw new Error('Missing ticketId for addComment action');
    }

    console.log('[OfflineSyncService] Syncing add comment:', action.ticketId);
    await addComment(Number(action.ticketId), action.data);
  }

  /**
   * Verifica se há ações pendentes
   */
  async hasPendingActions(): Promise<boolean> {
    const actions = await getPendingActions();
    return actions.length > 0;
  }

  /**
   * Obtém contagem de ações pendentes
   */
  async getPendingCount(): Promise<number> {
    const actions = await getPendingActions();
    return actions.length;
  }
}

export default new OfflineSyncService();
