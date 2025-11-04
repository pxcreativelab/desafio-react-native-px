import React, { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import TicketCard from '@components/_fragments/TicketCard';
import { useTicketsList } from '@hooks/tickets';
import { useDebounce } from '@hooks/useDebounce';
import { useSyncStatus } from '@hooks/useSync';
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
  FilterButton,
  FilterButtonText,
  FilterRow,
  Header,
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

  const debouncedSearch = useDebounce(searchText, 500);

  // Sync status (online/offline)
  const { isOnline } = useSyncStatus();

  // React Query hook (now receives isOnline to decide remote vs local)
  const { data, isLoading, isError, refetch, isFetching } = useTicketsList({
    isOnline,
    page,
    limit: 20,
    status: selectedStatus,
    search: debouncedSearch || undefined,
    sort: 'createdAt_desc',
  });

  const tickets = data?.data || [];
  const hasMore = data ? data.page < data.totalPages : false;

  const handleRefresh = () => {
    refetch();
  };

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

  // if (isError) {
  //   return (
  //     <Container>
  //       <ErrorContainer>
  //         <ErrorText>Erro ao carregar tickets</ErrorText>
  //         <RetryButton onPress={() => refetch()}>
  //           <RetryButtonText>Tentar novamente</RetryButtonText>
  //         </RetryButton>
  //       </ErrorContainer>
  //     </Container>
  //   );
  // }


  return (
    <Container>
      <Header>
        <SearchInputContainer>
          <SearchIcon>
            <SearchIconText>🔍</SearchIconText>
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
            onRefresh={handleRefresh}
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

      {/* <TicketSkeleton /> */}
    </Container>
  );
};

export default TicketeriaList;
