# 💻 Exemplos de Código Completos

Este arquivo contém exemplos mais completos e detalhados para te orientar na implementação.

## 1. Componente TicketCard Completo

```typescript
// src/components/_fragments/TicketCard/index.tsx
import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "../../../components/_core/Icon";
import Text from "../../../components/_core/Text";
import TicketStatusBadge from "../TicketStatusBadge";
import { Ticket } from "../../../services/TicketApi";
import { Container, Header, Content, Footer, MetaInfo } from "./styles";
import { formatDateBr } from "../../../helpers/formatDateBr";

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
          <Text size="h3" weight="bold" numberOfLines={2} style={{ flex: 1 }}>
            {ticket.title}
          </Text>
          <TicketStatusBadge status={ticket.status} />
        </Header>

        <Content>
          <Text size="p" color="gray" numberOfLines={2}>
            {ticket.description}
          </Text>
        </Content>

        <Footer>
          <MetaInfo>
            <Icon name="folder-outline" size={16} color="gray" />
            <Text size="small" color="gray">
              {ticket.category}
            </Text>
          </MetaInfo>

          <MetaInfo>
            <Icon name="flag-outline" size={16} color={getPriorityColor(ticket.priority)} />
            <Text size="small" color="gray">
              {getPriorityLabel(ticket.priority)}
            </Text>
          </MetaInfo>

          <Text size="small" color="gray">
            {formatDateBr(ticket.createdAt)}
          </Text>
        </Footer>

        {ticket.comments && ticket.comments.length > 0 && (
          <MetaInfo style={{ marginTop: 8 }}>
            <Icon name="chatbubble-outline" size={16} color="gray" />
            <Text size="small" color="gray">
              {ticket.comments.length} comentário{ticket.comments.length > 1 ? "s" : ""}
            </Text>
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
```

## 2. TicketStatusBadge

```typescript
// src/components/_fragments/TicketStatusBadge/index.tsx
import React from "react";
import Text from "../../_core/Text";
import { Container } from "./styles";

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
      <Text size="small" weight="medium" color={config.color}>
        {config.label}
      </Text>
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
```

## 3. Lista de Tickets com Busca e Filtros

```typescript
// src/pages/Ticketeria/index.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, RefreshControl, View, FlatList } from "react-native";
import Loading from "../../components/_core/Loading";
import Error from "../../components/_core/Error";
import Icon from "../../components/_core/Icon";
import InputSearch from "../../components/_core/InputSearch";
import Button from "../../components/_core/Button";
import TicketCard from "../../components/_fragments/TicketCard";
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
    return <Loading fullHeight />;
  }

  if (error && tickets.length === 0) {
    return <Error onRefresh={() => loadTickets(true)} />;
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
        <InputSearch
          placeholder="Buscar tickets..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <Icon
          name="add-circle-outline"
          size={28}
          color="primary"
          onPress={handleCreateTicket}
        />
      </Header>

      <FilterRow>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map((filter) => (
            <Button
              key={filter.value || "all"}
              label={filter.label}
              outline={selectedStatus !== filter.value}
              active={selectedStatus === filter.value}
              onPress={() => handleStatusFilter(filter.value)}
              style={{ marginRight: 8 }}
            />
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
            <Icon name="ticket-outline" size={64} color="gray" />
            <Text size="p" color="gray" style={{ marginTop: 16, textAlign: "center" }}>
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
import { Alert, Keyboard, ScrollView, TouchableWithoutFeedback } from "react-native";
import Loading from "../../../components/_core/Loading";
import Input from "../../../components/_core/Input";
import InputMask from "../../../components/_core/InputMask";
import Button from "../../../components/_core/Button";
import Icon from "../../../components/_core/Icon";
import Text from "../../../components/_core/Text";
import { createTicket } from "../../../services/TicketApi";
import { Container, Content, Header, Footer, FormGroup } from "./styles";

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
    return <Loading fullHeight />;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <Header>
          <Icon name="close-outline" size={28} color="gray" onPress={() => navigation.goBack()} />
          <Text size="h2" weight="bold">
            Novo Ticket
          </Text>
          <View style={{ width: 28 }} />
        </Header>

        <ScrollView>
          <Content>
            <FormGroup>
              <Text size="p" weight="medium" style={{ marginBottom: 8 }}>
                Título *
              </Text>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Erro ao fazer login"
                maxLength={100}
              />
            </FormGroup>

            <FormGroup>
              <Text size="p" weight="medium" style={{ marginBottom: 8 }}>
                Descrição *
              </Text>
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder="Descreva o problema ou solicitação..."
                multiline
                numberOfLines={6}
                style={{ minHeight: 120 }}
              />
            </FormGroup>

            <FormGroup>
              <Text size="p" weight="medium" style={{ marginBottom: 8 }}>
                Categoria *
              </Text>
              {/* Implementar Select/Dropdown aqui */}
              <Input value={category} onChangeText={setCategory} placeholder="Selecione..." />
            </FormGroup>

            <FormGroup>
              <Text size="p" weight="medium" style={{ marginBottom: 8 }}>
                Prioridade
              </Text>
              {/* Implementar Select de prioridade */}
            </FormGroup>

            <Button
              label="Criar Ticket"
              onPress={handleSubmit}
              disabled={!title || !description || !category}
              style={{ marginTop: 24 }}
            />
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
import Loading from "../../../components/_core/Loading";
import Error from "../../../components/_core/Error";
import Text from "../../../components/_core/Text";
import Button from "../../../components/_core/Button";
import Icon from "../../../components/_core/Icon";
import TicketStatusBadge from "../../../components/_fragments/TicketStatusBadge";
import TicketComment from "../../../components/_fragments/TicketComment";
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
    return <Loading fullHeight />;
  }

  if (error || !ticket) {
    return <Error onRefresh={loadTicket} />;
  }

  return (
    <Container>
      <Header>
        <Icon name="chevron-back-outline" size={25} color="primary" onPress={() => navigation.goBack()} />
        <Text size="h2" weight="bold">
          Detalhes do Ticket
        </Text>
        <View style={{ width: 25 }} />
      </Header>

      <ScrollView>
        <Content>
          <Section>
            <Text size="h2" weight="bold" style={{ marginBottom: 8 }}>
              {ticket.title}
            </Text>
            <TicketStatusBadge status={ticket.status} />
          </Section>

          <Section>
            <Text size="p" style={{ marginBottom: 16 }}>
              {ticket.description}
            </Text>
          </Section>

          <Section>
            <Text size="p" weight="medium" style={{ marginBottom: 8 }}>
              Informações
            </Text>
            <Text size="small" color="gray">
              Categoria: {ticket.category}
            </Text>
            <Text size="small" color="gray">
              Prioridade: {ticket.priority}
            </Text>
            <Text size="small" color="gray">
              Criado em: {new Date(ticket.createdAt).toLocaleString("pt-BR")}
            </Text>
          </Section>

          <Section>
            <Text size="p" weight="medium" style={{ marginBottom: 16 }}>
              Comentários ({ticket.comments?.length || 0})
            </Text>
            {ticket.comments && ticket.comments.length > 0 ? (
              ticket.comments.map((comment) => (
                <TicketComment key={comment.id} comment={comment} />
              ))
            ) : (
              <Text size="small" color="gray">
                Nenhum comentário ainda
              </Text>
            )}

            {/* Input para novo comentário */}
            <View style={{ marginTop: 16 }}>
              <Input
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Adicione um comentário..."
                multiline
              />
              <Button
                label="Enviar Comentário"
                onPress={handleAddComment}
                style={{ marginTop: 8 }}
              />
            </View>
          </Section>

          <Actions>
            <Button
              label="Marcar como Resolvido"
              onPress={() => handleUpdateStatus("resolved")}
              outline
              disabled={ticket.status === "resolved"}
            />
            <Button
              label="Fechar Ticket"
              onPress={() => handleUpdateStatus("closed")}
              outline
              disabled={ticket.status === "closed"}
            />
          </Actions>
        </Content>
      </ScrollView>
    </Container>
  );
};

export default TicketDetails;
```

---

## 📝 Notas sobre os Exemplos

1. **Componentes Core:** Todos os componentes usados (`Input`, `Button`, `Text`, etc.) devem estar disponíveis em `src/components/_core/`
2. **Helpers:** Use os helpers existentes como `formatDateBr` se disponível
3. **Navegação:** Ajuste os nomes das rotas conforme sua implementação
4. **Estilos:** Adapte os estilos conforme o tema do projeto
5. **TypeScript:** Mantenha a tipagem forte conforme os exemplos

**Use esses exemplos como referência e adapte conforme necessário!**

