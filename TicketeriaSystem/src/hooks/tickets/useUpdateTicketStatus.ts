import SQLiteService from '@/services/SQLiteService';
import { useToast } from '@hooks/useToast';
import { triggerSync } from '@services/SyncService';
import { useCallback, useState } from 'react';

/**
 * Hook para atualizar status do ticket
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
        // Atualiza localmente primeiro
        await SQLiteService.updateTicketLocally(idNum, { status: status as any });
        console.log('[useUpdateTicketStatus] Status updated locally, triggering sync...');

        // Acionar sincronização em background
        triggerSync().catch((err: Error) => {
          console.warn('[useUpdateTicketStatus] Background sync failed:', err);
        });

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
