import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  gap: 12px;
`;

export const Content = styled.View`
  margin-bottom: 12px;
`;

export const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const MetaInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  font-weight: bold;
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
`;

export const Description = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const DateText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const PriorityBadge = styled.View<{ color: string }>`
  padding: 2px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ color }) => `${color}15`};
`;

export const OfflineBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.warning};
  padding: 2px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

export const OfflineBadgeText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 10px;
  font-weight: 600;
`;
