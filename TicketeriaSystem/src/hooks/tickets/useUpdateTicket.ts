import SQLiteService from '@/services/SQLiteService';
import { useToast } from '@hooks/useToast';
import { triggerSync } from '@services/SyncService';
import { Ticket } from '@services/TicketApi';
import { useCallback, useState } from 'react';

/**
 * Hook para atualizar um ticket
 * 
 * @example
 * const { mutate: update, isPending } = useUpdateTicket('123');
 * 
 * const handleUpdate = () => {
 *   update({ status: 'resolved' });
 * };
 */
export const useUpdateTicket = (ticketId: string) => {
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (data: Partial<Ticket>, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
      try {
        setIsPending(true);

        // Atualiza localmente primeiro
        const ticketIdNum = Number(ticketId);
        const currentTicket = await SQLiteService.getTicketByIdLocally(ticketIdNum);
        if (currentTicket) {
          await SQLiteService.updateTicketLocally(ticketIdNum, { ...currentTicket, ...data });
          console.log('[useUpdateTicket] Ticket updated locally, triggering sync...');

          // Acionar sincronização em background
          triggerSync().catch((err: Error) => {
            console.warn('[useUpdateTicket] Background sync failed:', err);
          });
        }

        toast.success('Ticket atualizado com sucesso!');

        if (options?.onSuccess) {
          options.onSuccess();
        }
      } catch (error) {
        toast.error('Não foi possível atualizar o ticket');
        console.error('[useUpdateTicket] Error updating ticket:', error);

        if (options?.onError) {
          options.onError(error as Error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [ticketId, toast]
  );

  return {
    mutate,
    isPending,
  };
};
