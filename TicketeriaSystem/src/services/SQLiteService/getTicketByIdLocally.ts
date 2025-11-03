import { openDatabase } from '@/database/database';
import { Attachment, Comment, Ticket } from '@services/TicketApi';

/**
 * Busca um ticket específico pelo ID
 */
export const getTicketByIdLocally = async (ticketId: string): Promise<Ticket | null> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM tickets WHERE id = ? OR localId = ?',
      [ticketId, ticketId]
    );

    if (results.rows.length === 0) {
      return null;
    }

    const row = results.rows.item(0);

    // Buscar comentários
    const [commentsResults] = await db.executeSql(
      'SELECT * FROM comments WHERE ticketId = ? ORDER BY createdAt ASC',
      [row.id]
    );
    const comments: Comment[] = [];
    for (let i = 0; i < commentsResults.rows.length; i++) {
      const commentRow = commentsResults.rows.item(i);
      comments.push({
        id: commentRow.id,
        text: commentRow.text,
        createdAt: commentRow.createdAt,
        createdBy: commentRow.createdBy ? JSON.parse(commentRow.createdBy) : { id: '', name: '', email: '' },
      });
    }

    // Buscar anexos
    const [attachmentsResults] = await db.executeSql(
      'SELECT * FROM attachments WHERE ticketId = ?',
      [row.id]
    );
    const attachments: Attachment[] = [];
    for (let i = 0; i < attachmentsResults.rows.length; i++) {
      const attachmentRow = attachmentsResults.rows.item(i);
      attachments.push({
        id: attachmentRow.id,
        name: attachmentRow.name,
        url: attachmentRow.url,
        type: attachmentRow.type,
        size: attachmentRow.size,
      });
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      priority: row.priority as Ticket['priority'],
      status: row.status as Ticket['status'],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      createdBy: row.createdBy ? JSON.parse(row.createdBy) : undefined,
      comments,
      attachments,
    };
  } catch (error) {
    console.error('[SQLite] Error getting ticket by id:', error);
    throw error;
  }
};
