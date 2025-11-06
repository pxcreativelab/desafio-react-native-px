import { addPendingAction, isOfflineTicket, updateOfflineTicket } from '@/helpers/ticketStorage';
import { useSyncStatus } from '@hooks/useSync';
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
  const { isOnline } = useSyncStatus();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (status: string, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
      try {
        setIsPending(true);

        const idNum = Number(ticketId);
        const isOffline = isOfflineTicket(ticketId);

        if (isOnline && !isOffline) {
          // ONLINE: Atualiza direto na API
          await updateTicket(idNum, { status: status as any });
          console.log('[useUpdateTicketStatus] Status updated successfully');

          toast.success('Status atualizado com sucesso!');
        } else {
          // OFFLINE: Atualiza localmente e adiciona à fila
          await updateOfflineTicket(ticketId, { status: status as any });

          // Adicionar à fila de sincronização
          await addPendingAction({
            type: 'updateStatus',
            ticketId,
            data: { status },
          });

          console.log('[useUpdateTicketStatus] Status updated offline:', ticketId);
          toast.success('Status alterado offline. Será sincronizado quando conectar!');
        }

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
    [ticketId, toast, isOnline]
  );

  return {
    mutate,
    isPending,
  };
};
