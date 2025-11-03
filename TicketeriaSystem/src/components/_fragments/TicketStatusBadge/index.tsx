import React from 'react';
import { Container, StatusText } from './styles';

interface TicketStatusBadgeProps {
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    const configs: Record<
      string,
      { label: string; color: string; bgColor: string }
    > = {
      open: {
        label: 'Aberto',
        color: '#FF9500',
        bgColor: '#FFF4E6',
      },
      in_progress: {
        label: 'Em Andamento',
        color: '#007AFF',
        bgColor: '#E6F2FF',
      },
      resolved: {
        label: 'Resolvido',
        color: '#34C759',
        bgColor: '#E6F9EC',
      },
      closed: {
        label: 'Fechado',
        color: '#8E8E93',
        bgColor: '#F2F2F7',
      },
    };

    return configs[status] || configs.open;
  };

  const config = getStatusConfig();

  return (
    <Container bgColor={config.bgColor}>
      <StatusText color={config.color}>{config.label}</StatusText>
    </Container>
  );
};

export default TicketStatusBadge;
