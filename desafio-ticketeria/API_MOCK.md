# 🔌 API Mock para Desenvolvimento

Para testar o sistema de Ticketeria sem depender de uma API real, você pode usar uma das seguintes abordagens:

## Opção 1: JSON Server (Recomendado para Desenvolvimento Rápido)

### 1. Instalar JSON Server

```bash
npm install -g json-server
# ou
yarn global add json-server
```

### 2. Criar arquivo `db.json` na raiz do projeto

```json
{
  "tickets": [
    {
      "id": 1,
      "title": "Erro ao fazer login no sistema",
      "description": "Quando tento fazer login, aparece uma mensagem de erro e não consigo acessar o sistema.",
      "category": "Sistema",
      "priority": "high",
      "status": "open",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": {
        "id": "1",
        "name": "João Silva",
        "email": "joao@example.com"
      },
      "attachments": [],
      "comments": [
        {
          "id": 1,
          "text": "Verificando o problema...",
          "createdAt": "2024-01-15T11:00:00Z",
          "createdBy": {
            "id": "2",
            "name": "Suporte Técnico",
            "email": "suporte@example.com"
          }
        }
      ]
    },
    {
      "id": 2,
      "title": "Solicitação de nova funcionalidade",
      "description": "Gostaria de sugerir a adição de um relatório mensal de vendas.",
      "category": "Feature Request",
      "priority": "medium",
      "status": "in_progress",
      "createdAt": "2024-01-14T14:20:00Z",
      "updatedAt": "2024-01-15T09:15:00Z",
      "createdBy": {
        "id": "3",
        "name": "Maria Santos",
        "email": "maria@example.com"
      },
      "attachments": [],
      "comments": []
    },
    {
      "id": 3,
      "title": "Problema com impressão de relatório",
      "description": "O relatório não está sendo impresso corretamente, as margens estão erradas.",
      "category": "Bug",
      "priority": "low",
      "status": "resolved",
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-12T16:45:00Z",
      "createdBy": {
        "id": "4",
        "name": "Pedro Oliveira",
        "email": "pedro@example.com"
      },
      "attachments": [],
      "comments": [
        {
          "id": 2,
          "text": "Problema resolvido na última atualização.",
          "createdAt": "2024-01-12T16:45:00Z",
          "createdBy": {
            "id": "2",
            "name": "Suporte Técnico",
            "email": "suporte@example.com"
          }
        }
      ]
    }
  ]
}
```

### 3. Iniciar o servidor

```bash
json-server --watch db.json --port 3001
```

### 4. Atualizar a configuração da API temporariamente

No arquivo `src/services/TicketApi.ts`, você pode temporariamente apontar para o JSON Server:

```typescript
// TEMPORÁRIO - apenas para desenvolvimento
const MOCK_API_URL = "http://localhost:3001";

// Ou no Android use:
// const MOCK_API_URL = "http://10.0.2.2:3001";

const api = axios.create({
  baseURL: MOCK_API_URL,
});
```

**Nota:** Para Android, use `10.0.2.2` em vez de `localhost`. Para iOS, `localhost` funciona.

---

## Opção 2: MSW (Mock Service Worker) - Mais Realista

MSW intercepta as requisições HTTP e permite criar mocks mais sofisticados.

### 1. Instalar dependências

```bash
npm install --save-dev msw
# ou
yarn add -D msw
```

### 2. Criar `src/mocks/handlers.ts`

```typescript
import { rest } from "msw";

export const handlers = [
  // Listar tickets
  rest.get("/api/v1/tickets", (req, res, ctx) => {
    const status = req.url.searchParams.get("status");
    const search = req.url.searchParams.get("search");
    const page = parseInt(req.url.searchParams.get("page") || "1");
    const limit = parseInt(req.url.searchParams.get("limit") || "20");

    let tickets = [
      {
        id: 1,
        title: "Erro ao fazer login",
        description: "Descrição do problema...",
        category: "Sistema",
        priority: "high",
        status: "open",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        createdBy: {
          id: "1",
          name: "João Silva",
          email: "joao@example.com",
        },
        attachments: [],
        comments: [],
      },
      // ... mais tickets
    ];

    // Filtrar por status
    if (status) {
      tickets = tickets.filter((t) => t.status === status);
    }

    // Buscar por texto
    if (search) {
      tickets = tickets.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = tickets.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    return res(
      ctx.status(200),
      ctx.json({
        data: tickets.slice(start, end),
        total,
        page,
        limit,
        totalPages,
      })
    );
  }),

  // Buscar ticket por ID
  rest.get("/api/v1/tickets/:id", (req, res, ctx) => {
    const { id } = req.params;
    // Retornar ticket específico
    return res(
      ctx.status(200),
      ctx.json({
        id: Number(id),
        title: "Erro ao fazer login",
        // ... resto dos dados
      })
    );
  }),

  // Criar ticket
  rest.post("/api/v1/tickets", async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(201),
      ctx.json({
        id: Date.now(),
        ...body,
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }),

  // Atualizar ticket
  rest.put("/api/v1/tickets/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();
    return res(
      ctx.status(200),
      ctx.json({
        id: Number(id),
        ...body,
        updatedAt: new Date().toISOString(),
      })
    );
  }),

  // Adicionar comentário
  rest.post("/api/v1/tickets/:id/comments", async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();
    return res(
      ctx.status(201),
      ctx.json({
        id: Date.now(),
        ...body,
        createdAt: new Date().toISOString(),
        createdBy: {
          id: "current-user",
          name: "Usuário Atual",
          email: "user@example.com",
        },
      })
    );
  }),
];
```

### 3. Configurar MSW (em desenvolvimento)

Você precisaria configurar o MSW no início da aplicação. Isso é mais complexo, mas oferece mocks mais realistas.

---

## Opção 3: Serviço de API Mock Online

### Usar serviços como:
- **JSONPlaceholder** (adaptado)
- **MockAPI** (mockapi.io)
- **Reqres** (reqres.in) - adaptado

**Exemplo com MockAPI:**

```typescript
// Criar uma API em mockapi.io e usar:
const MOCK_API_URL = "https://YOUR-PROJECT-ID.mockapi.io/v1";

const api = axios.create({
  baseURL: MOCK_API_URL,
});
```

---

## ⚠️ Importante

1. **Desenvolvimento vs Produção:**
   - Use mocks apenas em desenvolvimento
   - Para produção, apontar para a API real conforme configuração do projeto

2. **Compatibilidade:**
   - JSON Server é mais simples e rápido de configurar
   - MSW é mais realista mas requer mais configuração
   - Escolha baseado no que você está mais confortável

3. **Android:**
   - Lembre-se de usar `10.0.2.2` em vez de `localhost` para Android

4. **Remover Mocks:**
   - Antes de fazer commit/merge, remova ou comente as configurações de mock
   - Certifique-se de que o código funcione com a API real

---

## 🧪 Testando os Endpoints

### Com JSON Server:

```bash
# Listar tickets
curl http://localhost:3001/tickets

# Buscar ticket específico
curl http://localhost:3001/tickets/1

# Criar ticket
curl -X POST http://localhost:3001/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"Novo Ticket","description":"Descrição","category":"Bug","priority":"medium","status":"open"}'

# Atualizar ticket
curl -X PUT http://localhost:3001/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"resolved"}'
```

---

**Recomendação:** Comece com JSON Server para desenvolvimento rápido, depois adapte para a API real quando estiver pronta.

