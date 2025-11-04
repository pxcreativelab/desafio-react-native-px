import { openDatabase } from '@/database/database';
import { Ticket } from '@services/TicketApi';

/**
 * Salva um ticket localmente
 */
export const saveTicketLocally = async (ticket: Ticket): Promise<number> => {
  try {
    const db = await openDatabase();
    const now = new Date().toISOString();

    await db.executeSql(
      `INSERT OR REPLACE INTO tickets 
       (id, title, description, category, priority, status, createdAt, updatedAt, createdBy, isSynced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ticket.id,
        ticket.title || '',
        ticket.description || '',
        ticket.category || '',
        ticket.priority || 'medium',
        ticket.status || 'open',
        ticket.createdAt || now,
        ticket.updatedAt || now,
        ticket.createdBy ? JSON.stringify(ticket.createdBy) : null,
        ticket._isSynced ? 1 : 0,
      ]
    );

    console.log(`[SQLite] Ticket saved locally: ${ticket.id}`);
    return ticket.id;
  } catch (error) {
    console.error('[SQLite] Error saving ticket:', error);
    throw error;
  }
};
