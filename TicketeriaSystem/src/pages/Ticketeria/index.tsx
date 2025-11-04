import React, { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';

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
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  const { navigate } = useNavigation();
  const debouncedSearch = useDebounce(searchText, 500);
  const { isOnline } = useSyncStatus();

  const { data, isLoading, isFetching, refetch } = useTicketsList({
    isOnline,
    page: 1,
    limit: 50,
    status: selectedStatus,
    search: debouncedSearch || undefined,
  });

  const tickets = data?.data || [];

  const handleTicketPress = (ticket: Ticket) => {
    navigate('TicketDetails', { ticketId: ticket.serverId, id: ticket.id });
  };

  const statusFilters = [
    { label: 'Todos', value: undefined },
    { label: 'Abertos', value: 'open' },
    { label: 'Em Andamento', value: 'in_progress' },
    { label: 'Resolvidos', value: 'resolved' },
    { label: 'Fechados', value: 'closed' },
  ];

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
        <CreateButton onPress={() => navigate('CreateTicket')}>
          <CreateButtonText>+ Novo</CreateButtonText>
        </CreateButton>
      </Header>

      <BoxRow>
        <FilterRow horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map((filter) => (
            <FilterButton
              key={filter.value || 'all'}
              onPress={() => setSelectedStatus(filter.value)}
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListFooterComponent={
          isFetching && tickets.length > 0 ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : null
        }
        ListEmptyComponent={
          <EmptyContainer>
            <EmptyIcon>🎫</EmptyIcon>
            <EmptyText>
              {searchText || selectedStatus
                ? 'Nenhum ticket encontrado'
                : 'Nenhum ticket cadastrado'}
            </EmptyText>
            {!searchText && !selectedStatus && (
              <CreateButton onPress={() => navigate('CreateTicket')}>
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
