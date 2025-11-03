import { openDatabase } from '@/database/database';

/**
 * Marca um comentário como sincronizado
 */
export const markCommentAsSynced = async (localId: string, serverId: string): Promise<void> => {
  try {
    const db = await openDatabase();
    await db.executeSql(
      'UPDATE comments SET id = ?, isSynced = 1 WHERE localId = ?',
      [serverId, localId]
    );
    console.log(`[SQLite] Comment marked as synced: ${localId} -> ${serverId}`);
  } catch (error) {
    console.error('[SQLite] Error marking comment as synced:', error);
    throw error;
  }
};
