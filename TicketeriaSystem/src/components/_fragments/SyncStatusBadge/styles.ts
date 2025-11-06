import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const StatusBadge = styled.View`
  padding: 4px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
`;

export const StatusText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xs}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const PendingCount = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

export const SyncingIndicator = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 4px ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.statusInProgressBg};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;
