import SQLiteService from '@/services/SQLiteService';
import { useToast } from '@hooks/useToast';
import { CreateTicketData } from '@services/TicketApi';
import { useCallback, useState } from 'react';

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
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      data: CreateTicketData,
      options?: {
        onSuccess?: (id: string) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      try {
        setIsPending(true);

        // Salva localmente (será sincronizado depois)
        const ticketId = await SQLiteService.saveTicketLocally(data);

        toast.success('Ticket criado com sucesso!');

        if (options?.onSuccess) {
          options.onSuccess(ticketId);
        }
      } catch (error) {
        toast.error('Não foi possível criar o ticket');
        console.error('Error creating ticket:', error);

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
