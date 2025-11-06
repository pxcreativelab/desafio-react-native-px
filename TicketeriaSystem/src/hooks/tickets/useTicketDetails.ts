import AsyncStorageCache from '@/helpers/AsyncStorageCache';
import { getTicketDetailsFromStorage, getTicketsFromStorage, isOfflineTicket } from '@/helpers/ticketStorage';
import { fetchTicketById, Ticket } from '@services/TicketApi';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para buscar detalhes de um ticket específico
 * Estratégia: carrega do cache primeiro (dados antigos), depois busca da API (dados novos)
 * 
 * @example
 * const { data: ticket, isLoading, error, refetch } = useTicketDetails(123);
 */
export const useTicketDetails = (ticketId: number | string) => {
  const [data, setData] = useState<Ticket | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const fetchData = useCallback(async (skipCache = false) => {
    if (!ticketId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Se for ticket offline, não tentar buscar da API
      if (isOfflineTicket(ticketId)) {
        console.log('[useTicketDetails] 📱 OFFLINE TICKET DETECTED:', ticketId);

        // Primeiro tentar carregar do storage de detalhes
        const cached = await getTicketDetailsFromStorage(ticketId);
        if (cached) {
          console.log('[useTicketDetails] ✅ Loaded from ticket details storage');
          setData(cached);
          setIsFromCache(true);
          setIsLoading(false);
          return;
        }

        // Fallback: buscar da listagem em cache
        console.log('[useTicketDetails] 🔍 Not in details storage, searching in list...');
        const list = await getTicketsFromStorage();
        console.log('[useTicketDetails] 📋 List has', list?.data.length || 0, 'tickets');

        const ticketFromList = list?.data.find(t => String(t.id) === String(ticketId));
        if (ticketFromList) {
          console.log('[useTicketDetails] ✅ Found in list cache!');
          setData(ticketFromList);
          setIsFromCache(true);
          setIsLoading(false);

          // Salvar também no cache de detalhes para próxima vez
          await AsyncStorageCache.saveTicketDetail(ticketId, ticketFromList);
          return;
        }

        console.log('[useTicketDetails] ❌ Offline ticket not found in cache');
        setIsError(true);
        setError(new Error('Ticket offline não encontrado no cache'));
        setIsLoading(false);
        return;
      }

      // 1. Carregar do cache primeiro (se não for skip)
      let hasCachedData = false;
      if (!skipCache) {
        const cached = await AsyncStorageCache.loadTicketDetail(ticketId);
        if (cached) {
          console.log('[useTicketDetails] Loading from cache:', ticketId);
          setData(cached);
          setIsFromCache(true);
          setIsLoading(false);
          hasCachedData = true;
        }
      }

      // 2. Tentar buscar da API (para atualizar)
      try {
        console.log('[useTicketDetails] Fetching ticket from API:', ticketId);
        const ticket = await fetchTicketById(ticketId);
        setData(ticket);
        setIsFromCache(false);
        setIsError(false);
        setError(null);

        // 3. Salvar no cache
        await AsyncStorageCache.saveTicketDetail(ticketId, ticket);
      } catch (apiError) {
        console.warn('[useTicketDetails] API request failed (possibly offline):', apiError);

        // Se temos dados do cache, está tudo bem (modo offline)
        if (hasCachedData) {
          console.log('[useTicketDetails] Using cached data (offline mode)');
          setIsError(false);
          setError(null);
        } else {
          // Sem cache no AsyncStorageCache, tentar outras fontes
          console.log('[useTicketDetails] No cache yet, trying other sources...');

          // Tentar carregar do ticketStorage (detalhes)
          const fromStorage = await getTicketDetailsFromStorage(ticketId);
          if (fromStorage) {
            console.log('[useTicketDetails] Found in ticket details storage');
            setData(fromStorage);
            setIsFromCache(true);
            setIsError(false);
            setError(null);
            return;
          }

          // Tentar carregar da lista
          const list = await getTicketsFromStorage();
          const ticketFromList = list?.data.find(t => String(t.id) === String(ticketId));
          if (ticketFromList) {
            console.log('[useTicketDetails] Found in tickets list');
            setData(ticketFromList);
            setIsFromCache(true);
            setIsError(false);
            setError(null);

            // Salvar no cache de detalhes para próxima vez
            await AsyncStorageCache.saveTicketDetail(ticketId, ticketFromList);
            return;
          }

          // Sem cache algum, mostrar erro
          console.error('[useTicketDetails] No cache available and API failed');
          setIsError(true);
          setError(apiError as Error);
        }
      }

    } catch (err) {
      console.error('[useTicketDetails] Unexpected error:', err);
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    isFromCache,
    refetch,
  };
};
