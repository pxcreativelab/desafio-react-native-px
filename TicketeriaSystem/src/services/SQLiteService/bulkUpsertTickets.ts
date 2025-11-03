import { openDatabase } from '@/database/database';
import { Ticket } from '@services/TicketApi';

/**
 * Faz bulk upsert de tickets vindos do servidor (salva novos, atualiza existentes)
 */
export const bulkUpsertTickets = async (tickets: Ticket[]): Promise<void> => {
  if (!tickets || tickets.length === 0) return;

  try {
    const db = await openDatabase();
    const now = new Date().toISOString();

    for (const ticket of tickets) {
      const ticketId = ticket.id;
      const localId = ticket.id;

      await db.executeSql(
        `INSERT OR REPLACE INTO tickets 
         (id, title, description, category, priority, status, createdAt, updatedAt, createdBy, isSynced, localId, serverData)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ticketId,
          ticket.title || '',
          ticket.description || '',
          ticket.category || '',
          ticket.priority || 'medium',
          ticket.status || 'open',
          ticket.createdAt || now,
          ticket.updatedAt || now,
          JSON.stringify(ticket.createdBy || {}),
          1,
          localId,
          JSON.stringify(ticket),
        ]
      );
    }

    console.log(`[SQLite] Bulk upserted ${tickets.length} tickets from server`);
  } catch (error) {
    console.error('[SQLite] Error bulk upserting tickets:', error);
    throw error;
  }
};
