import { openDatabase } from '@/database/database';
import { Attachment } from '@services/TicketApi';
import { generateLocalId } from './utils';

/**
 * Salva um anexo localmente
 */
export const saveAttachmentLocally = async (
  attachment: Partial<Attachment> & { ticketId: string; name: string; localUri?: string }
): Promise<string> => {
  try {
    const db = await openDatabase();
    const localId = attachment.id ? String(attachment.id) : generateLocalId();

    await db.executeSql(
      `INSERT OR REPLACE INTO attachments 
       (id, ticketId, name, url, type, size, localUri, isSynced, localId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        localId,
        attachment.ticketId || '',
        attachment.name || '',
        attachment.url || '',
        attachment.type || '',
        attachment.size || 0,
        attachment.localUri || '',
        attachment.id ? 1 : 0,
        localId,
      ]
    );

    console.log(`[SQLite] Attachment saved locally: ${localId}`);
    return localId;
  } catch (error) {
    console.error('[SQLite] Error saving attachment:', error);
    throw error;
  }
};
