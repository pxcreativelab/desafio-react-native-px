import api from './Api';

export interface Ticket {
  id: string | number;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
  comments?: Comment[];
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Comment {
  id: string | number;
  text: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Attachment {
  id: string | number;
  name: string;
  url: string;
  type: string;
  size: number;
}

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
  attachments?: any[];
}

// Funções de API
export const fetchTickets = (params?: ListTicketsParams): Promise<ListTicketsResponse> =>
  new Promise((resolve, reject) => {
    api
      .get('/tickets', { params })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log('ERROR fetchTickets -> ', error.response);
        reject(error.message);
      });
  });

export const fetchTicketById = (id: string | number): Promise<Ticket> =>
  new Promise((resolve, reject) => {
    api
      .get(`/tickets/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log('ERROR fetchTicketById -> ', error.response);
        reject(error.message);
      });
  });

export const createTicket = (data: CreateTicketData): Promise<Ticket> =>
  new Promise((resolve, reject) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('priority', data.priority);

    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append('attachments', {
          uri: file.uri,
          type: file.type,
          name: file.name,
        } as any);
      });
    }

    api({
      url: '/tickets',
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log('ERROR createTicket -> ', error.response);
        reject(error.message);
      });
  });

export const updateTicket = (id: string | number, data: Partial<Ticket>): Promise<Ticket> =>
  new Promise((resolve, reject) => {
    api
      .put(`/tickets/${id}`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log('ERROR updateTicket -> ', error.response);
        reject(error.message);
      });
  });

export const addComment = (ticketId: string | number, text: string): Promise<Comment> =>
  new Promise((resolve, reject) => {
    api
      .post(`/tickets/${ticketId}/comments`, { text })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log('ERROR addComment -> ', error.response);
        reject(error.message);
      });
  });

export const uploadAttachment = (ticketId: string | number, file: any): Promise<Attachment> =>
  new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);

    api({
      url: `/tickets/${ticketId}/attachments`,
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log('ERROR uploadAttachment -> ', error.response);
        reject(error.message);
      });
  });
