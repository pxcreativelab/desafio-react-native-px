import { openDatabase } from '@/database/database';

/**
 * Marca um comentário como sincronizado
 */
export const markCommentAsSynced = async (id: number, serverId: number): Promise<void> => {
  try {
    const db = await openDatabase();
    await db.executeSql(
      'UPDATE TicketComments SET server_id = ?, sync_status = "synced" WHERE id = ?;',
      [serverId, id]
    );
    console.log(`[SQLite] Comment marked as synced: local ${id} -> server ${serverId}`);
  } catch (error) {
    console.error('[SQLite] Error marking comment as synced:', error);
    throw error;
  }
};
