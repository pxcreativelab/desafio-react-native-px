import TopLoadingBar from '@/components/TopLoadingBar';
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
  Header,
  HeaderTitle,
  InfoLabel,
  InfoRow,
  InfoValue,
  KeyboardView,
  Section,
  SectionTitle,
  SendButton,
  SendButtonText,
  TicketDescription,
  TicketTitle
} from './styles';


type Props = StaticScreenProps<{
  ticketId: number | string;
}>;

const TicketDetails: React.FC<Props> = ({ route: { params: { ticketId } } }: Props) => {
  const [newComment, setNewComment] = useState('');
  const navigation = useNavigation();

  const { data: ticket, isLoading, refetch, error } = useTicketDetails(ticketId);
  const { mutate: updateStatus } = useUpdateTicketStatus(ticketId);
  const { mutate: addNewComment, isPending: isAddingComment } = useAddComment(ticketId);

  const handleUpdateStatus = (newStatus: string) => {
    updateStatus(newStatus, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    addNewComment(newComment, {
      onSuccess: () => { setNewComment(''); refetch(); },
    });
  };

  const priorityLabels: Record<string, string> = {
    critical: 'Crítica',
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#FF3B30';
      case 'high':
        return '#FF9500';
      case 'medium':
        return '#FFCC00';
      case 'low':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };


  return (
    <KeyboardView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Container>
        <Header>
          <HeaderTitle>Ticket #{ticketId}</HeaderTitle>
          <BackButton onPress={navigation.goBack}>
            <BackButtonText>← Voltar</BackButtonText>
          </BackButton>
        </Header>
        <TopLoadingBar visible={isLoading} />

        <ScrollView>
          {ticket && (
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
                  <InfoValue>{priorityLabels[ticket.priority] || ticket.priority}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Criado em:</InfoLabel>
                  <InfoValue>{new Date(ticket.createdAt).toLocaleString('pt-BR')}</InfoValue>
                </InfoRow>
                {ticket.createdBy && (
                  <InfoRow>
                    <InfoLabel>Criado por:</InfoLabel>
                    <InfoValue>{ticket.createdBy.name}</InfoValue>
                  </InfoRow>
                )}
              </Section>

              <Section>
                <SectionTitle>Comentários ({ticket.comments?.length || 0})</SectionTitle>
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
                      <SendButtonText active={!!newComment.trim()}>Enviar</SendButtonText>
                    )}
                  </SendButton>
                </CommentInputContainer>
              </Section>

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
          )}
          {error && (
            <Content>
              <EmptyCommentsText>
                {error.message || 'Erro ao carregar os detalhes do ticket.'}
              </EmptyCommentsText>
            </Content>
          )}
        </ScrollView>
      </Container>
    </KeyboardView>
  );
};

export default TicketDetails;
