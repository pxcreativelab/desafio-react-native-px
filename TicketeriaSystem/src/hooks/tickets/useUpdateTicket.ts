import SQLiteService from '@/services/SQLiteService';
import { useToast } from '@hooks/useToast';
import NetInfo from '@react-native-community/netinfo';
import { Ticket, updateTicket } from '@services/TicketApi';
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
        const currentTicket = await SQLiteService.getTicketByIdLocally(ticketId);
        if (currentTicket) {
          await SQLiteService.updateTicketLocally(ticketId, { ...currentTicket, ...data });
        }

        // Tenta atualizar na API se online
        const netState = await NetInfo.fetch();
        if (netState.isConnected) {
          try {
            const updatedTicket = await updateTicket(ticketId, data);
            await SQLiteService.updateTicketLocally(ticketId, updatedTicket);
          } catch (apiError) {
            console.warn('[useUpdateTicket] API failed, will sync later:', apiError);
          }
        }

        toast.success('Ticket atualizado com sucesso!');

        if (options?.onSuccess) {
          options.onSuccess();
        }
      } catch (error) {
        toast.error('Não foi possível atualizar o ticket');
        console.error('Error updating ticket:', error);

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
