import { openDatabase } from '@/database/database';
import { Comment } from '@services/TicketApi';

/**
 * Busca comentários de um ticket
 */
export const getCommentsByTicketIdLocally = async (ticketId: string): Promise<Comment[]> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM comments WHERE ticketId = ? ORDER BY createdAt ASC',
      [ticketId]
    );

    const comments: Comment[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      comments.push({
        id: row.id,
        text: row.text,
        createdAt: row.createdAt,
        createdBy: row.createdBy ? JSON.parse(row.createdBy) : { id: '', name: '', email: '' },
      });
    }

    return comments;
  } catch (error) {
    console.error('[SQLite] Error getting comments:', error);
    throw error;
  }
};
