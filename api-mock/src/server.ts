import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import {
  Comment,
  CreateCommentDTO,
  CreateTicketDTO,
  CreateUserDTO,
  Database,
  LoginDTO,
  LoginResponse,
  PaginatedResponse,
  Ticket,
  UpdateTicketDTO,
  User
} from './types';

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, '../db.json');

// Middlewares
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Delay middleware para simular latência de rede
const delayMiddleware = (req: Request, res: Response, next: NextFunction) => {
  setTimeout(() => next(), 500);
};

app.use(delayMiddleware);

// Helper para ler o banco de dados
const readDatabase = (): Database => {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

// Helper para escrever no banco de dados
const writeDatabase = (data: Database): void => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// GET /api/v1/tickets - Listar tickets com filtros e paginação
app.get('/api/v1/tickets', (req: Request, res: Response) => {
  try {
    const db = readDatabase();
    let tickets = [...db.tickets];

    // Filtros
    const { status, search, sort, page = '1', limit = '20' } = req.query;

    // Filtrar por status
    if (status && typeof status === 'string') {
      tickets = tickets.filter((t) => t.status === status);
    }

    // Filtrar por busca (título ou ID)
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.id.toString().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
      );
    }

    // Ordenação
    const sortBy = typeof sort === 'string' ? sort : 'createdAt_desc';
    if (sortBy === 'createdAt_desc') {
      tickets.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === 'createdAt_asc') {
      tickets.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    // Paginação
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedTickets = tickets.slice(startIndex, endIndex);

    const response: PaginatedResponse<Ticket> = {
      data: paginatedTickets,
      total: tickets.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(tickets.length / limitNum),
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/tickets/:id - Buscar ticket por ID
app.get('/api/v1/tickets/:id', (req: Request, res: Response) => {
  try {
    const db = readDatabase();
    const ticketId = parseInt(req.params.id);
    const ticket = db.tickets.find((t) => t.id === ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/tickets - Criar novo ticket
app.post('/api/v1/tickets', (req: Request, res: Response) => {
  try {
    const db = readDatabase();
    const body: CreateTicketDTO = req.body;

    // Validação
    if (!body.title || body.title.length < 5) {
      return res
        .status(400)
        .json({ error: 'Title must be at least 5 characters' });
    }

    if (!body.description || body.description.length < 10) {
      return res
        .status(400)
        .json({ error: 'Description must be at least 10 characters' });
    }

    if (!body.category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    // Criar novo ticket
    const newTicket: Ticket = {
      id: Math.max(...db.tickets.map((t) => t.id), 0) + 1,
      title: body.title,
      description: body.description,
      category: body.category,
      priority: body.priority || 'medium',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: {
        id: 'current_user',
        name: 'Usuário Atual',
        email: 'usuario@email.com',
      },
      comments: [],
      attachments: [],
    };

    db.tickets.push(newTicket);
    writeDatabase(db);

    res.status(201).json(newTicket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/v1/tickets/:id - Atualizar ticket
app.put('/api/v1/tickets/:id', (req: Request, res: Response) => {
  try {
    const db = readDatabase();
    const ticketId = parseInt(req.params.id);
    const body: UpdateTicketDTO = req.body;

    const ticketIndex = db.tickets.findIndex((t) => t.id === ticketId);

    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Atualizar ticket
    db.tickets[ticketIndex] = {
      ...db.tickets[ticketIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    writeDatabase(db);

    res.json(db.tickets[ticketIndex]);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/tickets/:id - Deletar ticket
app.delete('/api/v1/tickets/:id', (req: Request, res: Response) => {
  try {
    const db = readDatabase();
    const ticketId = parseInt(req.params.id);

    const ticketIndex = db.tickets.findIndex((t) => t.id === ticketId);

    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    db.tickets.splice(ticketIndex, 1);
    writeDatabase(db);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/tickets/:id/comments - Adicionar comentário
app.post('/api/v1/tickets/:id/comments', (req: Request, res: Response) => {
  try {
    const db = readDatabase();
    const ticketId = parseInt(req.params.id);
    const body: CreateCommentDTO = req.body;

    const ticket = db.tickets.find((t) => t.id === ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (!body.text || body.text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const newComment: Comment = {
      id: Date.now(),
      text: body.text,
      createdAt: new Date().toISOString(),
      createdBy: {
        id: 'current_user',
        name: 'Usuário Atual',
        email: 'usuario@email.com',
      },
    };

    ticket.comments.push(newComment);
    ticket.updatedAt = new Date().toISOString();

    writeDatabase(db);

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/tickets/:id/comments - Listar comentários
app.get('/api/v1/tickets/:id/comments', (req: Request, res: Response) => {
  try {
    const db = readDatabase();
    const ticketId = parseInt(req.params.id);

    const ticket = db.tickets.find((t) => t.id === ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/auth/register - Criar novo usuário
app.post('/api/v1/auth/register', (req: Request, res: Response) => {
  try {
    const db = readDatabase();
    const body: CreateUserDTO = req.body;

    // Validação
    if (!body.name || body.name.length < 2) {
      return res
        .status(400)
        .json({ error: 'Name must be at least 2 characters' });
    }

    if (!body.email || !body.email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!body.password || body.password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });
    }

    // Verificar se email já existe
    const existingUser = db.users.find((u) => u.email === body.email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Criar novo usuário
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: body.name,
      email: body.email,
      password: body.password, // Sem criptografia como solicitado
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDatabase(db);

    // Retornar usuário sem senha
    const { password, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/auth/login - Fazer login
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  try {
    const db = readDatabase();
    const body: LoginDTO = req.body;

    // Validação
    if (!body.email || !body.password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Buscar usuário
    const user = db.users.find((u) => u.email === body.email);

    if (!user || user.password !== body.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Retornar usuário e token mock
    const { password, ...userWithoutPassword } = user;
    const response: LoginResponse = {
      user: userWithoutPassword,
      token: `mock_token_${user.id}_${Date.now()}`,
    };

    res.json(response);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/health - Health check
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║   🎫 Ticketeria API Mock Server              ║
║                                              ║
║   Server running on port ${PORT}                ║
║   URL: http://localhost:${PORT}                ║
║                                              ║
║   Endpoints:                                 ║
║   • GET    /api/v1/tickets                   ║
║   • GET    /api/v1/tickets/:id               ║
║   • POST   /api/v1/tickets                   ║
║   • PUT    /api/v1/tickets/:id               ║
║   • DELETE /api/v1/tickets/:id               ║
║   • POST   /api/v1/tickets/:id/comments      ║
║   • GET    /api/v1/tickets/:id/comments      ║
║   • POST   /api/v1/auth/register             ║
║   • POST   /api/v1/auth/login                ║
║   • GET    /api/v1/health                    ║
║                                              ║
║   Database: db.json                          ║
╚══════════════════════════════════════════════╝
  `);
});
