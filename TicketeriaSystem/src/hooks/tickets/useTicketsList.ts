import SQLiteService from '@services/SQLiteService';
import { fetchTickets, ListTicketsParams, ListTicketsResponse } from '@services/TicketApi';
import { useQuery } from '@tanstack/react-query';
import { ticketKeys } from './keys';

export type UseTicketsListOptions = ListTicketsParams & { isOnline?: boolean };

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
export const useTicketsList = (params: UseTicketsListOptions = {}) => {
  const { isOnline, ...rest } = params;

  // queryKey e queryFn dinâmicos mas sempre chamamos useQuery exatamente uma vez
  const queryKey = isOnline ? ticketKeys.list(rest) : ['tickets', 'local', rest];

  return useQuery<ListTicketsResponse, Error>({
    queryKey,
    queryFn: async () => {
      if (isOnline) {
        // Busca do servidor
        const serverResponse = await fetchTickets(rest);

        // Merge no banco local (salva novos, atualiza existentes)
        if (serverResponse.data && serverResponse.data.length > 0) {
          await SQLiteService.upsertTicketsLocally(serverResponse.data);
          console.log(`[useTicketsList] Merged ${serverResponse.data.length} tickets into SQLite`);
        }

        return serverResponse;
      }

      // Offline: busca paginada do SQLite
      const { items, total } = await SQLiteService.getTicketsLocally({
        status: (rest as ListTicketsParams).status,
        search: (rest as ListTicketsParams).search,
        page: (rest as ListTicketsParams).page || 1,
        limit: (rest as ListTicketsParams).limit || 20,
      });

      const page = (rest as ListTicketsParams).page || 1;
      const limit = (rest as ListTicketsParams).limit || 20;
      const totalPages = Math.ceil(total / limit);

      const response: ListTicketsResponse = {
        data: items,
        total,
        page,
        limit,
        totalPages,
      };

      return response;
    },
    staleTime: 1000 * 60 * 5,
  });
};
