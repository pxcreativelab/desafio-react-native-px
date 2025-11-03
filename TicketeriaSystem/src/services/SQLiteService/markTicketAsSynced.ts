import { openDatabase } from '@/database/database';

/**
 * Marca um ticket como sincronizado
 */
export const markTicketAsSynced = async (localId: string, serverId: string): Promise<void> => {
  try {
    const db = await openDatabase();
    await db.executeSql(
      'UPDATE tickets SET id = ?, isSynced = 1 WHERE localId = ?',
      [serverId, localId]
    );
    console.log(`[SQLite] Ticket marked as synced: ${localId} -> ${serverId}`);
  } catch (error) {
    console.error('[SQLite] Error marking ticket as synced:', error);
    throw error;
  }
};
