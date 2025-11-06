export interface Attachment {
  id: string | number;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface LocalAttachment extends Attachment {
  ticketId: string;
  localUri?: string;
  _isSynced?: boolean;
  _localId?: string;
}