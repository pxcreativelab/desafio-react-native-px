import { openDatabase } from '@/database/database';

/**
 * Gera um ID local único para entidades offline
 */
const generateLocalId = (): string => {
  return `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// ==================== TICKETS ====================

/**
 * Salva um ticket localmente
 */
export const saveTicketLocally = async (ticket: any): Promise<string> => {
  try {
    const db = await openDatabase();
    const localId = ticket.id || generateLocalId();
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
        ticket.id ? 1 : 0, // Se tem ID do servidor, está sincronizado
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

/**
 * Busca todos os tickets locais
 */
export const getTicketsLocally = async (filters?: {
  status?: string;
  category?: string;
  search?: string;
}): Promise<any[]> => {
  try {
    const db = await openDatabase();
    let query = 'SELECT * FROM tickets WHERE 1=1';
    const params: any[] = [];

    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters?.search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY createdAt DESC';

    const [results] = await db.executeSql(query, params);
    const tickets: any[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      tickets.push({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        priority: row.priority,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        createdBy: row.createdBy,
        comments: [],
        attachments: [],
        _isSynced: row.isSynced === 1,
        _localId: row.localId,
      });
    }

    console.log(`[SQLite] Found ${tickets.length} tickets locally`);
    return tickets;
  } catch (error) {
    console.error('[SQLite] Error getting tickets:', error);
    throw error;
  }
};

/**
 * Busca um ticket específico pelo ID
 */
export const getTicketByIdLocally = async (ticketId: string): Promise<any | null> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM tickets WHERE id = ? OR localId = ?',
      [ticketId, ticketId]
    );

    if (results.rows.length === 0) {
      return null;
    }

    const row = results.rows.item(0);

    // Buscar comentários
    const comments = await getCommentsByTicketIdLocally(row.id);

    // Buscar anexos
    const attachments = await getAttachmentsByTicketIdLocally(row.id);

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      priority: row.priority,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      createdBy: row.createdBy,
      comments,
      attachments,
      _isSynced: row.isSynced === 1,
      _localId: row.localId,
    };
  } catch (error) {
    console.error('[SQLite] Error getting ticket by id:', error);
    throw error;
  }
};

/**
 * Atualiza um ticket local
 */
export const updateTicketLocally = async (
  ticketId: string,
  updates: any
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
    values.push(0); // Marcar como não sincronizado após atualização

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

/**
 * Marca um ticket como sincronizado
 */
export const markTicketAsSynced = async (localId: string, serverId: string): Promise<void> => {
  try {
    const db = await openDatabase();
    await db.executeSql(
      'UPDATE tickets SET id = ?, isSynced = 1 WHERE localId = ?',
      [serverId, localId]
    );
    console.log(`[SQLite] Ticket marked as synced: ${localId} -> ${serverId}`);
  } catch (error) {
    console.error('[SQLite] Error marking ticket as synced:', error);
    throw error;
  }
};

// ==================== COMMENTS ====================

/**
 * Salva um comentário localmente
 */
export const saveCommentLocally = async (comment: any): Promise<string> => {
  try {
    const db = await openDatabase();
    const localId = comment.id || generateLocalId();
    const now = new Date().toISOString();

    await db.executeSql(
      `INSERT OR REPLACE INTO comments 
       (id, ticketId, text, createdAt, createdBy, isSynced, localId)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        localId,
        comment.ticketId || '',
        comment.text || '',
        comment.createdAt || now,
        comment.createdBy || '',
        comment.id ? 1 : 0,
        localId,
      ]
    );

    console.log(`[SQLite] Comment saved locally: ${localId}`);
    return localId;
  } catch (error) {
    console.error('[SQLite] Error saving comment:', error);
    throw error;
  }
};

/**
 * Busca comentários de um ticket
 */
export const getCommentsByTicketIdLocally = async (ticketId: string): Promise<any[]> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM comments WHERE ticketId = ? ORDER BY createdAt ASC',
      [ticketId]
    );

    const comments: any[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      comments.push({
        id: row.id,
        ticketId: row.ticketId,
        text: row.text,
        createdAt: row.createdAt,
        createdBy: row.createdBy,
        _isSynced: row.isSynced === 1,
        _localId: row.localId,
      });
    }

    return comments;
  } catch (error) {
    console.error('[SQLite] Error getting comments:', error);
    throw error;
  }
};

/**
 * Marca um comentário como sincronizado
 */
export const markCommentAsSynced = async (localId: string, serverId: string): Promise<void> => {
  try {
    const db = await openDatabase();
    await db.executeSql(
      'UPDATE comments SET id = ?, isSynced = 1 WHERE localId = ?',
      [serverId, localId]
    );
    console.log(`[SQLite] Comment marked as synced: ${localId} -> ${serverId}`);
  } catch (error) {
    console.error('[SQLite] Error marking comment as synced:', error);
    throw error;
  }
};

// ==================== ATTACHMENTS ====================

/**
 * Salva um anexo localmente
 */
export const saveAttachmentLocally = async (attachment: any): Promise<string> => {
  try {
    const db = await openDatabase();
    const localId = attachment.id || generateLocalId();

    await db.executeSql(
      `INSERT OR REPLACE INTO attachments 
       (id, ticketId, name, url, type, size, localUri, isSynced, localId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        localId,
        attachment.ticketId || '',
        attachment.name || '',
        attachment.url || '',
        attachment.type || '',
        attachment.size || 0,
        attachment.localUri || '',
        attachment.id ? 1 : 0,
        localId,
      ]
    );

    console.log(`[SQLite] Attachment saved locally: ${localId}`);
    return localId;
  } catch (error) {
    console.error('[SQLite] Error saving attachment:', error);
    throw error;
  }
};

/**
 * Busca anexos de um ticket
 */
export const getAttachmentsByTicketIdLocally = async (ticketId: string): Promise<any[]> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM attachments WHERE ticketId = ?',
      [ticketId]
    );

    const attachments: any[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      attachments.push({
        id: row.id,
        ticketId: row.ticketId,
        name: row.name,
        url: row.url,
        type: row.type,
        size: row.size,
        localUri: row.localUri,
        _isSynced: row.isSynced === 1,
        _localId: row.localId,
      });
    }

    return attachments;
  } catch (error) {
    console.error('[SQLite] Error getting attachments:', error);
    throw error;
  }
};

/**
 * Marca um anexo como sincronizado
 */
export const markAttachmentAsSynced = async (localId: string, serverId: string): Promise<void> => {
  try {
    const db = await openDatabase();
    await db.executeSql(
      'UPDATE attachments SET id = ?, isSynced = 1 WHERE localId = ?',
      [serverId, localId]
    );
    console.log(`[SQLite] Attachment marked as synced: ${localId} -> ${serverId}`);
  } catch (error) {
    console.error('[SQLite] Error marking attachment as synced:', error);
    throw error;
  }
};

// ==================== UNSYNCED ====================

/**
 * Busca todos os tickets não sincronizados
 */
export const getUnsyncedTickets = async (): Promise<any[]> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql('SELECT * FROM tickets WHERE isSynced = 0');

    const tickets: any[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      tickets.push({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        priority: row.priority,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        createdBy: row.createdBy,
        comments: [],
        attachments: [],
        _isSynced: false,
        _localId: row.localId,
      });
    }

    return tickets;
  } catch (error) {
    console.error('[SQLite] Error getting unsynced tickets:', error);
    throw error;
  }
};

/**
 * Busca todos os comentários não sincronizados
 */
export const getUnsyncedComments = async (): Promise<any[]> => {
  try {
    const db = await openDatabase();
    const [results] = await db.executeSql('SELECT * FROM comments WHERE isSynced = 0');

    const comments: any[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      comments.push({
        id: row.id,
        ticketId: row.ticketId,
        text: row.text,
        createdAt: row.createdAt,
        createdBy: row.createdBy,
        _isSynced: false,
        _localId: row.localId,
      });
    }

    return comments;
  } catch (error) {
    console.error('[SQLite] Error getting unsynced comments:', error);
    throw error;
  }
};

export default {
  // Tickets
  saveTicketLocally,
  getTicketsLocally,
  getTicketByIdLocally,
  updateTicketLocally,
  deleteTicketLocally,
  markTicketAsSynced,
  getUnsyncedTickets,

  // Comments
  saveCommentLocally,
  getCommentsByTicketIdLocally,
  markCommentAsSynced,
  getUnsyncedComments,

  // Attachments
  saveAttachmentLocally,
  getAttachmentsByTicketIdLocally,
  markAttachmentAsSynced,
};
