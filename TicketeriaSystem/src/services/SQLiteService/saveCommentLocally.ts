import { openDatabase } from '@/database/database';
import { Comment } from '@services/TicketApi';

export const saveCommentLocally = async (
  comment: Partial<Comment> & { ticketId: string | number; text: string }
): Promise<number> => {
  try {
    const db = await openDatabase();
    const now = new Date().toISOString();
    const ticketIdNum = Number(comment.ticketId);

    const createdBy = comment.createdBy || { id: null, name: null, email: null };

    const sql = `INSERT INTO TicketComments (
      ticket_id, text, created_by_id, created_by_name, created_by_email, created_at, sync_status, created_at_local
    ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?);`;

    const params = [
      ticketIdNum,
      comment.text || '',
      createdBy.id || null,
      createdBy.name || null,
      createdBy.email || null,
      comment.createdAt || now,
      now,
    ];

    const results = await db.executeSql(sql, params);
    const insertId = Array.isArray(results) && results[0] && (results[0] as any).insertId
      ? Number((results[0] as any).insertId)
      : -1;

    console.log(`[SQLite] Comment saved locally: ${insertId}`);
    return insertId;
  } catch (error) {
    console.error('[SQLite] Error saving comment:', error);
    throw error;
  }
};
