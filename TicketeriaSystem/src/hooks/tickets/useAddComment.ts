import { queryClient } from '@/services/queryClient';
import { useToast } from '@hooks/useToast';
import { addComment, Comment } from '@services/TicketApi';
import { useMutation } from '@tanstack/react-query';
import { ticketKeys } from './keys';

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

  return useMutation<Comment, Error, string>({
    mutationFn: (content) => addComment(ticketId, content),
    onSuccess: () => {
      // Invalida o cache do ticket para recarregar com os novos comentários
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });

      toast.success('Comentário adicionado!');
    },
    onError: (error) => {
      toast.error('Não foi possível adicionar o comentário');
      console.error('Error adding comment:', error);
    },
  });
};
