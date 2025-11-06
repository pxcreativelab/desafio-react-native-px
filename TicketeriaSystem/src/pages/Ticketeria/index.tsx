import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl } from 'react-native';

import TicketCard from '@components/_fragments/TicketCard';
import { useTicketsList } from '@hooks/tickets';
import { useDebounce } from '@hooks/useDebounce';
import { useUserPreferences } from '@hooks/useUserPreferences';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ExportService } from '@services/ExportService';
import { Ticket } from '@services/TicketApi';

import TopLoadingBar from '@/components/TopLoadingBar';
import {
  BoxRow,
  Container,
  CreateButton,
  CreateButtonText,
  EmptyContainer,
  EmptyIcon,
  EmptyText,
  ExportButton,
  ExportButtonText,
  ExportRow,
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
  const { preferences } = useUserPreferences();

  // Aplicar filtro padrão das preferências ao carregar
  useEffect(() => {
    if (preferences.defaultFilter !== undefined) {
      setSelectedStatus(preferences.defaultFilter);
    }
  }, [preferences.defaultFilter]);

  const { data, isLoading, isFetching, refetch, clearCache, } = useTicketsList({
    page: 1,
    limit: preferences.pageSize || 50,
    status: selectedStatus,
    search: debouncedSearch || undefined,
  });

  // Refetch quando a tela voltar ao foco
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Pull-to-refresh: limpa cache e recarrega
  const handleRefresh = React.useCallback(async () => {
    await clearCache();
  }, [clearCache]);

  const tickets = data?.data || [];

  const handleTicketPress = (ticket: Ticket) => {
    navigate('TicketDetails', { ticketId: ticket.id });
  };

  const statusFilters = [
    { label: 'Todos', value: undefined },
    { label: 'Abertos', value: 'open' },
    { label: 'Em Andamento', value: 'in_progress' },
    { label: 'Resolvidos', value: 'resolved' },
    { label: 'Fechados', value: 'closed' },
  ];

  const handleExportPDF = async () => {
    try {
      if (tickets.length === 0) {
        Alert.alert('Aviso', 'Não há tickets para exportar');
        return;
      }
      await ExportService.exportToPDF(tickets);
    } catch {
      Alert.alert('Erro', 'Falha ao exportar para PDF');
    }
  };

  const handleExportCSV = async () => {
    try {
      if (tickets.length === 0) {
        Alert.alert('Aviso', 'Não há tickets para exportar');
        return;
      }
      await ExportService.exportToCSV(tickets);
    } catch {
      Alert.alert('Erro', 'Falha ao exportar para CSV');
    }
  };

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
      <TopLoadingBar visible={isLoading || isFetching} />

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

      <ExportRow>
        <ExportButton onPress={handleExportPDF}>
          <ExportButtonText>📄 Exportar PDF</ExportButtonText>
        </ExportButton>
        <ExportButton onPress={handleExportCSV}>
          <ExportButtonText>📊 Exportar CSV</ExportButtonText>
        </ExportButton>
      </ExportRow>

      <FlatList
        data={tickets}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TicketCard ticket={item} onPress={() => handleTicketPress(item)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleRefresh}
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
