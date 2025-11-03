import { queryClient } from '@/services/queryClient';
import { useToast } from '@hooks/useToast';
import { Ticket, updateTicket } from '@services/TicketApi';
import { useMutation } from '@tanstack/react-query';
import { ticketKeys } from './keys';

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

  return useMutation<Ticket, Error, Partial<Ticket>>({
    mutationFn: (data) => updateTicket(ticketId, data),
    onSuccess: (updatedTicket) => {
      // Atualiza o cache do ticket específico
      queryClient.setQueryData(ticketKeys.detail(ticketId), updatedTicket);

      // Invalida as listas para refletir mudanças
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });

      toast.success('Ticket atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Não foi possível atualizar o ticket');
      console.error('Error updating ticket:', error);
    },
  });
};
