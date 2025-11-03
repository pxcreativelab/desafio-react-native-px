import { openDatabase } from '@/database/database';

export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE';
export type EntityType = 'TICKET' | 'COMMENT' | 'ATTACHMENT';

export interface PendingAction {
  id?: number;
  type: ActionType;
  entityType: EntityType;
  entityId: string;
  data: any;
  createdAt: string;
  attempts: number;
  lastError?: string;
}

/**
 * Adiciona uma ação à fila de sincronização
 */
export const enqueuePendingAction = async (
  type: ActionType,
  entityType: EntityType,
  entityId: string,
  data: any
): Promise<number> => {
  try {
    const db = await openDatabase();
    const now = new Date().toISOString();

    const [result] = await db.executeSql(
      `INSERT INTO pending_actions (type, entityType, entityId, data, createdAt, attempts)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [type, entityType, entityId, JSON.stringify(data), now, 0]
    );

    const actionId = result.insertId;
    console.log(`[OfflineQueue] Action enqueued: ${type} ${entityType} ${entityId} (ID: ${actionId})`);

    return actionId;
  } catch (error) {
    console.error('[OfflineQueue] Error enqueueing action:', error);
    throw error;
  }
};

/**
 * Busca todas as ações pendentes
 */
export const getPendingActions = async (): Promise<PendingAction[]> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM pending_actions ORDER BY createdAt ASC'
    );

    const actions: PendingAction[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      actions.push({
        id: row.id,
        type: row.type as ActionType,
        entityType: row.entityType as EntityType,
        entityId: row.entityId,
        data: JSON.parse(row.data),
        createdAt: row.createdAt,
        attempts: row.attempts,
        lastError: row.lastError,
      });
    }

    console.log(`[OfflineQueue] Found ${actions.length} pending actions`);
    return actions;
  } catch (error) {
    console.error('[OfflineQueue] Error getting pending actions:', error);
    throw error;
  }
};

/**
 * Busca ações pendentes por tipo de entidade
 */
export const getPendingActionsByEntity = async (
  entityType: EntityType
): Promise<PendingAction[]> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM pending_actions WHERE entityType = ? ORDER BY createdAt ASC',
      [entityType]
    );

    const actions: PendingAction[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      actions.push({
        id: row.id,
        type: row.type as ActionType,
        entityType: row.entityType as EntityType,
        entityId: row.entityId,
        data: JSON.parse(row.data),
        createdAt: row.createdAt,
        attempts: row.attempts,
        lastError: row.lastError,
      });
    }

    return actions;
  } catch (error) {
    console.error('[OfflineQueue] Error getting pending actions by entity:', error);
    throw error;
  }
};

/**
 * Remove uma ação da fila após sincronização bem-sucedida
 */
export const removePendingAction = async (actionId: number): Promise<void> => {
  try {
    const db = await openDatabase();
    await db.executeSql('DELETE FROM pending_actions WHERE id = ?', [actionId]);
    console.log(`[OfflineQueue] Action removed: ${actionId}`);
  } catch (error) {
    console.error('[OfflineQueue] Error removing action:', error);
    throw error;
  }
};

/**
 * Atualiza tentativas e erro de uma ação
 */
export const updatePendingActionAttempt = async (
  actionId: number,
  error?: string
): Promise<void> => {
  try {
    const db = await openDatabase();
    await db.executeSql(
      'UPDATE pending_actions SET attempts = attempts + 1, lastError = ? WHERE id = ?',
      [error || null, actionId]
    );
    console.log(`[OfflineQueue] Action attempt updated: ${actionId}`);
  } catch (err) {
    console.error('[OfflineQueue] Error updating action attempt:', err);
    throw err;
  }
};

/**
 * Limpa toda a fila de ações pendentes
 */
export const clearPendingActions = async (): Promise<void> => {
  try {
    const db = await openDatabase();
    await db.executeSql('DELETE FROM pending_actions');
    console.log('[OfflineQueue] All pending actions cleared');
  } catch (error) {
    console.error('[OfflineQueue] Error clearing pending actions:', error);
    throw error;
  }
};

/**
 * Conta quantas ações pendentes existem
 */
export const countPendingActions = async (): Promise<number> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql('SELECT COUNT(*) as count FROM pending_actions');
    const count = results.rows.item(0).count;
    return count;
  } catch (error) {
    console.error('[OfflineQueue] Error counting pending actions:', error);
    throw error;
  }
};

/**
 * Remove ações pendentes antigas com muitas tentativas falhadas
 */
export const cleanupFailedActions = async (maxAttempts = 5): Promise<number> => {
  try {
    const db = await openDatabase();
    const [result] = await db.executeSql(
      'DELETE FROM pending_actions WHERE attempts >= ?',
      [maxAttempts]
    );

    const deleted = result.rowsAffected;
    console.log(`[OfflineQueue] Cleaned up ${deleted} failed actions`);
    return deleted;
  } catch (error) {
    console.error('[OfflineQueue] Error cleaning up failed actions:', error);
    throw error;
  }
};

export default {
  enqueuePendingAction,
  getPendingActions,
  getPendingActionsByEntity,
  removePendingAction,
  updatePendingActionAttempt,
  clearPendingActions,
  countPendingActions,
  cleanupFailedActions,
};
