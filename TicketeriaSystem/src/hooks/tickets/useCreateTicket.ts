import { TicketPriority } from '@/interfaces/Ticket';
import SQLiteService from '@/services/SQLiteService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@hooks/useToast';
import { triggerSync } from '@services/SyncService';
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
  const { user } = useAuthStore();

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

        // Salva localmente primeiro (será sincronizado depois)
        const ticketId = await SQLiteService.saveTicketLocally({
          category: data.category,
          description: data.description,
          priority: data.priority as TicketPriority,
          title: data.title,
          status: 'open',
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: {
            id: user?.id ?? 'unknown',
            name: user?.name ?? 'Unknown',
            email: user?.email ?? 'unknown',
          },
        });

        console.log(`[useCreateTicket] Ticket ${ticketId} saved locally with status 'pending', triggering sync...`);

        // Pequeno delay para garantir que o banco foi atualizado, depois acionar sync
        setTimeout(() => {
          triggerSync().catch((err: Error) => {
            console.warn('[useCreateTicket] Background sync failed:', err);
          });
        }, 100);

        toast.success('Ticket criado com sucesso!');

        if (options?.onSuccess) {
          options.onSuccess(ticketId);
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
    [toast, user]
  );

  return {
    mutate,
    isPending,
  };
};
