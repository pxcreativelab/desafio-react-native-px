export interface Comment {
  id: number | string;
  text: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LocalComment extends Comment {
  ticketId: string;
  _isSynced?: boolean;
  _localId?: string;
}