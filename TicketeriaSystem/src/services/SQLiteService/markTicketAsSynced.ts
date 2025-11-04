import { openDatabase } from '@/database/database';

/**
 * Marca um ticket como sincronizado
 */
export const markTicketAsSynced = async (id: number, serverId: number): Promise<void> => {
  try {
    const db = await openDatabase();
    await db.executeSql(
      'UPDATE Tickets SET server_id = ?, sync_status = "synced" WHERE id = ?;',
      [serverId, id]
    );
    console.log(`[SQLite] Ticket marked as synced: local ${id} -> server ${serverId}`);
  } catch (error) {
    console.error('[SQLite] Error marking ticket as synced:', error);
    throw error;
  }
};
