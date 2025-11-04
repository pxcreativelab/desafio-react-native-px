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
export const useTicketDetails = (id: number, serverId: number | undefined) => {
  const [data, setData] = useState<Ticket | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLocalData = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const localTicket = await SQLiteService.getTicketByIdLocally(id);
      if (localTicket) {
        setData(localTicket);
      }
    } catch (err) {
      console.error('[useTicketDetails] Local fetch error:', err);
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchServerData = useCallback(async () => {
    if (!serverId || !id) return;

    try {
      const serverTicket = await fetchTicketById(serverId);
      const localTicket = await SQLiteService.getTicketByIdLocally(id);

      const hasChanges = JSON.stringify(serverTicket) !== JSON.stringify(localTicket);
      if (hasChanges) {
        await SQLiteService.updateTicketLocally(id, serverTicket);
        console.log(`[useTicketDetails] Synced ticket ${id} from API`);
        setData(serverTicket);
      }
    } catch (apiError) {
      console.warn('[useTicketDetails] API sync failed, using local data:', apiError);
      // if there is no local data, surface the error state
      const localTicket = await SQLiteService.getTicketByIdLocally(id);
      if (!localTicket) {
        setIsError(true);
        setError(apiError as Error);
      }
    }
  }, [id, serverId]);

  const fetchData = useCallback(async () => {
    await fetchLocalData();
    await fetchServerData();
  }, [fetchLocalData, fetchServerData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = async () => {
    await fetchData();
  };

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
