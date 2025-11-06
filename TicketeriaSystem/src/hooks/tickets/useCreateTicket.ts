import AsyncStorageCache from '@/helpers/AsyncStorageCache';
import { addPendingAction, getTicketsFromStorage, saveOfflineTicket, saveTicketsToStorage } from '@/helpers/ticketStorage';
import { useSyncStatus } from '@hooks/useSync';
import { useToast } from '@hooks/useToast';
import { createTicket, CreateTicketData, Ticket } from '@services/TicketApi';
import { useAuthStore } from '@stores/useAuthStore';
import { useCallback, useState } from 'react';

/**
 * Hook para criar um novo ticket
 * Envia direto para a API e invalida o cache
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
  const { isOnline } = useSyncStatus();
  const { user } = useAuthStore();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      data: CreateTicketData,
      options?: {
        onSuccess?: (id: number | string) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      try {
        setIsPending(true);

        if (isOnline) {
          // ONLINE: Cria o ticket direto na API
          const ticket = await createTicket(data);
          console.log(`[useCreateTicket] Ticket ${ticket.id} created successfully`);

          // Limpar cache da lista para forçar reload
          await AsyncStorageCache.clearTicketsCache();

          toast.success('Ticket criado com sucesso!');

          if (options?.onSuccess && ticket.id) {
            options.onSuccess(ticket.id);
          }
        } else {
          // OFFLINE: Salva localmente e adiciona à fila
          const offlineId = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          const offlineTicket: Ticket = {
            id: offlineId as any,
            title: data.title,
            description: data.description,
            status: 'open',
            priority: data.priority as any,
            category: data.category as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: [],
            attachments: [],
            createdBy: {
              id: String(user?.id || 0),
              name: user?.name || 'Você',
              email: user?.email || '',
            },
          };

          // Salvar ticket offline
          await saveOfflineTicket(offlineTicket);

          // Adicionar à lista em cache
          const cachedList = await getTicketsFromStorage();
          if (cachedList) {
            cachedList.data.unshift(offlineTicket);
            await saveTicketsToStorage(cachedList);
          }

          // Adicionar à fila de sincronização
          await addPendingAction({
            type: 'create',
            data,
            localTicketId: offlineId,
          });

          console.log(`[useCreateTicket] Ticket created offline: ${offlineId}`);
          toast.success('Ticket salvo offline. Será enviado quando conectar!');

          if (options?.onSuccess) {
            options.onSuccess(offlineId);
          }
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
    [toast, isOnline, user]
  );

  return {
    mutate,
    isPending,
  };
};
