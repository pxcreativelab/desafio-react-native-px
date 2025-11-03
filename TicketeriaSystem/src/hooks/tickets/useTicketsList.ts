import { fetchTickets, ListTicketsParams, ListTicketsResponse } from '@services/TicketApi';
import { useQuery } from '@tanstack/react-query';
import { ticketKeys } from './keys';

/**
 * Hook para listar tickets com paginação e filtros
 * 
 * @example
 * const { data, isLoading, error, refetch } = useTicketsList({
 *   page: 1,
 *   limit: 20,
 *   status: 'open',
 *   search: 'bug'
 * });
 */
export const useTicketsList = (params: ListTicketsParams = {}) => {
  return useQuery<ListTicketsResponse, Error>({
    queryKey: ticketKeys.list(params),
    queryFn: () => fetchTickets(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
