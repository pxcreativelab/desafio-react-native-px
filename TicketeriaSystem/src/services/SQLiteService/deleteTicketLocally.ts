import { openDatabase } from '@/database/database';

/**
 * Deleta um ticket local
 */
export const deleteTicketLocally = async (ticketId: string): Promise<void> => {
  try {
    const db = await openDatabase();
    await db.executeSql('DELETE FROM tickets WHERE id = ? OR localId = ?', [ticketId, ticketId]);
    console.log(`[SQLite] Ticket deleted locally: ${ticketId}`);
  } catch (error) {
    console.error('[SQLite] Error deleting ticket:', error);
    throw error;
  }
};
