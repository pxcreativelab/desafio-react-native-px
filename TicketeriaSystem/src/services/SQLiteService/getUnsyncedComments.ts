import { openDatabase } from '@/database/database';
import { LocalComment } from '../../interfaces/Comment';

/**
 * Busca todos os comentários não sincronizados
 */
export const getUnsyncedComments = async (): Promise<LocalComment[]> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql('SELECT * FROM comments WHERE isSynced = 0');

    const comments: LocalComment[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      comments.push({
        id: row.id,
        ticketId: row.ticketId,
        text: row.text,
        createdAt: row.createdAt,
        createdBy: row.createdBy ? JSON.parse(row.createdBy) : { id: '', name: '', email: '' },
        _isSynced: false,
        _localId: row.localId,
      });
    }

    return comments;
  } catch (error) {
    console.error('[SQLite] Error getting unsynced comments:', error);
    throw error;
  }
};
