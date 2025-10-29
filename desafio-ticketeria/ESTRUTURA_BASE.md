# 📁 Estrutura Base do Desafio

Este documento mostra a estrutura de arquivos que você deve criar para o desafio de Ticketeria.

## 📂 Estrutura de Diretórios

```
src/
├── pages/
│   └── Ticketeria/
│       ├── index.tsx                    # Lista de tickets
│       ├── styles.ts                   # Estilos da lista
│       ├── fetchData.ts                # Chamadas de API da lista
│       │
│       ├── CreateTicket/
│       │   ├── index.tsx               # Tela de criação
│       │   ├── styles.ts               # Estilos
│       │   └── fetchData.ts           # API de criação (opcional, pode usar o principal)
│       │
│       └── TicketDetails/
│           ├── index.tsx               # Tela de detalhes
│           ├── styles.ts               # Estilos
│           └── fetchData.ts            # API de detalhes (opcional)
│
├── services/
│   └── TicketApi.ts                    # Cliente API centralizado
│
├── helpers/
│   └── ticketStorage.ts                # Helpers para AsyncStorage
│
├── database/
│   └── ticketSqliteOperations.ts       # Operações SQLite (CRUD de tickets)
│
├── hooks/
│   └── useBiometric.ts                 # Hook para biometria (opcional)
│
├── components/
│   └── _fragments/
│       ├── TicketCard/
│       │   ├── index.tsx              # Card de ticket na lista
│       │   └── styles.ts              # Estilos do card
│       │
│       ├── TicketStatusBadge/
│       │   └── index.tsx              # Badge de status (pequeno, pode não precisar styles)
│       │
│       └── TicketComment/
│           ├── index.tsx              # Item de comentário
│           └── styles.ts              # Estilos do comentário
│
└── routes/
    └── Ticketeria.routes.tsx          # Rotas do módulo (se necessário agrupar)
```

## 📄 Templates Base

### 1. `src/services/TicketApi.ts`

```typescript
import api from "./Api";

export interface Ticket {
  id: string | number;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
  comments?: Comment[];
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Comment {
  id: string | number;
  text: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Attachment {
  id: string | number;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface ListTicketsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort?: string;
}

export interface ListTicketsResponse {
  data: Ticket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTicketData {
  title: string;
  description: string;
  category: string;
  priority: string;
  attachments?: any[];
}

// Funções de API
export const fetchTickets = (params?: ListTicketsParams): Promise<ListTicketsResponse> =>
  new Promise((resolve, reject) => {
    api
      .get("/tickets", { params })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("ERROR fetchTickets -> ", error.response);
        reject(error.message);
      });
  });

export const fetchTicketById = (id: string | number): Promise<Ticket> =>
  new Promise((resolve, reject) => {
    api
      .get(`/tickets/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("ERROR fetchTicketById -> ", error.response);
        reject(error.message);
      });
  });

export const createTicket = (data: CreateTicketData): Promise<Ticket> =>
  new Promise((resolve, reject) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("priority", data.priority);

    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append("attachments", {
          uri: file.uri,
          type: file.type,
          name: file.name,
        } as any);
      });
    }

    api({
      url: "/tickets",
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("ERROR createTicket -> ", error.response);
        reject(error.message);
      });
  });

export const updateTicket = (id: string | number, data: Partial<Ticket>): Promise<Ticket> =>
  new Promise((resolve, reject) => {
    api
      .put(`/tickets/${id}`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("ERROR updateTicket -> ", error.response);
        reject(error.message);
      });
  });

export const addComment = (ticketId: string | number, text: string): Promise<Comment> =>
  new Promise((resolve, reject) => {
    api
      .post(`/tickets/${ticketId}/comments`, { text })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("ERROR addComment -> ", error.response);
        reject(error.message);
      });
  });
```

### 2. `src/pages/Ticketeria/index.tsx` (Template Básico)

```typescript
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import Loading from "../../components/_core/Loading";
import Error from "../../components/_core/Error";
import TicketCard from "../../components/_fragments/TicketCard";
import { fetchTickets, Ticket } from "../../services/TicketApi";
import { Container, Content } from "./styles";

const TicketeriaList = ({ navigation }: NativeStackScreenProps<any>) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    setError(false);
    setLoading(true);

    fetchTickets({ page: 1, limit: 20 })
      .then((response) => {
        setTickets(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTickets();
    setRefreshing(false);
  };

  const handleTicketPress = (ticket: Ticket) => {
    navigation.navigate("TicketDetails", { ticketId: ticket.id });
  };

  if (loading && !refreshing) {
    return <Loading fullHeight />;
  }

  if (error) {
    return <Error onRefresh={loadTickets} />;
  }

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Content>
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onPress={() => handleTicketPress(ticket)}
            />
          ))}
        </Content>
      </ScrollView>
    </Container>
  );
};

export default TicketeriaList;
```

### 3. `src/pages/Ticketeria/styles.ts` (Template)

```typescript
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundPage};
`;

export const Content = styled.View`
  gap: 12px;
`;
```

### 4. `src/components/_fragments/TicketCard/index.tsx` (Template)

```typescript
import React from "react";
import { TouchableOpacity } from "react-native";
import Text from "../../../components/_core/Text";
import TicketStatusBadge from "../TicketStatusBadge";
import { Ticket } from "../../../services/TicketApi";
import { Container, Title, Description, Footer, DateText } from "./styles";

interface TicketCardProps {
  ticket: Ticket;
  onPress: () => void;
}

const TicketCard = ({ ticket, onPress }: TicketCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Container>
        <Title>{ticket.title}</Title>
        <Description numberOfLines={2}>{ticket.description}</Description>
        <Footer>
          <TicketStatusBadge status={ticket.status} />
          <DateText>{new Date(ticket.createdAt).toLocaleDateString("pt-BR")}</DateText>
        </Footer>
      </Container>
    </TouchableOpacity>
  );
};

export default TicketCard;
```

### 5. Adicionar Rotas em `src/routes/App.routes.tsx`

```typescript
// No topo do arquivo, adicione o import:
import TicketeriaList from "../pages/Ticketeria";
import CreateTicket from "../pages/Ticketeria/CreateTicket";
import TicketDetails from "../pages/Ticketeria/TicketDetails";

// Dentro do Stack.Navigator, adicione:
<Stack.Screen 
  name="Ticketeria" 
  component={TicketeriaList} 
  options={{ headerShown: false }} 
/>
<Stack.Screen 
  name="CreateTicket" 
  component={CreateTicket} 
  options={{ headerShown: false }} 
/>
<Stack.Screen 
  name="TicketDetails" 
  component={TicketDetails} 
  options={{ headerShown: false }} 
/>
```

## 🎯 Ordem de Implementação Sugerida

1. **Serviço API** (`TicketApi.ts`) - Base para tudo
2. **Componente TicketCard** - Visualização básica
3. **Lista de Tickets** - Funcionalidade principal
4. **Detalhes do Ticket** - Visualização completa
5. **Criação de Ticket** - Formulário completo
6. **Melhorias e Refinamentos** - Busca, filtros, etc.

## 📝 Notas

- Adapte os templates conforme necessário
- Use os componentes do projeto existentes
- Siga os padrões de estilo vistos em outras páginas
- Não esqueça de tratar erros e estados de loading

