# 🎯 Desafio Ticketeria - Guia Rápido

Bem-vindo ao desafio de desenvolvimento do sistema de Ticketeria! Este guia rápido vai te ajudar a começar.

## 🚀 Quick Start

### 1. Leia a Documentação Principal
Comece lendo o arquivo `DESAFIO_TICKETERIA.md` na raiz do projeto. Ele contém todos os requisitos e especificações.

### 2. Entenda a Estrutura
Consulte `ESTRUTURA_BASE.md` para ver a organização de arquivos esperada.

### 3. Configurar API Mock (Opcional)
Se não tiver acesso à API real ainda, veja `API_MOCK.md` para configurar um ambiente de testes.

### 4. Veja Exemplos de Código
O arquivo `EXEMPLOS_CODIGO.md` contém exemplos completos de componentes para te orientar.

### 5. AsyncStorage e Biometria
Consulte `ASYNCSTORAGE_BIOMETRIA.md` para implementar cache local e login por biometria.

### 6. SQLite para Modo Offline
Consulte `SQLITE_OFFLINE.md` para implementar modo offline robusto com SQLite.

## 📋 Checklist Rápido

Use este checklist durante o desenvolvimento:

### Fase 1: Setup e Estrutura
- [ ] Criar estrutura de pastas
- [ ] Criar `TicketApi.ts` com interfaces TypeScript
- [ ] Implementar funções básicas de API (fetch, create)

### Fase 2: Componentes Base
- [ ] Criar `TicketStatusBadge`
- [ ] Criar `TicketCard`
- [ ] Criar `TicketComment` (se necessário)

### Fase 3: Páginas Principais
- [ ] Implementar lista de tickets
- [ ] Adicionar busca e filtros
- [ ] Implementar página de detalhes
- [ ] Implementar página de criação

### Fase 4: Integração
- [ ] Adicionar rotas no `App.routes.tsx`
- [ ] Conectar todas as telas
- [ ] Testar fluxo completo

### Fase 5: Refinamento
- [ ] Adicionar tratamento de erros
- [ ] Melhorar UX/UI
- [ ] Otimizar performance
- [ ] Testar em diferentes cenários

### Fase 6: AsyncStorage e SQLite
- [ ] Implementar cache local com AsyncStorage
- [ ] Implementar SQLite para modo offline robusto
- [ ] Sistema de sincronização de pendências
- [ ] Ver documentação em `ASYNCSTORAGE_BIOMETRIA.md` e `SQLITE_OFFLINE.md`

### Fase 7: Biometria
- [ ] Implementar login por biometria
- [ ] Ver documentação em `ASYNCSTORAGE_BIOMETRIA.md`

## 🔍 Referências Rápidas

### Arquivos Importantes no Projeto

```
📁 src/
├── 📄 pages/NewTicket/          → Exemplo de criação de ticket
├── 📄 pages/Services/            → Exemplo de listagem
├── 📄 pages/TicketChat/          → Exemplo de detalhes/interação
├── 📄 services/Api.ts            → Cliente Axios base
├── 📄 services/Auth.ts           → Exemplo de serviço
├── 📄 routes/App.routes.tsx      → Onde adicionar rotas
├── 📄 components/_core/          → Biblioteca de componentes
└── 📄 styles/theme.ts            → Tema e cores
```

### Componentes Core Disponíveis

- `Text` - Texto estilizado
- `Input` - Campo de texto
- `InputMask` - Campo com máscara
- `Button` - Botão
- `Icon` - Ícones (Ionicons)
- `Loading` - Loading state
- `Error` - Estado de erro
- `Checkbox` - Checkbox
- `InputBool` - Input booleano

### Padrões de API

```typescript
// Padrão usado no projeto:
export const fetchData = (params?: any): Promise<ResponseType> =>
  new Promise((resolve, reject) => {
    api
      .get("/endpoint", { params })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("ERROR fetchData -> ", error.response);
        reject(error.message);
      });
  });
```

### Padrão de Estilos

```typescript
import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundPage};
`;
```

## ❓ Dúvidas Comuns

**Q: Onde adicionar as rotas?**
A: Em `src/routes/App.routes.tsx`, dentro do `Stack.Navigator`.

**Q: Como usar o tema do projeto?**
A: Importe `theme` de `src/styles/theme.ts` ou use styled-components com `theme.colors`.

**Q: Como lidar com autenticação nas APIs?**
A: O `api` do `src/services/Api.ts` já deve ter interceptors configurados. Verifique se há tokens sendo enviados automaticamente.

**Q: Não consigo testar a API, o que fazer?**
A: Use uma das opções de mock descritas em `API_MOCK.md`.

**Q: Preciso criar componentes do zero?**
A: Não! Use os componentes de `src/components/_core/`. Só crie novos se realmente necessário.

## 🎨 Dicas de Desenvolvimento

1. **Teste Componente por Componente:** Não tente fazer tudo de uma vez
2. **Use os Exemplos:** Os exemplos em `EXEMPLOS_CODIGO.md` são para orientar, não copiar cegamente
3. **Siga os Padrões:** Mantenha consistência com o código existente
4. **Valide Sempre:** Implemente validações nos formulários
5. **Trate Erros:** Sempre trate casos de erro e estados vazios

## 📞 Suporte

Se tiver dúvidas:
1. Consulte os arquivos de exemplo no projeto
2. Veja como outras páginas similares foram implementadas
3. Revise a documentação criada para este desafio

---

**Boa sorte e divirta-se codando! 🚀**

