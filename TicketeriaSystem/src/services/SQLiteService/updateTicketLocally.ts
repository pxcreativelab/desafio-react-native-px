import { openDatabase } from '@/database/database';
import { Ticket } from '@services/TicketApi';

/**
 * Atualiza um ticket local
 */
export const updateTicketLocally = async (
  ticketId: number,
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

    if (updates.createdBy) {
      setters.push('created_by_id = ?', 'created_by_name = ?', 'created_by_email = ?');
      values.push(updates.createdBy.id || null, updates.createdBy.name || null, updates.createdBy.email || null);
    }

    setters.push('updated_at = ?');
    values.push(now);

    setters.push("sync_status = 'pending'");

    // WHERE placeholders
    values.push(ticketId, ticketId);

    const sql = `UPDATE Tickets SET ${setters.join(', ')} WHERE id = ? OR server_id = ?;`;
    await db.executeSql(sql, values);

    console.log(`[SQLite] Ticket updated locally: ${ticketId}`);
  } catch (error) {
    console.error('[SQLite] Error updating ticket:', error);
    throw error;
  }
};
