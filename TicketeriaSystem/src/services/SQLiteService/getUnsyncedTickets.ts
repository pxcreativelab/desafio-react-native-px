import { openDatabase } from '@/database/database';
import { DBTicket } from '@/interfaces/database';

export const getUnsyncedTickets = async (): Promise<DBTicket[]> => {
  const db = await openDatabase();
  const [results] = await db.executeSql("SELECT * FROM Tickets WHERE sync_status = 'pending'");

  const tickets: DBTicket[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    tickets.push({
      id: row.id,
      serverId: row.server_id ?? null,
      title: row.title,
      description: row.description,
      category: row.category,
      priority: row.priority,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdById: row.created_by_id ?? null,
      createdByName: row.created_by_name ?? null,
      createdByEmail: row.created_by_email ?? null,
      syncStatus: row.sync_status,
      createdAtLocal: row.created_at_local ?? undefined,
    });
  }

  return tickets;
};
