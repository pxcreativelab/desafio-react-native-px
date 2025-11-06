import React from 'react';
import { useTheme } from 'styled-components/native';
import { Container, StatusText } from './styles';

interface TicketStatusBadgeProps {
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status }) => {
  const theme = useTheme();

  const getStatusConfig = () => {
    const configs: Record<
      string,
      { label: string; color: string; bgColor: string }
    > = {
      open: {
        label: 'Aberto',
        color: theme.colors.statusOpen,
        bgColor: theme.colors.statusOpenBg,
      },
      in_progress: {
        label: 'Em Andamento',
        color: theme.colors.statusInProgress,
        bgColor: theme.colors.statusInProgressBg,
      },
      resolved: {
        label: 'Resolvido',
        color: theme.colors.statusResolved,
        bgColor: theme.colors.statusResolvedBg,
      },
      closed: {
        label: 'Fechado',
        color: theme.colors.statusClosed,
        bgColor: theme.colors.statusClosedBg,
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
