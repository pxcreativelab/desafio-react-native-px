import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@hooks/useToast';
import { addComment } from '@services/TicketApi';
import { useState } from 'react';

/**
 * Hook para adicionar comentário a um ticket
 * Envia direto para a API
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
  const [isPending, setIsPending] = useState(false);
  const { user } = useAuthStore();

  const mutate = async (
    content: string,
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    try {
      setIsPending(true);

      // Adiciona o comentário direto na API
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

      toast.success('Comentário adicionado!');

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
