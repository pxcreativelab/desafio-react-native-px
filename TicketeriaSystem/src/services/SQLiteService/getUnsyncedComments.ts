import { openDatabase } from '@/database/database';
import { DBTicketComment } from '@/interfaces/database';

export const getUnsyncedComments = async (): Promise<DBTicketComment[]> => {
  const db = await openDatabase();
  const [results] = await db.executeSql("SELECT * FROM TicketComments WHERE sync_status = 'pending'");

  const comments: DBTicketComment[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    comments.push({
      id: row.id,
      ticketId: row.ticket_id,
      text: row.text,
      createdById: row.created_by_id ?? null,
      createdByName: row.created_by_name ?? null,
      createdByEmail: row.created_by_email ?? null,
      createdAt: row.created_at,
      syncStatus: row.sync_status,
      serverId: row.server_id ?? null,
      createdAtLocal: row.created_at_local ?? undefined,
    });
  }

  return comments;
};
