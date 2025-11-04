import SQLiteService from '@services/SQLiteService';
import { fetchTicketById, Ticket } from '@services/TicketApi';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para buscar detalhes de um ticket específico
 * Estratégia: busca local primeiro, depois sincroniza com API
 * 
 * @example
 * const { data: ticket, isLoading, error } = useTicketDetails('123');
 */
export const useTicketDetails = (ticketId: string) => {
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

      // 1. Busca local primeiro
      const localTicket = await SQLiteService.getTicketByIdLocally(ticketId);

      if (localTicket) {
        setData(localTicket);
        setIsLoading(false);
      }

      // 2. Busca da API em segundo plano
      try {
        const serverTicket = await fetchTicketById(ticketId);

        // Compara e atualiza se houver diferenças
        const hasChanges = JSON.stringify(serverTicket) !== JSON.stringify(localTicket);

        if (hasChanges) {
          // Atualiza banco local
          await SQLiteService.updateTicketLocally(ticketId, serverTicket);
          console.log(`[useTicketDetails] Synced ticket ${ticketId} from API`);

          // Atualiza estado
          setData(serverTicket);
        }
      } catch (apiError) {
        console.warn('[useTicketDetails] API sync failed, using local data:', apiError);
        // Se não tinha dado local, propaga erro
        if (!localTicket) {
          throw apiError;
        }
      }
    } catch (err) {
      console.error('[useTicketDetails] Error:', err);
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
    return fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
