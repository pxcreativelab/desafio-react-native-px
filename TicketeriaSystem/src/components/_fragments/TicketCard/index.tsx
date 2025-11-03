import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ticket } from '../../../services/TicketApi';
import TicketStatusBadge from '../TicketStatusBadge';
import { Container, Content, DateText, Description, Footer, Header, MetaInfo, PriorityBadge, Title } from './styles';

interface TicketCardProps {
  ticket: Ticket;
  onPress: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onPress }) => {
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

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      critical: 'Crítica',
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa',
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
          <Description numberOfLines={2}>{ticket.description}</Description>
        </Content>

        <Footer>
          <MetaInfo>
            <DateText>{ticket.category}</DateText>
          </MetaInfo>

          <MetaInfo>
            <PriorityBadge color={getPriorityColor(ticket.priority)}>
              <DateText style={{ color: getPriorityColor(ticket.priority) }}>
                {getPriorityLabel(ticket.priority)}
              </DateText>
            </PriorityBadge>
          </MetaInfo>

          <DateText>
            {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
          </DateText>
        </Footer>

        {ticket.comments && ticket.comments.length > 0 && (
          <MetaInfo style={{ marginTop: 8 }}>
            <DateText>
              {ticket.comments.length} comentário{ticket.comments.length > 1 ? 's' : ''}
            </DateText>
          </MetaInfo>
        )}
      </Container>
    </TouchableOpacity>
  );
};

export default TicketCard;
