export type SyncStatus = 'synced' | 'pending'

export interface DBTicket {
  id: number;
  serverId?: number | null;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdById?: string | null;
  createdByName?: string | null;
  createdByEmail?: string | null;
  syncStatus?: SyncStatus;
  createdAtLocal?: string;
}

export interface DBTicketComment {
  id: number;
  ticketId: number;
  text: string;
  createdById?: string | null;
  createdByName?: string | null;
  createdByEmail?: string | null;
  createdAt: string;
  syncStatus?: SyncStatus;
  serverId?: number | null;
  createdAtLocal?: string;
}

export interface DBTicketAttachment {
  id: number;
  ticketId: number;
  name: string;
  localUri?: string | null;
  serverUrl?: string | null;
  type?: string | null;
  size?: number | null;
  syncStatus?: SyncStatus;
  serverId?: number | null;
  createdAtLocal?: string;
}

export type PendingActionType =
  | 'create_ticket'
  | 'update_ticket'
  | 'add_comment'
  | 'upload_attachment'
  | string;

export interface DBPendingTicketAction {
  id: number;
  actionType: PendingActionType;
  ticketId?: number | null;
  data: any;
  status?: 'pending' | 'synced' | 'failed' | string;
  retryCount?: number;
  errorMessage?: string | null;
  createdAt?: string;
  lastRetryAt?: string | null;
}

export type DBTypes = {
  Ticket: DBTicket;
  TicketComment: DBTicketComment;
  TicketAttachment: DBTicketAttachment;
  PendingAction: DBPendingTicketAction;
};

export default {} as unknown as DBTypes;
