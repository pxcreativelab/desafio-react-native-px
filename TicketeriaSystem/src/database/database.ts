import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

const DATABASE_NAME = 'ticket.db';

let databaseInstance: SQLiteDatabase | null = null;

/**
 * Abre/cria conexão com o banco de dados
 */
export const openDatabase = async (): Promise<SQLiteDatabase> => {
  if (databaseInstance) {
    return databaseInstance;
  }

  try {
    const db = await SQLite.openDatabase({
      name: DATABASE_NAME,
      location: 'default',
    });

    databaseInstance = db;
    await initializeTables(db);

    console.log('[SQLite] Database opened successfully');
    return db;
  } catch (error) {
    console.error('[SQLite] Error opening database:', error);
    throw error;
  }
};

/**
 * Fecha conexão com o banco de dados
 */
export const closeDatabase = async (): Promise<void> => {
  if (databaseInstance) {
    await databaseInstance.close();
    databaseInstance = null;
    console.log('[SQLite] Database closed');
  }
};

/**
 * Inicializa todas as tabelas
 */
const initializeTables = async (db: SQLiteDatabase): Promise<void> => {
  try {
    // Tickets table (from SQLITE_OFFLINE.md)
    const createTicketsTableQuery = `
      CREATE TABLE IF NOT EXISTS Tickets (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        priority TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        created_by_id TEXT,
        created_by_name TEXT,
        created_by_email TEXT,
        sync_status TEXT DEFAULT 'synced',
        server_id INTEGER,
        created_at_local TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Ticket comments table
    const createTicketCommentsTableQuery = `
      CREATE TABLE IF NOT EXISTS TicketComments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        created_by_id TEXT,
        created_by_name TEXT,
        created_by_email TEXT,
        created_at TEXT NOT NULL,
        sync_status TEXT DEFAULT 'synced',
        server_id INTEGER,
        created_at_local TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES Tickets(id)
      );
    `;

    // Ticket attachments table
    const createTicketAttachmentsTableQuery = `
      CREATE TABLE IF NOT EXISTS TicketAttachments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        local_uri TEXT,
        server_url TEXT,
        type TEXT,
        size INTEGER,
        sync_status TEXT DEFAULT 'synced',
        server_id INTEGER,
        created_at_local TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES Tickets(id)
      );
    `;

    // Pending actions table
    const createPendingActionsTableQuery = `
      CREATE TABLE IF NOT EXISTS PendingTicketActions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_type TEXT NOT NULL,
        ticket_id INTEGER,
        data TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        retry_count INTEGER DEFAULT 0,
        error_message TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_retry_at TEXT
      );
    `;

    // Execute table creation
    await db.executeSql(createTicketsTableQuery);
    await db.executeSql(createTicketCommentsTableQuery);
    await db.executeSql(createTicketAttachmentsTableQuery);
    await db.executeSql(createPendingActionsTableQuery);

    // Índices para melhor performance (adaptados aos novos nomes)
    await db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_tickets_status ON Tickets(status);
    `);

    await db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_tickets_sync_status ON Tickets(sync_status);
    `);

    await db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_ticketcomments_ticket ON TicketComments(ticket_id);
    `);

    console.log('[SQLite] Tables initialized successfully');
  } catch (error) {
    console.error('[SQLite] Error initializing tables:', error);
    throw error;
  }
};

/**
 * Limpa todos os dados do banco (útil para desenvolvimento)
 */
export const clearDatabase = async (): Promise<void> => {
  try {
    const db = await openDatabase();

    await db.executeSql('DELETE FROM attachments');
    await db.executeSql('DELETE FROM comments');
    await db.executeSql('DELETE FROM tickets');

    console.log('[SQLite] Database cleared');
  } catch (error) {
    console.error('[SQLite] Error clearing database:', error);
    throw error;
  }
};

/**
 * Dropa todas as tabelas (útil para reset completo)
 */
export const dropTables = async (): Promise<void> => {
  try {
    const db = await openDatabase();

    await db.executeSql('DROP TABLE IF EXISTS attachments');
    await db.executeSql('DROP TABLE IF EXISTS comments');
    await db.executeSql('DROP TABLE IF EXISTS tickets');

    console.log('[SQLite] Tables dropped');

    // Reinicializar
    await initializeTables(db);
  } catch (error) {
    console.error('[SQLite] Error dropping tables:', error);
    throw error;
  }
};

export default {
  openDatabase,
  closeDatabase,
  clearDatabase,
  dropTables,
};
