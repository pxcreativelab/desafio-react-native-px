import { openDatabase } from '@/database/database';
import { Attachment } from '@services/TicketApi';

/**
 * Busca anexos de um ticket
 */
export const getAttachmentsByTicketIdLocally = async (ticketId: string): Promise<Attachment[]> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM attachments WHERE ticketId = ?',
      [ticketId]
    );

    const attachments: Attachment[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      attachments.push({
        id: row.id,
        name: row.name,
        url: row.url,
        type: row.type,
        size: row.size,
      });
    }

    return attachments;
  } catch (error) {
    console.error('[SQLite] Error getting attachments:', error);
    throw error;
  }
};
