import AsyncStorageCache from '@/helpers/AsyncStorageCache';
import { addPendingAction, isOfflineTicket, updateOfflineTicket } from '@/helpers/ticketStorage';
import { useSyncStatus } from '@hooks/useSync';
import { useToast } from '@hooks/useToast';
import { Ticket, updateTicket } from '@services/TicketApi';
import { useCallback, useState } from 'react';

/**
 * Hook para atualizar um ticket
 * Atualiza direto na API e invalida o cache
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
  const { isOnline } = useSyncStatus();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (data: Partial<Ticket>, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
      try {
        setIsPending(true);

        const isOffline = isOfflineTicket(ticketId);

        if (isOnline && !isOffline) {
          // ONLINE: Atualiza direto na API
          const ticketIdNum = Number(ticketId);
          await updateTicket(ticketIdNum, data);
          console.log('[useUpdateTicket] Ticket updated successfully');

          // Limpar cache do ticket específico e da lista
          await AsyncStorageCache.clearTicketDetail(ticketIdNum);
          await AsyncStorageCache.clearTicketsCache();

          toast.success('Ticket atualizado com sucesso!');
        } else {
          // OFFLINE: Atualiza localmente e adiciona à fila
          await updateOfflineTicket(ticketId, data);

          // Adicionar à fila de sincronização
          await addPendingAction({
            type: 'update',
            ticketId,
            data,
          });

          console.log('[useUpdateTicket] Ticket updated offline:', ticketId);
          toast.success('Alteração salva offline. Será sincronizada quando conectar!');
        }

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
    [ticketId, toast, isOnline]
  );

  return {
    mutate,
    isPending,
  };
};
