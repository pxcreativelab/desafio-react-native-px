import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

export const StatusBadge = styled.View<{ $isOnline: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${props => (props.$isOnline ? '#e8f5e9' : '#ffebee')};
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

export const SyncButton = styled.TouchableOpacity`
  padding: 6px 12px;
  background-color: #2196f3;
  border-radius: 6px;
  min-width: 100px;
  align-items: center;
`;

export const SyncButtonText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: 600;
`;
