# 💻 Exemplos de Código Completos

Este arquivo contém exemplos mais completos e detalhados para te orientar na implementação.

## 1. Componente TicketCard Completo

```typescript
// src/components/_fragments/TicketCard/index.tsx
import React from "react";
import { TouchableOpacity } from "react-native";
import TicketStatusBadge from "../TicketStatusBadge";
import { Ticket } from "../../../services/TicketApi";
import { Container, Header, Content, Footer, MetaInfo, Title, Description, DateText } from "./styles";

interface TicketCardProps {
  ticket: Ticket;
  onPress: () => void;
}

const TicketCard = ({ ticket, onPress }: TicketCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "#FF3B30";
      case "high":
        return "#FF9500";
      case "medium":
        return "#FFCC00";
      case "low":
        return "#34C759";
      default:
        return "#8E8E93";
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      critical: "Crítica",
      high: "Alta",
      medium: "Média",
      low: "Baixa",
    };
    return labels[priority] || priority;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Container>
        <Header>
          <Title numberOfLines={2}>{ticket.title}</Title>
          <TicketStatusBadge status={ticket.status} />
        </Header>

        <Content>
          <Description numberOfLines={2}>
            {ticket.description}
          </Description>
        </Content>

        <Footer>
          <MetaInfo>
            <DateText>{ticket.category}</DateText>
          </MetaInfo>

          <MetaInfo>
            <DateText style={{ color: getPriorityColor(ticket.priority) }}>
              {getPriorityLabel(ticket.priority)}
            </DateText>
          </MetaInfo>

          <DateText>
            {new Date(ticket.createdAt).toLocaleDateString("pt-BR")}
          </DateText>
        </Footer>

        {ticket.comments && ticket.comments.length > 0 && (
          <MetaInfo style={{ marginTop: 8 }}>
            <DateText>
              {ticket.comments.length} comentário{ticket.comments.length > 1 ? "s" : ""}
            </DateText>
          </MetaInfo>
        )}
      </Container>
    </TouchableOpacity>
  );
};

export default TicketCard;
```

```typescript
// src/components/_fragments/TicketCard/styles.ts
import styled, { css } from "styled-components/native";

export const Container = styled.View`
  ${({ theme }) => css`
    background-color: ${theme.colors.white};
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 2;
  `}
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 12px;
`;

export const Content = styled.View`
  margin-bottom: 12px;
`;

export const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const MetaInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  flex: 1;
  color: ${({ theme }) => theme.colors?.text || "#000"};
`;

export const Description = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.gray || "#666"};
`;

export const DateText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.gray || "#666"};
`;
```

## 2. TicketStatusBadge

```typescript
// src/components/_fragments/TicketStatusBadge/index.tsx
import React from "react";
import { Container, StatusText } from "./styles";

interface TicketStatusBadgeProps {
  status: "open" | "in_progress" | "resolved" | "closed";
}

const TicketStatusBadge = ({ status }: TicketStatusBadgeProps) => {
  const getStatusConfig = () => {
    const configs: Record<
      string,
      { label: string; color: string; bgColor: string }
    > = {
      open: {
        label: "Aberto",
        color: "#FF9500",
        bgColor: "#FFF4E6",
      },
      in_progress: {
        label: "Em Andamento",
        color: "#007AFF",
        bgColor: "#E6F2FF",
      },
      resolved: {
        label: "Resolvido",
        color: "#34C759",
        bgColor: "#E6F9EC",
      },
      closed: {
        label: "Fechado",
        color: "#8E8E93",
        bgColor: "#F2F2F7",
      },
    };

    return configs[status] || configs.open;
  };

  const config = getStatusConfig();

  return (
    <Container bgColor={config.bgColor}>
      <StatusText color={config.color}>
        {config.label}
      </StatusText>
    </Container>
  );
};

export default TicketStatusBadge;
```

```typescript
// src/components/_fragments/TicketStatusBadge/styles.ts
import styled from "styled-components/native";

interface ContainerProps {
  bgColor: string;
}

export const Container = styled.View<ContainerProps>`
  background-color: ${({ bgColor }) => bgColor};
  padding: 4px 12px;
  border-radius: 12px;
`;

export const StatusText = styled.Text<{ color: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ color }) => color};
`;
```

## 3. Lista de Tickets com Busca e Filtros

```typescript
// src/pages/Ticketeria/index.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, RefreshControl, View, FlatList, TextInput, TouchableOpacity, Text } from "react-native";
import TicketCard from "../../components/_fragments/TicketCard";
// Nota: Você precisará criar seus próprios componentes Loading, Error, InputSearch e Button
// ou usar alternativas do React Native
import { fetchTickets, Ticket, ListTicketsParams } from "../../services/TicketApi";
import { Container, Content, Header, FilterRow } from "./styles";

const TicketeriaList = ({ navigation }: NativeStackScreenProps<any>) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadTickets = useCallback(async (reset: boolean = false) => {
    try {
      setError(false);
      if (reset) {
        setLoading(true);
        setPage(1);
      }

      const params: ListTicketsParams = {
        page: reset ? 1 : page,
        limit: 20,
        status: selectedStatus,
        search: searchText || undefined,
        sort: "createdAt_desc",
      };

      const response = await fetchTickets(params);
      
      if (reset) {
        setTickets(response.data);
      } else {
        setTickets((prev) => [...prev, ...response.data]);
      }

      setHasMore(response.page < response.totalPages);
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      setError(true);
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, selectedStatus, searchText]);

  useEffect(() => {
    loadTickets(true);
  }, [selectedStatus, searchText]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    // Implementar debounce se necessário
  };

  const handleStatusFilter = (status: string | undefined) => {
    setSelectedStatus(status);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTickets(true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
      loadTickets(false);
    }
  };

  const handleTicketPress = (ticket: Ticket) => {
    navigation.navigate("TicketDetails", { ticketId: ticket.id });
  };

  const handleCreateTicket = () => {
    navigation.navigate("CreateTicket");
  };

  if (loading && !refreshing && tickets.length === 0) {
    return (
      <Container>
        {/* Implementar componente de Loading ou usar ActivityIndicator */}
        <Text>Carregando...</Text>
      </Container>
    );
  }

  if (error && tickets.length === 0) {
    return (
      <Container>
        {/* Implementar componente de Error */}
        <Text>Erro ao carregar tickets</Text>
        <TouchableOpacity onPress={() => loadTickets(true)}>
          <Text>Tentar novamente</Text>
        </TouchableOpacity>
      </Container>
    );
  }

  const statusFilters = [
    { label: "Todos", value: undefined },
    { label: "Abertos", value: "open" },
    { label: "Em Andamento", value: "in_progress" },
    { label: "Resolvidos", value: "resolved" },
    { label: "Fechados", value: "closed" },
  ];

  return (
    <Container>
      <Header>
        {/* Implementar InputSearch ou usar TextInput do React Native */}
        <TextInput
          placeholder="Buscar tickets..."
          value={searchText}
          onChangeText={handleSearch}
          style={{ flex: 1, padding: 10, borderWidth: 1, borderRadius: 8 }}
        />
        <TouchableOpacity onPress={handleCreateTicket}>
          <Text>+</Text>
        </TouchableOpacity>
      </Header>

        <FilterRow>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.value || "all"}
              onPress={() => handleStatusFilter(filter.value)}
              style={{
                marginRight: 8,
                padding: 8,
                borderRadius: 8,
                backgroundColor: selectedStatus === filter.value ? "#007AFF" : "#F2F2F7",
              }}
            >
              <Text style={{ color: selectedStatus === filter.value ? "#FFF" : "#000" }}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </FilterRow>

      <FlatList
        data={tickets}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TicketCard ticket={item} onPress={() => handleTicketPress(item)} />
        )}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ fontSize: 48 }}>🎫</Text>
            <Text style={{ marginTop: 16, textAlign: "center", color: "#666" }}>
              {searchText || selectedStatus
                ? "Nenhum ticket encontrado com esses filtros"
                : "Nenhum ticket cadastrado ainda"}
            </Text>
          </View>
        }
      />
    </Container>
  );
};

export default TicketeriaList;
```

## 4. Tela de Criação de Ticket

```typescript
// src/pages/Ticketeria/CreateTicket/index.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, Keyboard, ScrollView, TouchableWithoutFeedback, TextInput, TouchableOpacity, Text, View } from "react-native";
import { createTicket } from "../../../services/TicketApi";
import { Container, Content, Header, Footer, FormGroup } from "./styles";
// Nota: Você precisará criar seus próprios componentes ou usar componentes do React Native

const CreateTicket = ({ navigation }: NativeStackScreenProps<any>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [priority, setPriority] = useState<string>("medium");
  const [attachments, setAttachments] = useState<any[]>([]);

  const categories = ["Sistema", "Bug", "Feature Request", "Dúvida", "Outros"];
  const priorities = [
    { label: "Baixa", value: "low" },
    { label: "Média", value: "medium" },
    { label: "Alta", value: "high" },
    { label: "Crítica", value: "critical" },
  ];

  const validate = () => {
    if (title.length < 5) {
      Alert.alert("Erro", "O título deve ter no mínimo 5 caracteres");
      return false;
    }
    if (description.length < 10) {
      Alert.alert("Erro", "A descrição deve ter no mínimo 10 caracteres");
      return false;
    }
    if (!category) {
      Alert.alert("Erro", "Selecione uma categoria");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const ticketData = {
        title,
        description,
        category,
        priority,
        attachments,
      };

      await createTicket(ticketData);

      Alert.alert("Sucesso", "Ticket criado com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Ticketeria"),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o ticket. Tente novamente.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Carregando...</Text>
        </View>
      </Container>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 28 }}>×</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Novo Ticket
        </Text>
        <View style={{ width: 28 }} />
      </Header>

        <ScrollView>
          <Content>
            <FormGroup>
              <Text style={{ marginBottom: 8, fontWeight: "500" }}>
                Título *
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Erro ao fazer login"
                maxLength={100}
                style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
              />
            </FormGroup>

            <FormGroup>
              <Text style={{ marginBottom: 8, fontWeight: "500" }}>
                Descrição *
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Descreva o problema ou solicitação..."
                multiline
                numberOfLines={6}
                style={{ minHeight: 120, borderWidth: 1, borderRadius: 8, padding: 10 }}
              />
            </FormGroup>

            <FormGroup>
              <Text style={{ marginBottom: 8, fontWeight: "500" }}>
                Categoria *
              </Text>
              {/* Implementar Select/Dropdown aqui */}
              <TextInput
                value={category}
                onChangeText={setCategory}
                placeholder="Selecione..."
                style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
              />
            </FormGroup>

            <FormGroup>
              <Text style={{ marginBottom: 8, fontWeight: "500" }}>
                Prioridade
              </Text>
              {/* Implementar Select de prioridade */}
            </FormGroup>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!title || !description || !category}
              style={{
                marginTop: 24,
                padding: 15,
                backgroundColor: (!title || !description || !category) ? "#CCC" : "#007AFF",
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                Criar Ticket
              </Text>
            </TouchableOpacity>
          </Content>
        </ScrollView>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default CreateTicket;
```

## 5. Tela de Detalhes do Ticket

```typescript
// src/pages/Ticketeria/TicketDetails/index.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ScrollView, Alert } from "react-native";
import { TextInput, TouchableOpacity, Text, View } from "react-native";
import TicketStatusBadge from "../../../components/_fragments/TicketStatusBadge";
import TicketComment from "../../../components/_fragments/TicketComment";
// Nota: Você precisará criar seus próprios componentes ou usar componentes do React Native
import {
  fetchTicketById,
  updateTicket,
  addComment,
  Ticket,
} from "../../../services/TicketApi";
import { Container, Header, Content, Section, Actions } from "./styles";

const TicketDetails = ({ navigation, route }: NativeStackScreenProps<any>) => {
  const ticketId = route.params?.ticketId;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setError(false);
      setLoading(true);
      const data = await fetchTicketById(ticketId);
      setTicket(data);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await updateTicket(ticketId, { status: newStatus });
      Alert.alert("Sucesso", "Status atualizado!");
      loadTicket();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o status");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("Erro", "Digite um comentário");
      return;
    }

    try {
      await addComment(ticketId, newComment);
      setNewComment("");
      Alert.alert("Sucesso", "Comentário adicionado!");
      loadTicket();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível adicionar o comentário");
    }
  };

  if (loading) {
    return (
      <Container>
        <Text>Carregando...</Text>
      </Container>
    );
  }

  if (error || !ticket) {
    return (
      <Container>
        <Text>Erro ao carregar ticket</Text>
        <TouchableOpacity onPress={loadTicket}>
          <Text>Tentar novamente</Text>
        </TouchableOpacity>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 25 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Detalhes do Ticket
        </Text>
        <View style={{ width: 25 }} />
      </Header>

      <ScrollView>
        <Content>
          <Section>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
              {ticket.title}
            </Text>
            <TicketStatusBadge status={ticket.status} />
          </Section>

          <Section>
            <Text style={{ marginBottom: 16 }}>
              {ticket.description}
            </Text>
          </Section>

          <Section>
            <Text style={{ fontWeight: "500", marginBottom: 8 }}>
              Informações
            </Text>
            <Text style={{ fontSize: 12, color: "#666" }}>
              Categoria: {ticket.category}
            </Text>
            <Text style={{ fontSize: 12, color: "#666" }}>
              Prioridade: {ticket.priority}
            </Text>
            <Text style={{ fontSize: 12, color: "#666" }}>
              Criado em: {new Date(ticket.createdAt).toLocaleString("pt-BR")}
            </Text>
          </Section>

          <Section>
            <Text style={{ fontWeight: "500", marginBottom: 16 }}>
              Comentários ({ticket.comments?.length || 0})
            </Text>
            {ticket.comments && ticket.comments.length > 0 ? (
              ticket.comments.map((comment) => (
                <TicketComment key={comment.id} comment={comment} />
              ))
            ) : (
              <Text style={{ fontSize: 12, color: "#666" }}>
                Nenhum comentário ainda
              </Text>
            )}

            {/* Input para novo comentário */}
            <View style={{ marginTop: 16 }}>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Adicione um comentário..."
                multiline
                style={{ borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 80 }}
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={{
                  marginTop: 8,
                  padding: 15,
                  backgroundColor: "#007AFF",
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  Enviar Comentário
                </Text>
              </TouchableOpacity>
            </View>
          </Section>

          <Actions>
            <TouchableOpacity
              onPress={() => handleUpdateStatus("resolved")}
              disabled={ticket.status === "resolved"}
              style={{
                padding: 15,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                opacity: ticket.status === "resolved" ? 0.5 : 1,
              }}
            >
              <Text>Marcar como Resolvido</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleUpdateStatus("closed")}
              disabled={ticket.status === "closed"}
              style={{
                padding: 15,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                opacity: ticket.status === "closed" ? 0.5 : 1,
              }}
            >
              <Text>Fechar Ticket</Text>
            </TouchableOpacity>
          </Actions>
        </Content>
      </ScrollView>
    </Container>
  );
};

export default TicketDetails;
```

---

## 6. Exemplo com AsyncStorage (Cache Local)

```typescript
// src/pages/Ticketeria/index.tsx (versão com cache)
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { 
  getTicketsFromStorage, 
  saveTicketsToStorage,
  isCacheValid 
} from "../../helpers/ticketStorage";
import { fetchTickets, Ticket } from "../../services/TicketApi";
// Nota: Você precisará criar componentes Loading e Error ou usar alternativas

const TicketeriaList = ({ navigation }: NativeStackScreenProps<any>) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async (forceRefresh: boolean = false) => {
    // Carregar do cache primeiro (se não for refresh forçado)
    if (!forceRefresh) {
      const cachedTickets = await getTicketsFromStorage();
      if (cachedTickets && cachedTickets.data.length > 0) {
        setTickets(cachedTickets.data);
        setLoading(false);
        // Continuar buscando da API em background
      }
    }

    // Buscar da API
    try {
      setLoading(true);
      setIsOffline(false);
      
      const response = await fetchTickets({ page: 1, limit: 20 });
      
      setTickets(response.data);
      await saveTicketsToStorage(response); // Salvar no cache
      setIsOffline(false);
    } catch (error) {
      // Se falhar, tentar usar cache
      const cachedTickets = await getTicketsFromStorage();
      if (cachedTickets) {
        setTickets(cachedTickets.data);
        setIsOffline(true); // Mostrar que está offline
      } else {
        // Sem cache e sem internet = erro
        setError(true);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTickets(true); // Force refresh
  };

  // Resto do código...
};
```

## 7. Exemplo com Biometria

```typescript
// Componente de botão de login por biometria
import React, { useState } from "react";
import { Alert, TouchableOpacity, Text } from "react-native";
import { useBiometric } from "../../hooks/useBiometric";
import { useAuth } from "../../contexts/auth";
// Nota: Ajuste conforme sua estrutura de contexto de autenticação

const BiometricLoginButton = () => {
  const { isAvailable, authenticate, getSavedCredentials } = useBiometric();
  const { handleSignIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleBiometricLogin = async () => {
    if (!isAvailable) {
      Alert.alert("Biometria não disponível");
      return;
    }

    setLoading(true);

    try {
      // Autenticar biometria
      const authenticated = await authenticate();
      
      if (!authenticated) {
        return; // Usuário cancelou
      }

      // Buscar credenciais salvas
      const credentials = await getSavedCredentials();
      
      if (!credentials) {
        Alert.alert("Erro", "Nenhuma credencial encontrada.");
        return;
      }

      // Fazer login
      await handleSignIn({
        email: credentials.email,
        password: credentials.password,
        origin: "biometric",
      });
    } catch (error) {
      Alert.alert("Erro", "Falha na autenticação biométrica.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAvailable) {
    return null; // Não mostrar se não disponível
  }

  return (
    <TouchableOpacity
      onPress={handleBiometricLogin}
      disabled={loading}
      style={{
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: "center",
        opacity: loading ? 0.5 : 1,
      }}
    >
      <Text>🔐 Entrar com Biometria</Text>
    </TouchableOpacity>
  );
};
```

---

## 📝 Notas sobre os Exemplos

1. **Componentes:** Você precisará criar seus próprios componentes base (Text, Input, Button, etc.) usando React Native ou styled-components
2. **Helpers:** Crie helpers conforme necessário (ex: `formatDateBr`)
3. **Navegação:** Ajuste os nomes das rotas conforme sua implementação
4. **Estilos:** Use styled-components para estilização, seguindo os padrões do projeto
5. **TypeScript:** Mantenha a tipagem forte conforme os exemplos
6. **AsyncStorage:** Consulte `ASYNCSTORAGE_BIOMETRIA.md` para mais detalhes sobre cache e biometria
7. **SQLite:** Consulte `SQLITE_OFFLINE.md` para modo offline robusto
8. **Biometria:** Use `react-native-biometrics` e siga os padrões do projeto em `src/helpers/cryptoData.ts` (se existir)

**Use esses exemplos como referência e adapte conforme necessário!**

