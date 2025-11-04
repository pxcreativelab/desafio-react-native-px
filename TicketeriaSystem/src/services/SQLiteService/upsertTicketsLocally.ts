import { Ticket } from '@services/TicketApi';
import { saveTicketLocally } from './saveTicketLocally';

/**
 * Upsert (merge) uma lista de tickets vindos do servidor localmente.
 * Salva novos e atualiza existentes.
 */
export const upsertTicketsLocally = async (tickets: Ticket[]): Promise<void> => {
  try {
    if (!tickets || tickets.length === 0) return;

    for (const t of tickets) {
      const ticket = { ...t, _isSynced: true };
      await saveTicketLocally(ticket);
    }

    console.log(`[SQLite] Upserted ${tickets.length} tickets locally`);
  } catch (error) {
    console.error('[SQLite] Error upserting tickets:', error);
    throw error;
  }
};
