// Tipos estendidos para incluir campos do SQLite

import { Attachment as ApiAttachment, Ticket as ApiTicket } from '@services/TicketApi';

/**
 * Ticket com campos adicionais do SQLite
 */
export interface LocalTicket extends Omit<ApiTicket, 'id' | 'createdBy'> {
  id: string;
  createdBy?: string;
  _isSynced?: boolean;
  _localId?: string;
}

/**
 * Comment com campos adicionais do SQLite
 */
export interface LocalComment {
  id: string;
  ticketId: string;
  text: string;
  createdAt: string;
  createdBy?: string;
  _isSynced?: boolean;
  _localId?: string;
}

/**
 * Attachment com campos adicionais do SQLite
 */
export interface LocalAttachment extends Omit<ApiAttachment, 'id'> {
  id: string;
  ticketId: string;
  localUri?: string;
  _isSynced?: boolean;
  _localId?: string;
}

/**
 * Ação pendente na fila de sincronização
 */
export interface PendingAction {
  id: number;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'TICKET' | 'COMMENT' | 'ATTACHMENT';
  entityId: string;
  data: any;
  createdAt: string;
  attempts: number;
  lastError?: string;
}
