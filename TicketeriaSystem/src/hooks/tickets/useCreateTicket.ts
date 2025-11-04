import { useToast } from '@hooks/useToast';
import { createTicket, CreateTicketData } from '@services/TicketApi';
import { useCallback, useState } from 'react';

/**
 * Hook para criar um novo ticket
 * Envia direto para a API
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
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      data: CreateTicketData,
      options?: {
        onSuccess?: (id: number) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      try {
        setIsPending(true);

        // Cria o ticket direto na API
        const ticket = await createTicket(data);

        console.log(`[useCreateTicket] Ticket ${ticket.id} created successfully`);

        toast.success('Ticket criado com sucesso!');

        if (options?.onSuccess && ticket.id) {
          options.onSuccess(ticket.id);
        }
      } catch (error) {
        toast.error('Não foi possível criar o ticket');
        console.error('[useCreateTicket] Error creating ticket:', error);

        if (options?.onError) {
          options.onError(error as Error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [toast]
  );

  return {
    mutate,
    isPending,
  };
};
