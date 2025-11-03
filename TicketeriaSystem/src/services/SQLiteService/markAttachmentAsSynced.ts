import { openDatabase } from '@/database/database';

/**
 * Marca um anexo como sincronizado
 */
export const markAttachmentAsSynced = async (localId: string, serverId: string): Promise<void> => {
  try {
    const db = await openDatabase();
    await db.executeSql(
      'UPDATE attachments SET id = ?, isSynced = 1 WHERE localId = ?',
      [serverId, localId]
    );
    console.log(`[SQLite] Attachment marked as synced: ${localId} -> ${serverId}`);
  } catch (error) {
    console.error('[SQLite] Error marking attachment as synced:', error);
    throw error;
  }
};
