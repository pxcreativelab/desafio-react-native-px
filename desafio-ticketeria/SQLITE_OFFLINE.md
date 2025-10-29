# 💾 SQLite para Modo Offline - Guia de Implementação

Este documento explica como implementar SQLite para um modo offline robusto no sistema de Ticketeria, seguindo os padrões do projeto.

## 📦 Configuração SQLite

### 1. Estrutura das Tabelas

Primeiro, você deve adicionar as tabelas de tickets ao sistema SQLite existente. Crie ou atualize `src/database/sqlite.ts`:

```typescript
// Adicionar ao createTables() em src/database/sqlite.ts

// Tickets Table
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

// Ticket Comments Table
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

// Ticket Attachments Table
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

// Pending Actions Table (para ações offline)
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

try {
  await db.executeSql(createTicketsTableQuery);
  await db.executeSql(createTicketCommentsTableQuery);
  await db.executeSql(createTicketAttachmentsTableQuery);
  await db.executeSql(createPendingActionsTableQuery);
  console.log("Ticket tables created successfully");
} catch (error) {
  console.error("Error creating ticket tables:", error);
  throw error;
}
```

### 2. Criar Operações SQLite

Crie o arquivo `src/database/ticketSqliteOperations.ts`:

```typescript
import SQLite from "react-native-sqlite-storage";
import { Ticket, Comment, Attachment } from "../services/TicketApi";
import { isConnected } from "./sqlite";

// ---- Tickets Operations ----

/**
 * Buscar todos os tickets do SQLite
 */
export const fetchSQLiteTickets = async (
  db: SQLite.SQLiteDatabase,
  filters?: { status?: string; search?: string }
): Promise<Ticket[]> => {
  try {
    let query = "SELECT * FROM Tickets WHERE 1=1";
    const params: any[] = [];

    if (filters?.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    if (filters?.search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += " ORDER BY created_at DESC";

    const results = await db.executeSql(query, params);
    const tickets: Ticket[] = [];

    if (results && results.length > 0) {
      const rows = results[0].rows;
      for (let i = 0; i < rows.length; i++) {
        const row = rows.item(i);
        
        // Buscar comentários
        const comments = await fetchSQLiteComments(db, row.id);
        
        // Buscar anexos
        const attachments = await fetchSQLiteAttachments(db, row.id);

        tickets.push({
          id: row.server_id || row.id,
          title: row.title,
          description: row.description,
          category: row.category,
          priority: row.priority,
          status: row.status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          createdBy: row.created_by_id
            ? {
                id: row.created_by_id,
                name: row.created_by_name,
                email: row.created_by_email,
              }
            : undefined,
          comments,
          attachments,
        });
      }
    }

    return tickets;
  } catch (error) {
    console.error("Error fetching tickets from SQLite:", error);
    throw error;
  }
};

/**
 * Inserir ou atualizar ticket no SQLite
 */
export const insertSQLiteTicket = async (
  db: SQLite.SQLiteDatabase,
  ticket: Ticket,
  syncStatus: "synced" | "pending" = "synced"
): Promise<number> => {
  try {
    await db.executeSql("BEGIN TRANSACTION;");

    const ticketId = typeof ticket.id === "string" ? parseInt(ticket.id) : ticket.id;
    const serverId = syncStatus === "synced" ? ticketId : null;

    await db.executeSql(
      `INSERT OR REPLACE INTO Tickets (
        id, server_id, title, description, category, priority, status,
        created_at, updated_at, created_by_id, created_by_name, created_by_email,
        sync_status, created_at_local
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        ticketId,
        serverId,
        ticket.title,
        ticket.description,
        ticket.category,
        ticket.priority,
        ticket.status,
        ticket.createdAt,
        ticket.updatedAt,
        ticket.createdBy?.id || null,
        ticket.createdBy?.name || null,
        ticket.createdBy?.email || null,
        syncStatus,
        new Date().toISOString(),
      ]
    );

    // Inserir comentários se houver
    if (ticket.comments && ticket.comments.length > 0) {
      for (const comment of ticket.comments) {
        await insertSQLiteComment(db, ticketId, comment, syncStatus);
      }
    }

    // Inserir anexos se houver
    if (ticket.attachments && ticket.attachments.length > 0) {
      for (const attachment of ticket.attachments) {
        await insertSQLiteAttachment(db, ticketId, attachment, syncStatus);
      }
    }

    await db.executeSql("COMMIT;");
    console.log(`Ticket ${ticketId} saved to SQLite successfully`);
    return ticketId;
  } catch (error) {
    await db.executeSql("ROLLBACK;");
    console.error("Error inserting ticket into SQLite:", error);
    throw error;
  }
};

/**
 * Buscar ticket específico do SQLite
 */
export const fetchSQLiteTicketById = async (
  db: SQLite.SQLiteDatabase,
  ticketId: number
): Promise<Ticket | null> => {
  try {
    // Primeiro tentar buscar por server_id
    let results = await db.executeSql(
      "SELECT * FROM Tickets WHERE server_id = ? OR id = ? LIMIT 1;",
      [ticketId, ticketId]
    );

    if (!results || results.length === 0 || results[0].rows.length === 0) {
      return null;
    }

    const row = results[0].rows.item(0);
    const comments = await fetchSQLiteComments(db, row.id);
    const attachments = await fetchSQLiteAttachments(db, row.id);

    return {
      id: row.server_id || row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      priority: row.priority,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by_id
        ? {
            id: row.created_by_id,
            name: row.created_by_name,
            email: row.created_by_email,
          }
        : undefined,
      comments,
      attachments,
    };
  } catch (error) {
    console.error("Error fetching ticket from SQLite:", error);
    return null;
  }
};

// ---- Comments Operations ----

export const fetchSQLiteComments = async (
  db: SQLite.SQLiteDatabase,
  ticketId: number
): Promise<Comment[]> => {
  try {
    const results = await db.executeSql(
      "SELECT * FROM TicketComments WHERE ticket_id = ? ORDER BY created_at DESC;",
      [ticketId]
    );

    const comments: Comment[] = [];
    if (results && results.length > 0) {
      const rows = results[0].rows;
      for (let i = 0; i < rows.length; i++) {
        const row = rows.item(i);
        comments.push({
          id: row.server_id || row.id,
          text: row.text,
          createdAt: row.created_at,
          createdBy: {
            id: row.created_by_id,
            name: row.created_by_name,
            email: row.created_by_email,
          },
        });
      }
    }
    return comments;
  } catch (error) {
    console.error("Error fetching comments from SQLite:", error);
    return [];
  }
};

export const insertSQLiteComment = async (
  db: SQLite.SQLiteDatabase,
  ticketId: number,
  comment: Comment,
  syncStatus: "synced" | "pending" = "synced"
): Promise<void> => {
  try {
    const commentId = typeof comment.id === "string" ? parseInt(comment.id) : comment.id;
    const serverId = syncStatus === "synced" ? commentId : null;

    await db.executeSql(
      `INSERT INTO TicketComments (
        ticket_id, server_id, text, created_by_id, created_by_name, created_by_email,
        created_at, sync_status, created_at_local
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        ticketId,
        serverId,
        comment.text,
        comment.createdBy.id,
        comment.createdBy.name,
        comment.createdBy.email,
        comment.createdAt,
        syncStatus,
        new Date().toISOString(),
      ]
    );
  } catch (error) {
    console.error("Error inserting comment into SQLite:", error);
    throw error;
  }
};

// ---- Attachments Operations ----

export const fetchSQLiteAttachments = async (
  db: SQLite.SQLiteDatabase,
  ticketId: number
): Promise<Attachment[]> => {
  try {
    const results = await db.executeSql(
      "SELECT * FROM TicketAttachments WHERE ticket_id = ?;",
      [ticketId]
    );

    const attachments: Attachment[] = [];
    if (results && results.length > 0) {
      const rows = results[0].rows;
      for (let i = 0; i < rows.length; i++) {
        const row = rows.item(i);
        attachments.push({
          id: row.server_id || row.id,
          name: row.name,
          url: row.server_url || row.local_uri,
          type: row.type,
          size: row.size,
        });
      }
    }
    return attachments;
  } catch (error) {
    console.error("Error fetching attachments from SQLite:", error);
    return [];
  }
};

export const insertSQLiteAttachment = async (
  db: SQLite.SQLiteDatabase,
  ticketId: number,
  attachment: Attachment | { uri: string; type: string; name: string },
  syncStatus: "synced" | "pending" = "synced"
): Promise<void> => {
  try {
    const attachmentId =
      "id" in attachment && attachment.id
        ? typeof attachment.id === "string"
          ? parseInt(attachment.id)
          : attachment.id
        : null;
    const serverId = syncStatus === "synced" && attachmentId ? attachmentId : null;

    await db.executeSql(
      `INSERT INTO TicketAttachments (
        ticket_id, server_id, name, local_uri, server_url, type, size,
        sync_status, created_at_local
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        ticketId,
        serverId,
        attachment.name,
        "uri" in attachment ? attachment.uri : null,
        "url" in attachment ? attachment.url : null,
        attachment.type,
        "size" in attachment ? attachment.size : null,
        syncStatus,
        new Date().toISOString(),
      ]
    );
  } catch (error) {
    console.error("Error inserting attachment into SQLite:", error);
    throw error;
  }
};

// ---- Pending Actions Operations ----

/**
 * Salvar ação pendente para sincronização posterior
 */
export const savePendingAction = async (
  db: SQLite.SQLiteDatabase,
  actionType: "create_ticket" | "update_ticket" | "add_comment" | "upload_attachment",
  ticketId: number | null,
  data: any
): Promise<number> => {
  try {
    const dataJson = JSON.stringify(data);
    const results = await db.executeSql(
      `INSERT INTO PendingTicketActions (action_type, ticket_id, data, status)
       VALUES (?, ?, ?, 'pending')
       RETURNING id;`,
      [actionType, ticketId, dataJson]
    );

    if (results && results.length > 0 && results[0].rows.length > 0) {
      const actionId = results[0].rows.item(0).id;
      console.log(`Pending action ${actionId} saved for ${actionType}`);
      return actionId;
    }
    return -1;
  } catch (error) {
    console.error("Error saving pending action:", error);
    throw error;
  }
};

/**
 * Buscar ações pendentes
 */
export const getPendingActions = async (
  db: SQLite.SQLiteDatabase
): Promise<any[]> => {
  try {
    const results = await db.executeSql(
      "SELECT * FROM PendingTicketActions WHERE status = 'pending' ORDER BY created_at ASC;"
    );

    const actions: any[] = [];
    if (results && results.length > 0) {
      const rows = results[0].rows;
      for (let i = 0; i < rows.length; i++) {
        const row = rows.item(i);
        actions.push({
          id: row.id,
          actionType: row.action_type,
          ticketId: row.ticket_id,
          data: JSON.parse(row.data),
          status: row.status,
          retryCount: row.retry_count,
          createdAt: row.created_at,
        });
      }
    }
    return actions;
  } catch (error) {
    console.error("Error fetching pending actions:", error);
    return [];
  }
};

/**
 * Marcar ação como sincronizada
 */
export const markActionAsSynced = async (
  db: SQLite.SQLiteDatabase,
  actionId: number,
  serverData?: any
): Promise<void> => {
  try {
    await db.executeSql(
      "UPDATE PendingTicketActions SET status = 'synced' WHERE id = ?;",
      [actionId]
    );

    // Se houver dados do servidor, atualizar o ticket local com server_id
    if (serverData && serverData.id) {
      const action = await db.executeSql(
        "SELECT * FROM PendingTicketActions WHERE id = ?;",
        [actionId]
      );

      if (action && action.length > 0 && action[0].rows.length > 0) {
        const row = action[0].rows.item(0);
        const actionData = JSON.parse(row.data);

        if (row.action_type === "create_ticket") {
          // Atualizar ticket local com server_id
          await db.executeSql(
            "UPDATE Tickets SET server_id = ?, sync_status = 'synced' WHERE id = ?;",
            [serverData.id, actionData.id || actionData.server_id]
          );
        }
      }

      // Remover da tabela de pendentes após alguns dias
      await db.executeSql(
        "DELETE FROM PendingTicketActions WHERE status = 'synced' AND created_at < datetime('now', '-7 days');"
      );
    }

    console.log(`Action ${actionId} marked as synced`);
  } catch (error) {
    console.error("Error marking action as synced:", error);
    throw error;
  }
};

/**
 * Atualizar contador de tentativas e erro
 */
export const updatePendingActionRetry = async (
  db: SQLite.SQLiteDatabase,
  actionId: number,
  errorMessage?: string
): Promise<void> => {
  try {
    await db.executeSql(
      `UPDATE PendingTicketActions 
       SET retry_count = retry_count + 1, 
           last_retry_at = CURRENT_TIMESTAMP,
           error_message = ?
       WHERE id = ?;`,
      [errorMessage || null, actionId]
    );
  } catch (error) {
    console.error("Error updating pending action retry:", error);
  }
};

// ---- Sync Operations ----

/**
 * Sincronizar todas as ações pendentes
 */
export const syncPendingActions = async (
  db: SQLite.SQLiteDatabase
): Promise<void> => {
  try {
    const connected = await isConnected();
    if (!connected) {
      console.log("Not connected, skipping sync");
      return;
    }

    const pendingActions = await getPendingActions(db);
    console.log(`Found ${pendingActions.length} pending actions to sync`);

    // Importar funções da API
    const { createTicket, updateTicket, addComment } = await import("../services/TicketApi");

    for (const action of pendingActions) {
      try {
        if (action.retryCount > 5) {
          // Muitas tentativas, marcar como falha permanente
          await db.executeSql(
            "UPDATE PendingTicketActions SET status = 'failed' WHERE id = ?;",
            [action.id]
          );
          continue;
        }

        let serverResponse;

        switch (action.actionType) {
          case "create_ticket":
            serverResponse = await createTicket(action.data);
            await markActionAsSynced(db, action.id, serverResponse);
            break;

          case "update_ticket":
            serverResponse = await updateTicket(action.ticketId, action.data);
            await markActionAsSynced(db, action.id);
            break;

          case "add_comment":
            serverResponse = await addComment(action.ticketId, action.data.text);
            await markActionAsSynced(db, action.id);
            break;

          case "upload_attachment":
            // Implementar upload de anexo
            // await uploadAttachment(action.ticketId, action.data);
            await markActionAsSynced(db, action.id);
            break;
        }

        console.log(`Action ${action.id} synced successfully`);
      } catch (error) {
        console.error(`Error syncing action ${action.id}:`, error);
        await updatePendingActionRetry(
          db,
          action.id,
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  } catch (error) {
    console.error("Error syncing pending actions:", error);
  }
};
```

### 3. Usar SQLite na Lista de Tickets

Exemplo de uso em `src/pages/Ticketeria/index.tsx`:

```typescript
import { getDBConnection } from "../../database/sqlite";
import {
  fetchSQLiteTickets,
  insertSQLiteTicket,
} from "../../database/ticketSqliteOperations";
import { isConnected } from "../../database/sqlite";
import { fetchTickets } from "../../services/TicketApi";

const TicketeriaList = ({ navigation }: NativeStackScreenProps<any>) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const connected = await isConnected();

      if (connected) {
        // Online: buscar da API e salvar no SQLite
        try {
          const response = await fetchTickets({ page: 1, limit: 20 });
          
          // Salvar no SQLite
          const db = await getDBConnection();
          for (const ticket of response.data) {
            await insertSQLiteTicket(db, ticket, "synced");
          }

          setTickets(response.data);
          setIsOffline(false);
        } catch (error) {
          // Se falhar, carregar do SQLite
          const db = await getDBConnection();
          const localTickets = await fetchSQLiteTickets(db);
          setTickets(localTickets);
          setIsOffline(true);
        }
      } else {
        // Offline: carregar do SQLite
        const db = await getDBConnection();
        const localTickets = await fetchSQLiteTickets(db);
        setTickets(localTickets);
        setIsOffline(true);
      }
    } catch (error) {
      console.error("Error loading tickets:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
};
```

### 4. Criar Ticket Offline

```typescript
import { savePendingAction } from "../../database/ticketSqliteOperations";

const handleCreateTicket = async (ticketData: CreateTicketData) => {
  const db = await getDBConnection();
  const connected = await isConnected();

  // Criar ID temporário local
  const tempId = Date.now();

  const ticket: Ticket = {
    id: tempId,
    ...ticketData,
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (connected) {
    // Online: criar na API
    try {
      const serverTicket = await createTicket(ticketData);
      await insertSQLiteTicket(db, serverTicket, "synced");
      return serverTicket;
    } catch (error) {
      // Se falhar, salvar como pendente
      await insertSQLiteTicket(db, ticket, "pending");
      await savePendingAction(db, "create_ticket", tempId, ticketData);
      return ticket;
    }
  } else {
    // Offline: salvar localmente como pendente
    await insertSQLiteTicket(db, ticket, "pending");
    await savePendingAction(db, "create_ticket", tempId, ticketData);
    return ticket;
  }
};
```

### 5. Sincronização Automática

```typescript
import { syncPendingActions } from "../../database/ticketSqliteOperations";
import NetInfo from "@react-native-community/netinfo";

// Hook para detectar mudança de conexão
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected && state.isInternetReachable) {
      // Voltar online: sincronizar pendências
      syncPendingActions();
    }
  });

  return () => unsubscribe();
}, []);
```

---

## 📝 Notas Importantes

1. **Inicialização:**
   - Certifique-se de que as tabelas sejam criadas na inicialização do banco
   - Use o mesmo padrão de `initDatabase()` do projeto

2. **IDs Temporários:**
   - Use IDs temporários (timestamp) para tickets criados offline
   - Atualize com `server_id` após sincronização

3. **Tratamento de Erros:**
   - Limite tentativas de sincronização (ex: 5 tentativas)
   - Salve mensagens de erro para debug

4. **Performance:**
   - Use transações (BEGIN/COMMIT) para operações múltiplas
   - Limpe registros antigos periodicamente

5. **Sincronização:**
   - Sincronize ao voltar online
   - Sincronize periodicamente em background
   - Ofereça opção manual de sincronização

---

## ✅ Checklist de Implementação

- [ ] Tabelas SQLite criadas
- [ ] Operações CRUD implementadas
- [ ] Sistema de pendências funcionando
- [ ] Sincronização automática ao voltar online
- [ ] Tratamento de IDs temporários
- [ ] Limpeza de registros antigos
- [ ] Testado em modo offline
- [ ] Testado sincronização

---

**Siga os padrões do projeto e use `sqliteOperations.ts` como referência!**

