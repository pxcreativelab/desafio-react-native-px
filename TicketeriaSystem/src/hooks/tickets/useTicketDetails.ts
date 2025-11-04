import { fetchTicketById, Ticket } from '@services/TicketApi';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para buscar detalhes de um ticket específico
 * Busca direto da API
 * 
 * @example
 * const { data: ticket, isLoading, error, refetch } = useTicketDetails(123);
 */
export const useTicketDetails = (ticketId: number) => {
  const [data, setData] = useState<Ticket | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!ticketId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      console.log('[useTicketDetails] Fetching ticket from API:', ticketId);
      const ticket = await fetchTicketById(ticketId);
      setData(ticket);

    } catch (err) {
      console.error('[useTicketDetails] Error fetching ticket:', err);
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
