import { useToast } from '@hooks/useToast';
import { updateTicket } from '@services/TicketApi';
import { useCallback, useState } from 'react';

/**
 * Hook para atualizar status do ticket
 * Atualiza direto na API
 * 
 * @example
 * const { mutate: updateStatus, isPending } = useUpdateTicketStatus('123');
 * 
 * const handleResolve = () => {
 *   updateStatus('resolved');
 * };
 */
export const useUpdateTicketStatus = (ticketId: string | number) => {
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (status: string, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
      try {
        setIsPending(true);

        const idNum = Number(ticketId);
        // Atualiza direto na API
        await updateTicket(idNum, { status: status as any });
        console.log('[useUpdateTicketStatus] Status updated successfully');

        toast.success('Status atualizado com sucesso!');

        if (options?.onSuccess) {
          options.onSuccess();
        }
      } catch (error) {
        toast.error('Não foi possível atualizar o status');
        console.error('[useUpdateTicketStatus] Error updating status:', error);

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
