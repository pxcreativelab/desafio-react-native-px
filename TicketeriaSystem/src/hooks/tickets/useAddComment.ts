import AsyncStorageCache from '@/helpers/AsyncStorageCache';
import { addPendingAction, isOfflineTicket } from '@/helpers/ticketStorage';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSyncStatus } from '@hooks/useSync';
import { useToast } from '@hooks/useToast';
import { addComment } from '@services/TicketApi';
import { useState } from 'react';

/**
 * Hook para adicionar comentário a um ticket
 * Envia direto para a API e invalida o cache do ticket
 * 
 * @example
 * const { mutate: addNewComment, isPending } = useAddComment('123');
 * 
 * const handleComment = () => {
 *   addNewComment('Este é um comentário');
 * };
 */
export const useAddComment = (ticketId: string | number) => {
  const toast = useToast();
  const { isOnline } = useSyncStatus();
  const [isPending, setIsPending] = useState(false);
  const { user } = useAuthStore();

  const mutate = async (
    content: string,
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    try {
      setIsPending(true);

      const isOffline = isOfflineTicket(ticketId);

      if (isOnline && !isOffline) {
        // ONLINE: Adiciona o comentário direto na API
        await addComment(Number(ticketId), {
          text: content,
          createdAt: new Date().toISOString(),
          createdBy: {
            id: user?.id ?? 'unknown',
            name: user?.name ?? 'Unknown',
            email: user?.email ?? 'unknown@example.com',
          },
        });
        console.log('[useAddComment] Comment added successfully');

        // Limpar cache do ticket para forçar reload dos comentários
        await AsyncStorageCache.clearTicketDetail(Number(ticketId));

        toast.success('Comentário adicionado!');
      } else {
        // OFFLINE: Adiciona comentário localmente
        const newComment = {
          id: `offline_comment_${Date.now()}`,
          text: content,
          createdAt: new Date().toISOString(),
          createdBy: {
            id: user?.id ?? 'unknown',
            name: user?.name ?? 'Você',
            email: user?.email ?? '',
          },
        };

        // Adicionar à fila de sincronização
        await addPendingAction({
          type: 'addComment',
          ticketId,
          data: newComment,
        });

        // Atualizar o ticket no cache local com o novo comentário
        const cachedTicket = await AsyncStorageCache.loadTicketDetail(ticketId);
        if (cachedTicket) {
          const updatedTicket = {
            ...cachedTicket,
            comments: [...(cachedTicket.comments || []), newComment],
          };
          await AsyncStorageCache.saveTicketDetail(ticketId, updatedTicket);
        }

        console.log('[useAddComment] Comment saved offline:', ticketId);
        toast.success('Comentário salvo offline. Será enviado quando conectar!');
      }

      if (options?.onSuccess) options.onSuccess();
    } catch (error) {
      toast.error('Não foi possível adicionar o comentário');
      console.error('[useAddComment] Error adding comment:', error);
      if (options?.onError) options.onError(error as Error);
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutate,
    isPending,
  };
};
