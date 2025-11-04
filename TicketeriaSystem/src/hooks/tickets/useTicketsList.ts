
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
  const { isOnline, ...rest } = params;

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

      // 1. SEMPRE busca dados locais primeiro (local-first)
      const { items: localItems, total: localTotal } = await SQLiteService.getTicketsLocally({
        status: rest.status,
        search: rest.search,
        page: rest.page || 1,
        limit: rest.limit || 20,
      });

      const page = rest.page || 1;
      const limit = rest.limit || 20;
      const totalPages = Math.ceil(localTotal / limit);

      const localResponse: ListTicketsResponse = {
        data: localItems,
        total: localTotal,
        page,
        limit,
        totalPages,
      };

      // Mostra dados locais imediatamente
      setData(localResponse);
      setIsLoading(false);
      setIsFetching(false);

      // 2. Se online, busca da API em segundo plano
      if (isOnline) {
        try {
          const serverResponse = await fetchTickets(rest);

          // Compara e atualiza apenas se houver diferenças
          const hasChanges =
            serverResponse.total !== localTotal ||
            JSON.stringify(serverResponse.data) !== JSON.stringify(localItems);

          if (hasChanges && serverResponse.data && serverResponse.data.length > 0) {
            // Merge no banco local
            await SQLiteService.upsertTicketsLocally(serverResponse.data);
            console.log(`[useTicketsList] Synced ${serverResponse.data.length} tickets from API`);

            // Atualiza estado com dados do servidor
            setData(serverResponse);
          }
        } catch (apiError) {
          // Se API falhar, mantém dados locais (já mostrados)
          console.warn('[useTicketsList] API sync failed, using local data:', apiError);
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
  }, [isOnline, rest]);

  // Busca inicial
  useEffect(() => {
    // fetchData(true);
  }, []);

  const refetch = useCallback(() => {
    // return fetchData(false);
  }, []);

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
