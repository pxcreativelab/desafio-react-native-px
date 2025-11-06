import { Ticket } from "./Ticket";

export interface ListTicketsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort?: string;
}

export interface ListTicketsResponse {
  data: Ticket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTicketData {
  title: string;
  description: string;
  category: string;
  priority: string;
  status?: string
  createdAt?: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateCommentData {
  text: string;
  createdAt?: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}