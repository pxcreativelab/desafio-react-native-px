export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
}

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  createdBy: User;
}

export interface Attachment {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  comments: Comment[];
  attachments: Attachment[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Database {
  tickets: Ticket[];
  users: User[];
}

export interface CreateTicketDTO {
  id?: number;
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UpdateTicketDTO {
  title?: string;
  description?: string;
  category?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
}

export interface CreateCommentDTO {
  text: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
