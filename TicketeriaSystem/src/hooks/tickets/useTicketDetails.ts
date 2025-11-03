import { fetchTicketById, Ticket } from '@services/TicketApi';
import { useQuery } from '@tanstack/react-query';
import { ticketKeys } from './keys';

/**
 * Hook para buscar detalhes de um ticket específico
 * 
 * @example
 * const { data: ticket, isLoading, error } = useTicketDetails('123');
 */
export const useTicketDetails = (ticketId: string) => {
  return useQuery<Ticket, Error>({
    queryKey: ticketKeys.detail(ticketId),
    queryFn: () => fetchTicketById(ticketId),
    enabled: !!ticketId,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};
