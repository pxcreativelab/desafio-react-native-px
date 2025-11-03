import { useQueryClient } from '@tanstack/react-query';
import { ticketKeys } from './keys';

/**
 * Hook para invalidar manualmente o cache de tickets
 * Útil quando precisa forçar um reload dos dados
 * 
 * @example
 * const { invalidateAll, invalidateLists, invalidateDetail } = useInvalidateTickets();
 * 
 * // Invalida tudo
 * invalidateAll();
 * 
 * // Invalida apenas listas
 * invalidateLists();
 * 
 * // Invalida apenas um ticket específico
 * invalidateDetail('123');
 */
export const useInvalidateTickets = () => {
  const queryClient = useQueryClient();

  return {
    /**
     * Invalida todos os dados de tickets (listas e detalhes)
     */
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },

    /**
     * Invalida apenas as listas de tickets
     */
    invalidateLists: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },

    /**
     * Invalida apenas um ticket específico
     */
    invalidateDetail: (ticketId: string) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
    },
  };
};
