import TicketComment from '@components/_fragments/TicketComment';
import TicketStatusBadge from '@components/_fragments/TicketStatusBadge';
import { useAddComment, useTicketDetails, useUpdateTicketStatus } from '@hooks/tickets';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Attachment, Comment } from '@services/TicketApi';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, ScrollView } from 'react-native';
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
  KeyboardView,
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
  const [newComment, setNewComment] = useState<string>('');

  const navigation = useNavigation();

  // React Query hooks
  const { data: ticket, isLoading, isError, refetch } = useTicketDetails(ticketId);
  const { mutate: updateStatus } = useUpdateTicketStatus(ticketId);
  const { mutate: addNewComment, isPending: isAddingComment } = useAddComment(ticketId);

  const handleUpdateStatus = (newStatus: string) => {
    updateStatus(newStatus);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      return;
    }

    addNewComment(newComment, {
      onSuccess: () => {
        setNewComment('');
      },
    });
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

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#007AFF" />
          <LoadingText>Carregando ticket...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (isError || !ticket) {
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
          <RetryButton onPress={() => refetch()}>
            <RetryButtonText>Tentar novamente</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <KeyboardView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                ticket.comments.map((comment: Comment) => (
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
                  editable={!isAddingComment}
                />
                <SendButton
                  onPress={handleAddComment}
                  disabled={!newComment.trim() || isAddingComment}
                  active={!!newComment.trim() && !isAddingComment}
                >
                  {isAddingComment ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <SendButtonText active={!!newComment.trim()}>
                      Enviar
                    </SendButtonText>
                  )}
                </SendButton>
              </CommentInputContainer>
            </Section>

            {/* Seção de Anexos */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <Section>
                <SectionTitle>Anexos ({ticket.attachments.length})</SectionTitle>
                {ticket.attachments.map((attachment: Attachment) => (
                  <InfoRow key={attachment.id}>
                    <InfoLabel>📎 {attachment.name}</InfoLabel>
                    <InfoValue>{(attachment.size / 1024).toFixed(2)} KB</InfoValue>
                  </InfoRow>
                ))}
              </Section>
            )}

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
    </KeyboardView>
  );
};

export default TicketDetails;
