import AsyncStorageCache from '@/helpers/AsyncStorageCache';
import { getOfflineTickets } from '@/helpers/ticketStorage';
import { fetchTickets, ListTicketsParams, ListTicketsResponse } from '@services/TicketApi';
import { useCallback, useEffect, useState } from 'react';

export type UseTicketsListOptions = ListTicketsParams;

/**
 * Hook para listar tickets com paginação e filtros
 * Estratégia: carrega do cache primeiro (dados antigos), depois busca da API (dados novos)
 * 
 * @example
 * const { data, isLoading, error, refetch, clearCache } = useTicketsList({
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
  const [isFromCache, setIsFromCache] = useState(false);

  const fetchData = useCallback(async (showLoading = true, skipCache = false) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsFetching(true);
      }
      setIsError(false);
      setError(null);

      // 1. Carregar do cache primeiro (se não for skip)
      let hasCachedData = false;
      if (!skipCache) {
        const cached = await AsyncStorageCache.loadTicketsList();
        if (cached && cached.data.length > 0) {
          // Verificar se os filtros batem
          const filtersMatch =
            cached.filters?.status === status &&
            cached.filters?.search === search;

          if (filtersMatch) {
            console.log('[useTicketsList] Loading from cache...');
            setData({
              data: cached.data,
              total: cached.total,
              page: cached.page,
              limit: cached.limit,
              totalPages: cached.totalPages,
            });
            setIsFromCache(true);
            setIsLoading(false);
            hasCachedData = true;
          }
        }
      }

      // 2. Tentar buscar da API (para atualizar)
      try {
        const serverResponse = await fetchTickets({ page, limit, status, search });

        // Adicionar tickets offline no início da lista
        const offlineTickets = await getOfflineTickets();
        const mergedData = [...offlineTickets, ...serverResponse.data];

        const mergedResponse = {
          ...serverResponse,
          data: mergedData,
          total: serverResponse.total + offlineTickets.length,
        };

        setData(mergedResponse);
        setIsFromCache(false);
        setIsError(false);
        setError(null);

        // 3. Salvar no cache (incluindo tickets offline)
        await AsyncStorageCache.saveTicketsList({
          ...mergedResponse,
          filters: { status, search },
          timestamp: Date.now(),
        });

        await AsyncStorageCache.updateLastSync();
      } catch (apiError) {
        console.warn('[useTicketsList] API request failed (possibly offline):', apiError);

        // Se temos dados do cache, está tudo bem (modo offline)
        if (hasCachedData) {
          console.log('[useTicketsList] Using cached data (offline mode)');
          setIsError(false);
          setError(null);
        } else {
          // Sem cache, tentar carregar qualquer cache disponível como último recurso
          const cached = await AsyncStorageCache.loadTicketsList();
          if (cached && cached.data.length > 0) {
            console.log('[useTicketsList] No matching cache, but using any available cache as fallback');
            setData({
              data: cached.data,
              total: cached.total,
              page: cached.page,
              limit: cached.limit,
              totalPages: cached.totalPages,
            });
            setIsFromCache(true);
            setIsError(false);
            setError(null);
          } else {
            // Sem cache algum, mostrar erro
            console.error('[useTicketsList] No cache available and API failed');
            setIsError(true);
            setError(apiError as Error);
          }
        }
      }

    } catch (err) {
      console.error('[useTicketsList] Unexpected error:', err);
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [page, limit, status, search]);

  useEffect(() => {
    fetchData(true, false);
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData(false, false);
  }, [fetchData]);

  const clearCache = useCallback(async () => {
    await AsyncStorageCache.clearTicketsCache();
    fetchData(false, true); // Refetch sem usar cache
  }, [fetchData]);

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    isFromCache,
    refetch,
    clearCache,
  };
};
