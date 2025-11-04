import { openDatabase } from '@/database/database';
import { DBPendingTicketAction } from '@/interfaces/database';

export const getPendingActions = async (): Promise<DBPendingTicketAction[]> => {
  const db = await openDatabase();
  const [results] = await db.executeSql("SELECT * FROM PendingTicketActions ORDER BY created_at ASC;");

  const actions: DBPendingTicketAction[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    actions.push({
      id: row.id,
      actionType: row.action_type,
      ticketId: row.ticket_id ?? null,
      data: row.data ? JSON.parse(row.data) : null,
      status: row.status,
      retryCount: row.retry_count ?? 0,
      errorMessage: row.error_message ?? null,
      createdAt: row.created_at ?? undefined,
      lastRetryAt: row.last_retry_at ?? null,
    });
  }

  return actions;
};

export default getPendingActions;
