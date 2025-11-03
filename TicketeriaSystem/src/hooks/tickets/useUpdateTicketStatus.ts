import { queryClient } from '@/services/queryClient';
import { useToast } from '@hooks/useToast';
import { Ticket, updateTicket } from '@services/TicketApi';
import { useMutation } from '@tanstack/react-query';
import { ticketKeys } from './keys';

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

  return useMutation<Ticket, Error, string>({
    mutationFn: (status) => updateTicket(ticketId, { status: status as any }),
    onSuccess: (updatedTicket) => {
      // Atualiza o cache
      queryClient.setQueryData(ticketKeys.detail(ticketId), updatedTicket);
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });

      toast.success('Status atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Não foi possível atualizar o status');
      console.error('Error updating status:', error);
    },
  });
};
