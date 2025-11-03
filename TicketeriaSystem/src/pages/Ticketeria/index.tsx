import React, { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { SyncStatusBadge } from '@components/_fragments/SyncStatusBadge';
import TicketCard from '@components/_fragments/TicketCard';
import { TicketSkeleton } from '@components/_fragments/TicketSkeleton';
import { useTicketsList } from '@hooks/tickets';
import { useDebounce } from '@hooks/useDebounce';
import { useNavigation } from '@react-navigation/native';
import { Ticket } from '@services/TicketApi';

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
  RetryButton,
  RetryButtonText,
  SearchIcon,
  SearchIconText,
  SearchInput,
  SearchInputContainer
} from './styles';



const TicketeriaList: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const { navigate } = useNavigation();

  // Debounce no search para evitar requisições excessivas
  const debouncedSearch = useDebounce(searchText, 500);

  // React Query hook
  const { data, isLoading, isError, refetch, isFetching } = useTicketsList({
    page,
    limit: 20,
    status: selectedStatus,
    search: debouncedSearch || undefined,
    sort: 'createdAt_desc',
  });

  const tickets = data?.data || [];
  const hasMore = data ? data.page < data.totalPages : false;

  const handleLoadMore = () => {
    if (!isLoading && !isFetching && hasMore) {
      setPage((prev) => prev + 1);
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

  // Loading suave - mostra esqueleto ao invés de tela branca
  const isInitialLoading = isLoading && tickets.length === 0;

  if (isError) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorText>Erro ao carregar tickets</ErrorText>
          <RetryButton onPress={() => refetch()}>
            <RetryButtonText>Tentar novamente</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  // Detectar se está aguardando o debounce
  const isSearching = searchText !== debouncedSearch;

  return (
    <Container>
      <SyncStatusBadge />
      <Header>
        <SearchInputContainer>
          <SearchIcon>
            {isSearching ? (
              <ActivityIndicator size="small" color="#8E8E93" />
            ) : (
              <SearchIconText>🔍</SearchIconText>
            )}
          </SearchIcon>
          <SearchInput
            placeholder="Buscar tickets..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#8E8E93"
          />
        </SearchInputContainer>
        <CreateButton onPress={handleCreateTicket}>
          <CreateButtonText>+ Novo</CreateButtonText>
        </CreateButton>
      </Header>

      {/* Loading Skeleton - mais suave que spinner */}
      {isInitialLoading ? (
        <TicketSkeleton />
      ) : (
        <>
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
                refreshing={isFetching}
                onRefresh={() => refetch()}
                colors={['#007AFF']}
                tintColor="#007AFF"
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetching && tickets.length > 0 ? (
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
        </>
      )}
    </Container>
  );
};

export default TicketeriaList;
