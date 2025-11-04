import SQLiteService from '@/services/SQLiteService';
import { useToast } from '@hooks/useToast';
import NetInfo from '@react-native-community/netinfo';
import { updateTicket } from '@services/TicketApi';
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
export const useUpdateTicketStatus = (ticketId: string) => {
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (status: string, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
      try {
        setIsPending(true);

        // Atualiza localmente primeiro
        const currentTicket = await SQLiteService.getTicketByIdLocally(ticketId);
        if (currentTicket) {
          await SQLiteService.updateTicketLocally(ticketId, { ...currentTicket, status: status as any });
        }

        // Tenta atualizar na API se estiver online
        const netState = await NetInfo.fetch();
        if (netState.isConnected) {
          try {
            const updatedTicket = await updateTicket(ticketId, { status: status as any });
            // Atualiza local com resposta da API
            await SQLiteService.updateTicketLocally(ticketId, updatedTicket);
          } catch (apiError) {
            console.warn('[useUpdateTicketStatus] API update failed, will sync later:', apiError);
            // Continua mesmo se API falhar - será sincronizado depois
          }
        }

        toast.success('Status atualizado com sucesso!');

        if (options?.onSuccess) {
          options.onSuccess();
        }
      } catch (error) {
        toast.error('Não foi possível atualizar o status');
        console.error('Error updating status:', error);

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
