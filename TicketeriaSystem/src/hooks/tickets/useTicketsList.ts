import { fetchTickets, ListTicketsParams, ListTicketsResponse } from '@services/TicketApi';
import { useCallback, useEffect, useState } from 'react';

export type UseTicketsListOptions = ListTicketsParams;

/**
 * Hook para listar tickets com paginação e filtros
 * Busca direto da API
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
  const { page = 1, limit = 20, status, search } = params;

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

      // Busca direto da API
      const serverResponse = await fetchTickets({ page, limit, status, search });
      setData(serverResponse);

    } catch (err) {
      console.error('[useTicketsList] Error:', err);
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [page, limit, status, search]);

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
