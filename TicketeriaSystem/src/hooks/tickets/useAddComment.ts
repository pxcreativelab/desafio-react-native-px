import SQLiteService from '@/services/SQLiteService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@hooks/useToast';
import { triggerSync } from '@services/SyncService';
import { useState } from 'react';

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
export const useAddComment = (ticketId: string | number) => {
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);
  const { user } = useAuthStore()

  const mutate = async (
    content: string,
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    try {
      setIsPending(true);

      const now = new Date().toISOString();
      const localComment = {
        id: String(Date.now()),
        ticketId: String(ticketId),
        text: content,
        createdAt: now,
        createdBy: {
          id: user?.id ?? 'unknown',
          name: user?.name ?? 'Unknown',
          email: user?.email ?? 'unknown@example.com',
        },
      } as any;

      await SQLiteService.saveCommentLocally(localComment);
      console.log('[useAddComment] Comment saved locally, triggering sync...');

      // Acionar sincronização em background
      triggerSync().catch((err: Error) => {
        console.warn('[useAddComment] Background sync failed:', err);
      });

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
