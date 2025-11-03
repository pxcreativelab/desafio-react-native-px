import TicketComment from '@components/_fragments/TicketComment';
import TicketStatusBadge from '@components/_fragments/TicketStatusBadge';
import {
  getTicketDetailsFromStorage,
  saveTicketDetailsToStorage,
} from '@helpers/ticketStorage';
import { useToast } from '@hooks/useToast';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import {
  addComment,
  fetchTicketById,
  Ticket,
  updateTicket,
} from '@services/TicketApi';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import {
  ActionButton,
  ActionButtonText,
  ActionsRow,
  BackButton,
  BackButtonText,
  CommentInput,
  CommentInputContainer,
  Container,
  Content,
  EmptyCommentsText,
  ErrorContainer,
  ErrorText,
  Header,
  HeaderSpacer,
  HeaderTitle,
  InfoLabel,
  InfoRow,
  InfoValue,
  LoadingContainer,
  LoadingText,
  RetryButton,
  RetryButtonText,
  Section,
  SectionTitle,
  SendButton,
  SendButtonText,
  TicketDescription,
  TicketTitle,
} from './styles';


type Props = StaticScreenProps<{
  ticketId: string;
}>;


const TicketDetails: React.FC<Props> = ({ route: { params: { ticketId } } }: Props) => {

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [sendingComment, setSendingComment] = useState<boolean>(false);

  const navigation = useNavigation();
  const toast = useToast();

  const loadTicket = async () => {
    try {
      setError(false);
      setLoading(true);

      // Tentar carregar do cache primeiro
      const cachedTicket = await getTicketDetailsFromStorage(ticketId);
      if (cachedTicket) {
        setTicket(cachedTicket);
        setLoading(false);
        // Continuar carregando em background
      }

      const data = await fetchTicketById(ticketId);
      setTicket(data);
      await saveTicketDetailsToStorage(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading ticket:', err);

      // Se falhar, usar o cache se disponível
      if (!ticket) {
        const cachedTicket = await getTicketDetailsFromStorage(ticketId);
        if (cachedTicket) {
          setTicket(cachedTicket);
          toast.warning('Modo Offline: mostrando dados salvos localmente');
        } else {
          setError(true);
        }
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!ticket) return;

    try {
      await updateTicket(ticketId, { status: newStatus as any });
      toast.success('Status atualizado com sucesso!');
      loadTicket();
    } catch (err) {
      toast.error('Não foi possível atualizar o status');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Digite um comentário');
      return;
    }

    setSendingComment(true);

    try {
      await addComment(ticketId, newComment);
      setNewComment('');
      toast.success('Comentário adicionado!');
      loadTicket();
    } catch (err) {
      toast.error('Não foi possível adicionar o comentário');
    } finally {
      setSendingComment(false);
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      critical: 'Crítica',
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa',
    };
    return labels[priority] || priority;
  };

  if (loading && !ticket) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#007AFF" />
          <LoadingText>Carregando ticket...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (error || !ticket) {
    return (
      <Container>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <BackButtonText>← Voltar</BackButtonText>
          </BackButton>
          <HeaderSpacer />
        </Header>
        <ErrorContainer>
          <ErrorText>Erro ao carregar ticket</ErrorText>
          <RetryButton onPress={loadTicket}>
            <RetryButtonText>Tentar novamente</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <Container>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <BackButtonText>← Voltar</BackButtonText>
          </BackButton>
          <HeaderTitle>Ticket #{ticket.id}</HeaderTitle>
          <HeaderSpacer />
        </Header>

        <ScrollView>
          <Content>
            <Section>
              <TicketTitle>{ticket.title}</TicketTitle>
              <TicketStatusBadge status={ticket.status} />
            </Section>

            <Section>
              <TicketDescription>{ticket.description}</TicketDescription>
            </Section>

            <Section>
              <SectionTitle>Informações</SectionTitle>
              <InfoRow>
                <InfoLabel>Categoria:</InfoLabel>
                <InfoValue>{ticket.category}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Prioridade:</InfoLabel>
                <InfoValue>{getPriorityLabel(ticket.priority)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Criado em:</InfoLabel>
                <InfoValue>
                  {new Date(ticket.createdAt).toLocaleString('pt-BR')}
                </InfoValue>
              </InfoRow>
              {ticket.createdBy && (
                <InfoRow>
                  <InfoLabel>Criado por:</InfoLabel>
                  <InfoValue>{ticket.createdBy.name}</InfoValue>
                </InfoRow>
              )}
            </Section>

            <Section>
              <SectionTitle>
                Comentários ({ticket.comments?.length || 0})
              </SectionTitle>
              {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map((comment) => (
                  <TicketComment key={comment.id} comment={comment} />
                ))
              ) : (
                <EmptyCommentsText>Nenhum comentário ainda</EmptyCommentsText>
              )}

              <CommentInputContainer>
                <CommentInput
                  value={newComment}
                  onChangeText={setNewComment}
                  placeholder="Adicione um comentário..."
                  multiline
                  editable={!sendingComment}
                />
                <SendButton
                  onPress={handleAddComment}
                  disabled={!newComment.trim() || sendingComment}
                  active={!!newComment.trim() && !sendingComment}
                >
                  {sendingComment ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <SendButtonText active={!!newComment.trim()}>
                      Enviar
                    </SendButtonText>
                  )}
                </SendButton>
              </CommentInputContainer>
            </Section>

            <Section>
              <SectionTitle>Ações</SectionTitle>
              <ActionsRow>
                <ActionButton
                  onPress={() => handleUpdateStatus('resolved')}
                  disabled={ticket.status === 'resolved'}
                  active={ticket.status !== 'resolved'}
                >
                  <ActionButtonText active={ticket.status !== 'resolved'}>
                    Marcar como Resolvido
                  </ActionButtonText>
                </ActionButton>
                <ActionButton
                  onPress={() => handleUpdateStatus('closed')}
                  disabled={ticket.status === 'closed'}
                  active={ticket.status !== 'closed'}
                >
                  <ActionButtonText active={ticket.status !== 'closed'}>
                    Fechar Ticket
                  </ActionButtonText>
                </ActionButton>
              </ActionsRow>
            </Section>
          </Content>
        </ScrollView>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default TicketDetails;
