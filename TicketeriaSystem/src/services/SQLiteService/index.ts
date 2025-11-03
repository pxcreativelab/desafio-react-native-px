// Utils
export { generateLocalId } from './utils';

// Tickets
export { bulkUpsertTickets } from './bulkUpsertTickets';
export { deleteTicketLocally } from './deleteTicketLocally';
export { getTicketByIdLocally } from './getTicketByIdLocally';
export { getTicketsLocally } from './getTicketsLocally';
export { getUnsyncedTickets } from './getUnsyncedTickets';
export { markTicketAsSynced } from './markTicketAsSynced';
export { saveTicketLocally } from './saveTicketLocally';
export { updateTicketLocally } from './updateTicketLocally';
export { upsertTicketsLocally } from './upsertTicketsLocally';

// Comments
export { getCommentsByTicketIdLocally } from './getCommentsByTicketIdLocally';
export { getUnsyncedComments } from './getUnsyncedComments';
export { markCommentAsSynced } from './markCommentAsSynced';
export { saveCommentLocally } from './saveCommentLocally';

// Attachments
export { getAttachmentsByTicketIdLocally } from './getAttachmentsByTicketIdLocally';
export { markAttachmentAsSynced } from './markAttachmentAsSynced';
export { saveAttachmentLocally } from './saveAttachmentLocally';

// Import for default export
import { bulkUpsertTickets } from './bulkUpsertTickets';
import { deleteTicketLocally } from './deleteTicketLocally';
import { getAttachmentsByTicketIdLocally } from './getAttachmentsByTicketIdLocally';
import { getCommentsByTicketIdLocally } from './getCommentsByTicketIdLocally';
import { getTicketByIdLocally } from './getTicketByIdLocally';
import { getTicketsLocally } from './getTicketsLocally';
import { getUnsyncedComments } from './getUnsyncedComments';
import { getUnsyncedTickets } from './getUnsyncedTickets';
import { markAttachmentAsSynced } from './markAttachmentAsSynced';
import { markCommentAsSynced } from './markCommentAsSynced';
import { markTicketAsSynced } from './markTicketAsSynced';
import { saveAttachmentLocally } from './saveAttachmentLocally';
import { saveCommentLocally } from './saveCommentLocally';
import { saveTicketLocally } from './saveTicketLocally';
import { updateTicketLocally } from './updateTicketLocally';
import { upsertTicketsLocally } from './upsertTicketsLocally';

// Default export for compatibility
export default {
  // Tickets
  saveTicketLocally,
  getTicketsLocally,
  getTicketByIdLocally,
  updateTicketLocally,
  deleteTicketLocally,
  markTicketAsSynced,
  getUnsyncedTickets,
  bulkUpsertTickets,
  upsertTicketsLocally,

  // Comments
  saveCommentLocally,
  getCommentsByTicketIdLocally,
  markCommentAsSynced,
  getUnsyncedComments,

  // Attachments
  saveAttachmentLocally,
  getAttachmentsByTicketIdLocally,
  markAttachmentAsSynced,
};
