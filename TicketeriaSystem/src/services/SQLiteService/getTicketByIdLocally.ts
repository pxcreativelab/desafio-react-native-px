import { openDatabase } from '@/database/database';
import { Attachment, Comment, Ticket } from '@services/TicketApi';

export const getTicketByIdLocally = async (id: number): Promise<Ticket | null> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM Tickets WHERE id = ?',
      [id]
    );

    if (results.rows.length === 0) {
      return null;
    }

    const row = results.rows.item(0);

    const [commentsResults] = await db.executeSql(
      'SELECT * FROM TicketComments WHERE ticket_id = ? ORDER BY created_at ASC',
      [row.id]
    );
    const comments: Comment[] = [];
    for (let i = 0; i < commentsResults.rows.length; i++) {
      const commentRow = commentsResults.rows.item(i);
      comments.push({
        id: commentRow.id,
        text: commentRow.text,
        createdAt: commentRow.created_at,
        createdBy: commentRow.created_by_id
          ? {
            id: String(commentRow.created_by_id),
            name: commentRow.created_by_name || '',
            email: commentRow.created_by_email || '',
          }
          : { id: '', name: '', email: '' },
      });
    }

    const [attachmentsResults] = await db.executeSql(
      'SELECT * FROM TicketAttachments WHERE ticket_id = ?',
      [row.id]
    );
    const attachments: Attachment[] = [];
    for (let i = 0; i < attachmentsResults.rows.length; i++) {
      const attachmentRow = attachmentsResults.rows.item(i);
      attachments.push({
        id: attachmentRow.id,
        name: attachmentRow.name,
        url: attachmentRow.server_url || attachmentRow.local_uri,
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
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by_id
        ? {
          id: String(row.created_by_id),
          name: row.created_by_name || '',
          email: row.created_by_email || '',
        }
        : undefined,
      comments,
      attachments,
    };
  } catch (error) {
    console.error('[SQLite] Error getting ticket by id:', error);
    throw error;
  }
};
