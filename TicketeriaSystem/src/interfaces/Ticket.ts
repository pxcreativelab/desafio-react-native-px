import { Attachment } from "./Attachment";
import { Comment } from "./Comment";

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


// Interfaces para dados locais (com propriedades adicionais)
export interface LocalTicket extends Ticket {
  _isSynced?: boolean;
  _localId?: string;
}




