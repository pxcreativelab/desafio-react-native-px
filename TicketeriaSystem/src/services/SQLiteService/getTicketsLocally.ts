import { openDatabase } from '@/database/database';
import { Ticket } from '@services/TicketApi';

/**
 * Busca todos os tickets locais
 */
export const getTicketsLocally = async (filters?: {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: Ticket[]; total: number }> => {
  try {
    const db = await openDatabase();
    let where = 'WHERE 1=1';
    const params: any[] = [];

    if (filters?.status) {
      where += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.category) {
      where += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters?.search) {
      where += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const countQuery = `SELECT COUNT(*) as cnt FROM Tickets ${where}`;
    const [countResults] = await db.executeSql(countQuery, params);
    const total = countResults.rows.length > 0 ? countResults.rows.item(0).cnt : 0;

    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : 50;
    const offset = (page - 1) * limit;

    const query = `SELECT * FROM Tickets ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const queryParams = params.concat([limit, offset]);

    const [results] = await db.executeSql(query, queryParams);
    const tickets: Ticket[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      tickets.push({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        priority: row.priority as Ticket['priority'],
        status: row.status as Ticket['status'],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by_id
          ? {
            id: String(row.created_by_id),
            name: row.created_by_name || '',
            email: row.created_by_email || '',
          }
          : undefined,
        comments: [],
        attachments: [],

        serverId: row.server_id || undefined,
        syncStatus: row.sync_status as Ticket['syncStatus'],
      });
    }

    return { items: tickets, total };
  } catch (error) {
    console.error('[SQLite] Error getting tickets:', error);
    return { items: [], total: 0 };
  }
};
