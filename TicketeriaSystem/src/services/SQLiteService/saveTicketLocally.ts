import { openDatabase } from '@/database/database';
import { CreateTicketData } from '@services/TicketApi';
import { generateLocalId } from './utils';

/**
 * Salva um ticket localmente
 */
export const saveTicketLocally = async (
  ticket: CreateTicketData & { id?: string | number; createdAt?: string; updatedAt?: string; status?: string; createdBy?: any }
): Promise<string> => {
  try {
    const db = await openDatabase();
    const localId = ticket.id ? String(ticket.id) : generateLocalId();
    const now = new Date().toISOString();

    await db.executeSql(
      `INSERT OR REPLACE INTO tickets 
       (id, title, description, category, priority, status, createdAt, updatedAt, createdBy, isSynced, localId, serverData)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        localId,
        ticket.title || '',
        ticket.description || '',
        ticket.category || '',
        ticket.priority || 'medium',
        ticket.status || 'open',
        ticket.createdAt || now,
        ticket.updatedAt || now,
        ticket.createdBy || '',
        ticket.id ? 1 : 0,
        localId,
        JSON.stringify(ticket),
      ]
    );

    console.log(`[SQLite] Ticket saved locally: ${localId}`);
    return localId;
  } catch (error) {
    console.error('[SQLite] Error saving ticket:', error);
    throw error;
  }
};
