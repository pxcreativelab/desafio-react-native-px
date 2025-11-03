# 🎫 Sistema de Ticketeria - React Native

Sistema completo de gerenciamento de tickets desenvolvido em React Native com TypeScript.

## ✅ Status do Projeto

**MVP COMPLETO - Todas as funcionalidades obrigatórias implementadas!**

## 🚀 Funcionalidades Implementadas

### ✅ Core Features (MVP)
- ✅ **Listagem de Tickets** - Lista completa com scroll infinito
- ✅ **Busca** - Busca por título ou número do ticket
- ✅ **Filtros** - Filtros por status (aberto, em andamento, resolvido, fechado)
- ✅ **Cadastro de Ticket** - Formulário completo com validações
- ✅ **Detalhes do Ticket** - Visualização completa de informações
- ✅ **Comentários** - Sistema de adicionar e visualizar comentários
- ✅ **Alteração de Status** - Atualização do status do ticket
- ✅ **Cache Local** - AsyncStorage para modo offline básico
- ✅ **Pull to Refresh** - Atualização manual da lista
- ✅ **Loading States** - Estados de carregamento em todas as telas

## 📱 Telas do App

### 1. **Listagem de Tickets** (`src/pages/Ticketeria/`)
- Card visual para cada ticket
- Busca em tempo real
- Filtros por status
- Paginação infinita
- Cache local com AsyncStorage
- Modo offline com dados salvos

### 2. **Criar Ticket** (`src/pages/Ticketeria/CreateTicket/`)
- Formulário completo
- Validações em tempo real
- Campos: título, descrição, categoria, prioridade
- Feedback visual de erros

### 3. **Detalhes do Ticket** (`src/pages/Ticketeria/TicketDetails/`)
- Todas as informações do ticket
- Lista de comentários
- Adicionar novos comentários
- Alterar status do ticket
- Cache local dos detalhes

## 🛠️ Tecnologias Utilizadas

- **React Native 0.82.1**
- **TypeScript 5.9.3**
- **React Navigation 7** (Native Stack)
- **Styled Components 6.1.19**
- **AsyncStorage 2.2.0** (Cache local)
- **Axios 1.13.1** (Requisições HTTP)
- **@react-native-vector-icons/fontawesome6** (Ícones)

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   └── _fragments/
│       ├── TicketCard/          # Card de ticket na lista
│       ├── TicketStatusBadge/   # Badge de status
│       └── TicketComment/       # Item de comentário
├── helpers/
│   └── ticketStorage.ts         # Funções de cache (AsyncStorage)
├── pages/
│   └── Ticketeria/
│       ├── index.tsx            # Listagem de tickets
│       ├── styles.ts
│       ├── CreateTicket/        # Criação de ticket
│       │   ├── index.tsx
│       │   └── styles.ts
│       └── TicketDetails/       # Detalhes do ticket
│           ├── index.tsx
│           └── styles.ts
├── routes/
│   └── index.tsx                # Configuração de rotas
├── services/
│   ├── Api.ts                   # Cliente Axios base
│   └── TicketApi.ts            # API de tickets
└── styles/
    └── theme.ts                 # Tema do app
```

## 🎨 Design System

### Cores
- **Primary:** #007AFF (Azul iOS)
- **Success:** #34C759 (Verde)
- **Warning:** #FF9500 (Laranja)
- **Danger:** #FF3B30 (Vermelho)
- **Background:** #F2F2F7 (Cinza claro)
- **Card:** #FFFFFF (Branco)

### Status Colors
- **Aberto:** Laranja (#FF9500)
- **Em Andamento:** Azul (#007AFF)
- **Resolvido:** Verde (#34C759)
- **Fechado:** Cinza (#8E8E93)

## 🔧 Configuração e Execução

### Pré-requisitos
- Node.js >= 20
- React Native CLI
- Android Studio ou Xcode
- Emulador ou dispositivo físico

### Instalação

```bash
# Instalar dependências
yarn install

# iOS (apenas macOS)
cd ios && pod install && cd ..

# Executar Metro Bundler
yarn start

# Executar no Android
yarn android

# Executar no iOS
yarn ios
```

## 🌐 API

### Endpoints Implementados

**Base URL:** `http://localhost:3000/api/v1` (desenvolvimento)

- `GET /tickets` - Listar tickets
- `GET /tickets/:id` - Buscar ticket por ID
- `POST /tickets` - Criar novo ticket
- `PUT /tickets/:id` - Atualizar ticket
- `POST /tickets/:id/comments` - Adicionar comentário

### Parâmetros de Query (GET /tickets)
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)
- `status`: Filtrar por status
- `search`: Buscar por texto
- `sort`: Ordenação (padrão: createdAt_desc)

## 💾 Cache e Modo Offline

O app implementa cache local usando AsyncStorage:

- **Lista de Tickets:** Salva após cada busca bem-sucedida
- **Detalhes do Ticket:** Salva ao visualizar cada ticket
- **Validade do Cache:** 5 minutos
- **Modo Offline:** Carrega dados do cache quando offline

### Funções de Cache (ticketStorage.ts)
- `saveTicketsToStorage()` - Salvar lista
- `getTicketsFromStorage()` - Recuperar lista
- `saveTicketDetailsToStorage()` - Salvar detalhes
- `getTicketDetailsFromStorage()` - Recuperar detalhes
- `isCacheValid()` - Verificar validade
- `clearAllCache()` - Limpar tudo

## 📝 Modelos de Dados

### Ticket
```typescript
interface Ticket {
  id: string | number;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
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
```

### Comment
```typescript
interface Comment {
  id: string | number;
  text: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}
```

## 🎯 Próximas Melhorias (Opcionais)

- [ ] SQLite para modo offline robusto
- [ ] Sistema de sincronização de pendências
- [ ] Upload e visualização de anexos
- [ ] Login por biometria
- [ ] Notificações push
- [ ] Testes unitários
- [ ] Animações avançadas

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

---

**Desenvolvido com ❤️ usando React Native**
