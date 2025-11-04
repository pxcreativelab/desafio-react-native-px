import { Attachment } from "./Attachment";
import { Comment } from "./Comment";

export interface Ticket {
  id: number;
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

  _isSynced?: boolean;
}




