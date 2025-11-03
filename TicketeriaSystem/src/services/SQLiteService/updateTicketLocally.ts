import { openDatabase } from '@/database/database';
import { Ticket } from '@services/TicketApi';

/**
 * Atualiza um ticket local
 */
export const updateTicketLocally = async (
  ticketId: string,
  updates: Partial<Ticket>
): Promise<void> => {
  try {
    const db = await openDatabase();
    const now = new Date().toISOString();

    const setters: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      setters.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      setters.push('description = ?');
      values.push(updates.description);
    }
    if (updates.category !== undefined) {
      setters.push('category = ?');
      values.push(updates.category);
    }
    if (updates.priority !== undefined) {
      setters.push('priority = ?');
      values.push(updates.priority);
    }
    if (updates.status !== undefined) {
      setters.push('status = ?');
      values.push(updates.status);
    }

    setters.push('updatedAt = ?');
    values.push(now);

    setters.push('isSynced = ?');
    values.push(0);

    values.push(ticketId, ticketId);

    await db.executeSql(
      `UPDATE tickets SET ${setters.join(', ')} WHERE id = ? OR localId = ?`,
      values
    );

    console.log(`[SQLite] Ticket updated locally: ${ticketId}`);
  } catch (error) {
    console.error('[SQLite] Error updating ticket:', error);
    throw error;
  }
};
