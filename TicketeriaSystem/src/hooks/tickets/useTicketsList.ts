
import SQLiteService from '@/services/SQLiteService/index';
import { fetchTickets, ListTicketsParams, ListTicketsResponse } from '@services/TicketApi';
import { useCallback, useEffect, useState } from 'react';

export type UseTicketsListOptions = ListTicketsParams & { isOnline?: boolean };

/**
 * Hook para listar tickets com paginação e filtros
 * Estratégia: busca dados locais primeiro, depois sincroniza com API em background
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
  const { isOnline, page = 1, limit = 20, status, search } = params;

  const [data, setData] = useState<ListTicketsResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsFetching(true);
      }
      setIsError(false);
      setError(null);

      const { items: localItems, total: localTotal } = await SQLiteService.getTicketsLocally({
        status,
        search,
        page,
        limit,
      });

      const totalPages = Math.ceil(localTotal / limit);
      const localResponse: ListTicketsResponse = {
        data: localItems,
        total: localTotal,
        page,
        limit,
        totalPages,
      };

      setData(localResponse);
      setIsLoading(false);
      setIsFetching(false);

      if (isOnline) {
        try {
          const serverResponse = await fetchTickets({ page, limit, status, search });
          const hasChanges =
            serverResponse.total !== localTotal ||
            JSON.stringify(serverResponse.data) !== JSON.stringify(localItems);

          if (hasChanges && serverResponse.data && serverResponse.data.length > 0) {
            await SQLiteService.upsertTicketsLocally(serverResponse.data);
            setData(serverResponse);
          }
        } catch (apiError) {
          console.warn('[useTicketsList] API sync failed:', apiError);
        }
      }
    } catch (err) {
      console.error('[useTicketsList] Error:', err);
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [isOnline, page, limit, status, search]);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
