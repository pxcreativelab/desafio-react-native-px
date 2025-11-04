import { openDatabase } from '@/database/database';
import { Ticket } from '@services/TicketApi';

export const saveTicketLocally = async (ticket: Ticket): Promise<number> => {
  const db = await openDatabase();
  const now = new Date().toISOString();

  const idValue = ticket.id ?? null;
  const serverId = (ticket as any).serverId ?? null;

  // Se não tem serverId, é novo e deve ser 'pending'
  // Se tem _isSynced = true, marca como 'synced'
  // Caso contrário, é 'pending'
  const syncStatus = (ticket as any)._isSynced ? 'synced' : 'pending';

  const sql = `INSERT OR REPLACE INTO Tickets (
    id, server_id, title, description, category, priority, status,
    created_at, updated_at, created_by_id, created_by_name, created_by_email, sync_status, created_at_local
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const params = [
    idValue,
    serverId,
    ticket.title || '',
    ticket.description || '',
    ticket.category || '',
    ticket.priority || 'medium',
    ticket.status || 'open',
    ticket.createdAt || now,
    ticket.updatedAt || now,
    ticket.createdBy?.id || null,
    ticket.createdBy?.name || null,
    ticket.createdBy?.email || null,
    syncStatus,
    now,
  ];

  const results = await db.executeSql(sql, params);

  // Try to return a numeric id: prefer provided id, otherwise the inserted id
  const insertId = Array.isArray(results) && results[0] && (results[0] as any).insertId
    ? (results[0] as any).insertId
    : null;

  const returnId = idValue ?? insertId;
  console.log(`[SQLite] Ticket saved locally: id=${returnId}, serverId=${serverId}, sync_status=${syncStatus}, title="${ticket.title}"`);
  return Number(returnId);
};
