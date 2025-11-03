import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import TicketCard from '../../components/_fragments/TicketCard';
import { getTicketsFromStorage, isCacheValid, saveTicketsToStorage } from '../../helpers/ticketStorage';
import { useToast } from '../../hooks/useToast';
import { fetchTickets, ListTicketsParams, Ticket } from '../../services/TicketApi';
import {
  BoxRow,
  Container,
  CreateButton,
  CreateButtonText,
  EmptyContainer,
  EmptyIcon,
  EmptyText,
  ErrorContainer,
  ErrorText,
  FilterButton,
  FilterButtonText,
  FilterRow,
  Header,
  LoadingContainer,
  LoadingText,
  RetryButton,
  RetryButtonText,
  SearchInput,
} from './styles';



const TicketeriaList: React.FC<Props> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const { navigate } = useNavigation();
  const toast = useToast();

  const loadTickets = useCallback(async (reset: boolean = false) => {
    try {
      setError(false);

      if (reset) {
        setLoading(true);
        setPage(1);

        // Tentar carregar do cache primeiro
        const cachedData = await getTicketsFromStorage();
        const cacheIsValid = await isCacheValid(5);

        if (cachedData && cacheIsValid) {
          setTickets(cachedData.data);
          setLoading(false);
          // Continuar carregando em background
        }
      } else {
        setLoadingMore(true);
      }

      const params: ListTicketsParams = {
        page: reset ? 1 : page,
        limit: 20,
        status: selectedStatus,
        search: searchText || undefined,
        sort: 'createdAt_desc',
      };

      const response = await fetchTickets(params);

      if (reset) {
        setTickets(response.data);
        await saveTicketsToStorage(response);
      } else {
        setTickets((prev) => [...prev, ...response.data]);
      }

      setHasMore(response.page < response.totalPages);
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    } catch (err) {
      console.error('Error loading tickets:', err);

      // Se falhar e for o primeiro carregamento, tentar carregar do cache
      if (reset) {
        const cachedData = await getTicketsFromStorage();
        if (cachedData && cachedData.data.length > 0) {
          setTickets(cachedData.data);
          toast.warning('Modo Offline: mostrando dados salvos localmente');
        } else {
          setError(true);
        }
      }

      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [page, selectedStatus, searchText, toast]);

  useEffect(() => {
    loadTickets(true);
  }, [selectedStatus, searchText, loadTickets]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTickets(true);
  };

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      setPage((prev) => prev + 1);
      loadTickets(false);
    }
  };

  const handleTicketPress = (ticket: Ticket) => {
    navigate('TicketDetails', { ticketId: String(ticket.id) });
  };

  const handleCreateTicket = () => {
    navigate('CreateTicket');
  };

  const handleStatusFilter = (status: string | undefined) => {
    setSelectedStatus(status);
  };

  const statusFilters = [
    { label: 'Todos', value: undefined },
    { label: 'Abertos', value: 'open' },
    { label: 'Em Andamento', value: 'in_progress' },
    { label: 'Resolvidos', value: 'resolved' },
    { label: 'Fechados', value: 'closed' },
  ];

  if (loading && !refreshing && tickets.length === 0) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#007AFF" />
          <LoadingText>Carregando tickets...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (error && tickets.length === 0) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorText>Erro ao carregar tickets</ErrorText>
          <RetryButton onPress={() => loadTickets(true)}>
            <RetryButtonText>Tentar novamente</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <SearchInput
          placeholder="Buscar tickets..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#8E8E93"
        />
        <CreateButton onPress={handleCreateTicket}>
          <CreateButtonText>+ Novo</CreateButtonText>
        </CreateButton>
      </Header>

      <BoxRow>
        <FilterRow
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, }}
        >
          {statusFilters.map((filter) => (
            <FilterButton
              key={filter.value || 'all'}
              onPress={() => handleStatusFilter(filter.value)}
              active={selectedStatus === filter.value}
            >
              <FilterButtonText active={selectedStatus === filter.value}>
                {filter.label}
              </FilterButtonText>
            </FilterButton>
          ))}
        </FilterRow>
      </BoxRow>
      <FlatList
        data={tickets}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TicketCard ticket={item} onPress={() => handleTicketPress(item)} />
        )}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyContainer>
            <EmptyIcon>🎫</EmptyIcon>
            <EmptyText>
              {searchText || selectedStatus
                ? 'Nenhum ticket encontrado com esses filtros'
                : 'Nenhum ticket cadastrado ainda'}
            </EmptyText>
            {!searchText && !selectedStatus && (
              <CreateButton onPress={handleCreateTicket} style={{ marginTop: 16 }}>
                <CreateButtonText>Criar primeiro ticket</CreateButtonText>
              </CreateButton>
            )}
          </EmptyContainer>
        }
      />
    </Container>
  );
};

export default TicketeriaList;
