# ✅ Checklist do Desafio Ticketeria

Use este checklist para acompanhar seu progresso durante o desenvolvimento.

## 📁 Fase 1: Estrutura e Setup

### Criação de Arquivos
- [ ] Criar pasta `src/pages/Ticketeria/`
- [ ] Criar pasta `src/pages/Ticketeria/CreateTicket/`
- [ ] Criar pasta `src/pages/Ticketeria/TicketDetails/`
- [ ] Criar pasta `src/components/_fragments/TicketCard/`
- [ ] Criar pasta `src/components/_fragments/TicketStatusBadge/`
- [ ] Criar pasta `src/components/_fragments/TicketComment/` (opcional)
- [ ] Criar `src/services/TicketApi.ts`
- [ ] Criar `src/helpers/ticketStorage.ts` (helpers para AsyncStorage)

### Configuração Base
- [ ] Definir interfaces TypeScript (`Ticket`, `Comment`, `Attachment`)
- [ ] Implementar função `fetchTickets()`
- [ ] Implementar função `fetchTicketById()`
- [ ] Implementar função `createTicket()`
- [ ] Implementar função `updateTicket()`
- [ ] Implementar função `addComment()`
- [ ] Testar chamadas de API (com mock ou real)

### AsyncStorage Helpers
- [ ] Criar função `saveTicketsToStorage()`
- [ ] Criar função `getTicketsFromStorage()`
- [ ] Criar função `saveTicketDetailsToStorage()`
- [ ] Criar função `getTicketDetailsFromStorage()`
- [ ] Criar função `clearTicketCache()`
- [ ] Criar função `saveUserPreferences()` (filtros, ordenação)

---

## 🎨 Fase 2: Componentes Base

### TicketStatusBadge
- [ ] Criar componente
- [ ] Implementar cores por status
- [ ] Testar renderização com diferentes status
- [ ] Estilizar conforme design system

### TicketCard
- [ ] Criar estrutura básica
- [ ] Exibir título e descrição
- [ ] Integrar `TicketStatusBadge`
- [ ] Adicionar informações de categoria
- [ ] Adicionar informações de prioridade
- [ ] Adicionar data de criação
- [ ] Adicionar contador de comentários (se houver)
- [ ] Implementar ação de toque
- [ ] Estilizar conforme design system

### TicketComment (se aplicável)
- [ ] Criar estrutura básica
- [ ] Exibir texto do comentário
- [ ] Exibir autor e data
- [ ] Estilizar conforme design system

---

## 📱 Fase 3: Listagem de Tickets

### Página Principal (`Ticketeria/index.tsx`)
- [ ] Criar estrutura básica da página
- [ ] Implementar estado de loading
- [ ] Implementar estado de erro
- [ ] Implementar lista básica de tickets
- [ ] Integrar `TicketCard`
- [ ] Implementar pull to refresh
- [ ] Implementar scroll infinito ou paginação
- [ ] Adicionar header com busca
- [ ] Implementar busca de tickets
- [ ] Adicionar filtros por status
- [ ] Implementar ordenação
- [ ] Tratar estado vazio (sem tickets)
- [ ] Tratar estado de busca sem resultados
- [ ] Adicionar botão para criar novo ticket
- [ ] Navegação para detalhes ao tocar no card
- [ ] Navegação para criação ao tocar no botão
- [ ] Estilizar conforme design system

### Funcionalidades de Busca/Filtro
- [ ] Input de busca funcional
- [ ] Filtro por status funcionando
- [ ] Debounce na busca (opcional, recomendado)
- [ ] Feedback visual durante busca

---

## ✏️ Fase 4: Criação de Ticket

### Formulário de Criação (`CreateTicket/index.tsx`)
- [ ] Criar estrutura básica da página
- [ ] Campo de título (com validação)
- [ ] Campo de descrição (com validação)
- [ ] Campo de categoria (select/dropdown)
- [ ] Campo de prioridade (select/dropdown)
- [ ] Validação em tempo real
- [ ] Mensagens de erro claras
- [ ] Indicador de campos obrigatórios
- [ ] Upload de anexos (opcional, mas recomendado)
- [ ] Preview de anexos selecionados
- [ ] Botão de submit
- [ ] Loading state durante submissão
- [ ] Feedback de sucesso/erro
- [ ] Redirecionamento após sucesso
- [ ] Navegação de volta (cancelar)
- [ ] Estilizar conforme design system

### Validações
- [ ] Título mínimo de 5 caracteres
- [ ] Descrição mínima de 10 caracteres
- [ ] Categoria obrigatória
- [ ] Mensagens de erro específicas por campo

---

## 🔍 Fase 5: Detalhes do Ticket

### Página de Detalhes (`TicketDetails/index.tsx`)
- [ ] Criar estrutura básica da página
- [ ] Implementar estado de loading
- [ ] Implementar estado de erro
- [ ] Exibir título do ticket
- [ ] Exibir descrição do ticket
- [ ] Exibir informações (categoria, prioridade, datas)
- [ ] Exibir badge de status
- [ ] Listar comentários
- [ ] Mostrar comentários vazios se não houver
- [ ] Formulário para adicionar comentário
- [ ] Botão para enviar comentário
- [ ] Atualizar lista após adicionar comentário
- [ ] Botão para alterar status
- [ ] Modal ou ação para alterar status
- [ ] Atualizar ticket após mudança de status
- [ ] Listar anexos (se houver)
- [ ] Visualizar/download de anexos
- [ ] Navegação de volta
- [ ] Pull to refresh (opcional)
- [ ] Estilizar conforme design system

### Ações Disponíveis
- [ ] Marcar como "Em Andamento"
- [ ] Marcar como "Resolvido"
- [ ] Fechar ticket
- [ ] Reabrir ticket (se aplicável)

---

## 🔗 Fase 6: Integração e Rotas

### Rotas
- [ ] Adicionar rota `Ticketeria` no `App.routes.tsx`
- [ ] Adicionar rota `CreateTicket` no `App.routes.tsx`
- [ ] Adicionar rota `TicketDetails` no `App.routes.tsx`
- [ ] Testar navegação entre todas as telas
- [ ] Verificar deep linking (se aplicável)

### Integração com App
- [ ] Adicionar entrada no menu principal (se necessário)
- [ ] Verificar autenticação (se necessário)
- [ ] Testar fluxo completo do usuário

---

## 🎨 Fase 7: UX/UI e Refinamento

### Feedback Visual
- [ ] Loading states em todas as operações
- [ ] Estados de erro tratados
- [ ] Mensagens de sucesso claras
- [ ] Feedback durante submissão de formulários
- [ ] Animações suaves (opcional)

### Estados Especiais
- [ ] Tela vazia (sem tickets)
- [ ] Busca sem resultados
- [ ] Erro de rede
- [ ] Loading durante carregamento inicial

### Responsividade
- [ ] Funciona bem em diferentes tamanhos de tela
- [ ] Texto não quebra layout
- [ ] Componentes responsivos

---

## 🐛 Fase 8: Tratamento de Erros

### Erros de API
- [ ] Tratar erro de rede
- [ ] Tratar erro 404 (ticket não encontrado)
- [ ] Tratar erro 400 (validação)
- [ ] Tratar erro 500 (servidor)
- [ ] Mensagens de erro amigáveis

### Erros de Formulário
- [ ] Validação client-side
- [ ] Exibir erros de validação do servidor
- [ ] Prevenir submissão duplicada

---

## 🚀 Fase 9: Otimização e Performance

### Performance
- [ ] Otimizar re-renders (React.memo onde necessário)
- [ ] Lazy loading de imagens (se aplicável)
- [ ] Debounce na busca
- [ ] Paginação ou virtualização de lista

### Código
- [ ] Remover console.logs desnecessários
- [ ] Remover código comentado
- [ ] Comentários onde necessário
- [ ] TypeScript sem erros
- [ ] Lint sem erros

---

## 💾 Fase 10: AsyncStorage e Cache Local

### Implementação de Cache
- [ ] Salvar lista de tickets no AsyncStorage após busca bem-sucedida
- [ ] Carregar tickets do cache ao iniciar (mostrar dados antigos)
- [ ] Atualizar cache após criar novo ticket
- [ ] Atualizar cache após atualizar ticket
- [ ] Salvar detalhes do ticket para acesso offline
- [ ] Implementar invalidação de cache (após X minutos ou pull to refresh)
- [ ] Salvar preferências do usuário (filtros selecionados)
- [ ] Sincronizar dados quando voltar online

### Funcionalidade Offline
- [ ] Exibir dados do cache quando sem internet
- [ ] Mostrar indicador visual de "dados offline"
- [ ] Fila de ações pendentes (criar ticket offline, salvar comentário)
- [ ] Sincronizar quando voltar online

## 💾 Fase 11: SQLite para Modo Offline

### Estrutura SQLite
- [ ] Adicionar tabelas de Tickets ao `sqlite.ts`
- [ ] Criar tabela `Tickets`
- [ ] Criar tabela `TicketComments`
- [ ] Criar tabela `TicketAttachments`
- [ ] Criar tabela `PendingTicketActions`
- [ ] Testar criação de tabelas

### Operações SQLite
- [ ] Criar `ticketSqliteOperations.ts`
- [ ] Implementar `fetchSQLiteTickets()`
- [ ] Implementar `insertSQLiteTicket()`
- [ ] Implementar `fetchSQLiteTicketById()`
- [ ] Implementar `fetchSQLiteComments()`
- [ ] Implementar `insertSQLiteComment()`
- [ ] Implementar `fetchSQLiteAttachments()`
- [ ] Implementar `insertSQLiteAttachment()`
- [ ] Implementar `savePendingAction()`
- [ ] Implementar `getPendingActions()`
- [ ] Implementar `markActionAsSynced()`

### Sincronização
- [ ] Implementar `syncPendingActions()`
- [ ] Detectar mudança de conexão (NetInfo)
- [ ] Sincronizar automaticamente ao voltar online
- [ ] Tratar IDs temporários vs server IDs
- [ ] Implementar limite de tentativas de sincronização
- [ ] Limpar registros antigos sincronizados

### Integração
- [ ] Carregar tickets do SQLite quando offline
- [ ] Salvar tickets no SQLite após criação/atualização
- [ ] Criar tickets offline e marcar como pendente
- [ ] Adicionar comentários offline
- [ ] Visualizar tickets offline
- [ ] Indicador visual de modo offline

## 🔐 Fase 12: Login com Biometria

### Configuração de Biometria
- [ ] Verificar disponibilidade do sensor biométrico
- [ ] Implementar detecção de tipo (TouchID, FaceID, Fingerprint)
- [ ] Criar componente/hook para biometria
- [ ] Integrar com `react-native-biometrics`

### Autenticação Biométrica
- [ ] Implementar função de login por biometria
- [ ] Salvar credenciais criptografadas usando `cryptoData` helper
- [ ] Carregar credenciais ao iniciar app (se habilitado)
- [ ] Solicitar biometria ao fazer login
- [ ] Tratar erros de biometria (usuário cancelou, falha, etc.)
- [ ] Permitir habilitar/desabilitar nas configurações

### Integração com Auth Context
- [ ] Integrar com contexto de autenticação existente
- [ ] Usar mesmo padrão de criptografia do projeto
- [ ] Seguir padrão de `BIOMETRIC_STORAGE_NAME` do config
- [ ] Validar token após login biométrico

## ✅ Fase 13: Testes e Validação Final

### Testes Funcionais
- [ ] Criar ticket completo
- [ ] Listar tickets
- [ ] Buscar tickets
- [ ] Filtrar por status
- [ ] Visualizar detalhes
- [ ] Adicionar comentário
- [ ] Alterar status
- [ ] Navegação entre telas

### Testes de Edge Cases
- [ ] Testar com lista vazia
- [ ] Testar com muitos tickets
- [ ] Testar busca sem resultados
- [ ] Testar sem conexão
- [ ] Testar com campos inválidos
- [ ] Testar upload de arquivos grandes

### Validação Final
- [ ] Tudo funciona conforme especificado
- [ ] Código segue padrões do projeto
- [ ] Interface consistente
- [ ] Sem erros no console
- [ ] Performance aceitável
- [ ] Cache funcionando corretamente
- [ ] SQLite funcionando para modo offline
- [ ] Sincronização de pendências funcionando
- [ ] Biometria funcionando (se implementado)
- [ ] Funcionalidade offline testada
- [ ] Testado criar ticket offline
- [ ] Testado sincronização quando voltar online

---

## 📝 Documentação (Opcional)

- [ ] Adicionar comentários em funções complexas
- [ ] Documentar componentes principais
- [ ] Atualizar README se necessário

---

## 🎁 Extras (Opcional - Bônus)

### Funcionalidades Adicionais
- [ ] Testes unitários
- [ ] Animações
- [ ] Modo offline
- [ ] Notificações push
- [ ] Exportar tickets
- [ ] Gráficos/estatísticas
- [ ] Busca avançada com múltiplos filtros
- [ ] Histórico de alterações

---

## 📊 Progresso Geral

- [ ] **0-25%** - Estrutura e componentes base criados
- [ ] **25-50%** - Listagem e criação funcionando
- [ ] **50-75%** - Detalhes e integração completa
- [ ] **75-100%** - Refinamento e otimização

---

**Dica:** Marque os itens conforme for completando. Isso ajuda a manter o foco e não esquecer nada importante!

