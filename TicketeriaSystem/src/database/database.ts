import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

// Habilitar debug (opcional)
SQLite.DEBUG(false);
SQLite.enablePromise(true);

const DATABASE_NAME = 'ticketeria.db';
const DATABASE_VERSION = '1.0';
const DATABASE_DISPLAY_NAME = 'Ticketeria Database';
const DATABASE_SIZE = 200000;

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
    // Tabela de Tickets
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        priority TEXT NOT NULL,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        createdBy TEXT,
        isSynced INTEGER DEFAULT 0,
        localId TEXT,
        serverData TEXT
      );
    `);

    // Tabela de Comentários
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        ticketId TEXT NOT NULL,
        text TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        createdBy TEXT,
        isSynced INTEGER DEFAULT 0,
        localId TEXT,
        FOREIGN KEY (ticketId) REFERENCES tickets(id) ON DELETE CASCADE
      );
    `);

    // Tabela de Anexos
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS attachments (
        id TEXT PRIMARY KEY,
        ticketId TEXT NOT NULL,
        name TEXT NOT NULL,
        url TEXT,
        type TEXT NOT NULL,
        size INTEGER NOT NULL,
        localUri TEXT,
        isSynced INTEGER DEFAULT 0,
        localId TEXT,
        FOREIGN KEY (ticketId) REFERENCES tickets(id) ON DELETE CASCADE
      );
    `);

    // Tabela de Ações Pendentes (Fila de Sincronização)
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS pending_actions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        entityType TEXT NOT NULL,
        entityId TEXT NOT NULL,
        data TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        attempts INTEGER DEFAULT 0,
        lastError TEXT
      );
    `);

    // Índices para melhor performance
    await db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
    `);

    await db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_tickets_synced ON tickets(isSynced);
    `);

    await db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_comments_ticket ON comments(ticketId);
    `);

    await db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_pending_actions_type ON pending_actions(type);
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

    await db.executeSql('DELETE FROM pending_actions');
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

    await db.executeSql('DROP TABLE IF EXISTS pending_actions');
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
