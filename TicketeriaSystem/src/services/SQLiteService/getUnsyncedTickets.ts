import { openDatabase } from '@/database/database';
import { Ticket } from '@services/TicketApi';
import { LocalTicket } from '../../interfaces/Ticket';

/**
 * Busca todos os tickets não sincronizados
 */
export const getUnsyncedTickets = async (): Promise<LocalTicket[]> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql('SELECT * FROM tickets WHERE isSynced = 0');

    const tickets: LocalTicket[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      tickets.push({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        priority: row.priority as Ticket['priority'],
        status: row.status as Ticket['status'],
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        createdBy: row.createdBy ? JSON.parse(row.createdBy) : undefined,
        comments: [],
        attachments: [],
        _isSynced: false,
        _localId: row.localId,
      });
    }

    return tickets;
  } catch (error) {
    console.error('[SQLite] Error getting unsynced tickets:', error);
    throw error;
  }
};
