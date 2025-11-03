import { queryClient } from '@/services/queryClient';
import { useToast } from '@hooks/useToast';
import { createTicket, CreateTicketData, Ticket } from '@services/TicketApi';
import { useMutation } from '@tanstack/react-query';
import { ticketKeys } from './keys';

/**
 * Hook para criar um novo ticket
 * 
 * @example
 * const { mutate: create, isPending } = useCreateTicket();
 * 
 * const handleCreate = () => {
 *   create({
 *     title: 'Novo ticket',
 *     description: 'Descrição',
 *     category: 'Bug',
 *     priority: 'high'
 *   });
 * };
 */
export const useCreateTicket = () => {
  const toast = useToast();

  return useMutation<Ticket, Error, CreateTicketData>({
    mutationFn: createTicket,
    onSuccess: () => {
      // Invalida todas as listas de tickets para recarregar
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      toast.success('Ticket criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Não foi possível criar o ticket');
      console.error('Error creating ticket:', error);
    },
  });
};
