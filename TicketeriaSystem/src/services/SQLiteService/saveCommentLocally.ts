import { openDatabase } from '@/database/database';
import { Comment } from '@services/TicketApi';
import { generateLocalId } from './utils';

/**
 * Salva um comentário localmente
 */
export const saveCommentLocally = async (
  comment: Partial<Comment> & { ticketId: string; text: string }
): Promise<string> => {
  try {
    const db = await openDatabase();
    const localId = comment.id ? String(comment.id) : generateLocalId();
    const now = new Date().toISOString();

    await db.executeSql(
      `INSERT OR REPLACE INTO comments 
       (id, ticketId, text, createdAt, createdBy, isSynced, localId)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        localId,
        comment.ticketId || '',
        comment.text || '',
        comment.createdAt || now,
        comment.createdBy || '',
        comment.id ? 1 : 0,
        localId,
      ]
    );

    console.log(`[SQLite] Comment saved locally: ${localId}`);
    return localId;
  } catch (error) {
    console.error('[SQLite] Error saving comment:', error);
    throw error;
  }
};
