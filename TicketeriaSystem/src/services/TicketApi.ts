import { CreateCommentData, CreateTicketData, ListTicketsParams, ListTicketsResponse } from '@/interfaces/Api';
import { Attachment } from '@/interfaces/Attachment';
import { Comment } from '@/interfaces/Comment';
import { Ticket } from '@/interfaces/Ticket';

import api from './Api';

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
    api.post('/tickets', data)
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

export const addComment = (ticketId: string | number, data: CreateCommentData): Promise<Comment> =>
  new Promise((resolve, reject) => {
    api
      .post(`/tickets/${ticketId}/comments`, data)
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

// Re-export interfaces para compatibilidade
export type { Attachment, Comment, CreateTicketData, ListTicketsParams, ListTicketsResponse, Ticket };

