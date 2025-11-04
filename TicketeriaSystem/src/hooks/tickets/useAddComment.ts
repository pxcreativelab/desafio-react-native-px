import SQLiteService from '@/services/SQLiteService';
import { useToast } from '@hooks/useToast';
import NetInfo from '@react-native-community/netinfo';
import { addComment } from '@services/TicketApi';
import { useCallback, useState } from 'react';

/**
 * Hook para adicionar comentário a um ticket
 * 
 * @example
 * const { mutate: addNewComment, isPending } = useAddComment('123');
 * 
 * const handleComment = () => {
 *   addNewComment('Este é um comentário');
 * };
 */
export const useAddComment = (ticketId: string) => {
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (content: string, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
      try {
        setIsPending(true);

        // Cria comentário local
        const localComment = {
          id: Date.now(),
          ticketId,
          text: content,
          createdAt: new Date().toISOString(),
          createdBy: {
            id: 'current_user',
            name: 'Usuário Atual',
            email: 'usuario@email.com',
          },
        };

        // Salva localmente
        await SQLiteService.saveCommentLocally(localComment);

        // Tenta enviar para API se online
        const netState = await NetInfo.fetch();
        if (netState.isConnected) {
          try {
            await addComment(ticketId, content);
          } catch (apiError) {
            console.warn('[useAddComment] API failed, will sync later:', apiError);
          }
        }

        toast.success('Comentário adicionado!');

        if (options?.onSuccess) {
          options.onSuccess();
        }
      } catch (error) {
        toast.error('Não foi possível adicionar o comentário');
        console.error('Error adding comment:', error);

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
