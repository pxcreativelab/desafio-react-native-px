import { useToast } from '@hooks/useToast';
import { Ticket, updateTicket } from '@services/TicketApi';
import { useCallback, useState } from 'react';

/**
 * Hook para atualizar um ticket
 * Atualiza direto na API
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

        // Atualiza direto na API
        const ticketIdNum = Number(ticketId);
        await updateTicket(ticketIdNum, data);
        console.log('[useUpdateTicket] Ticket updated successfully');

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
