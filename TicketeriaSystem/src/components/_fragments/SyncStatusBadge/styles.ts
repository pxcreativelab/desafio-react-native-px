import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

export const StatusBadge = styled.View`
  padding: 4px 8px;
  border-radius: 12px;
`;

export const StatusText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: #333;
`;

export const PendingCount = styled.Text`
  font-size: 11px;
  color: #666;
  font-weight: 500;
`;

export const SyncingIndicator = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background-color: #e3f2fd;
  border-radius: 8px;
`;
