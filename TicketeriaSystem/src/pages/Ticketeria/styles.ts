
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundPage};
`;

export const Header = styled.View`
  flex-direction: row;
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const SearchInputContainer = styled.View`
  flex: 1;
  position: relative;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.backgroundPage};
  border-radius: 10px;
  padding: 0 12px 0 40px;
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const SearchIcon = styled.View`
  position: absolute;
  left: 12px;
  top: 12px;
  z-index: 1;
`;

export const SearchIconText = styled.Text`
  font-size: 16px;
`;

export const CreateButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 10px ${({ theme }) => theme.spacing.md}px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

export const CreateButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  font-weight: 600;
`;

export const BoxRow = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  height: 60px;
  padding: 0 ${({ theme }) => theme.spacing.md}px;
`;

export const FilterRow = styled.ScrollView`
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

interface FilterButtonProps {
  active?: boolean;
}

export const FilterButton = styled.TouchableOpacity<FilterButtonProps>`
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  border-radius: 20px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.backgroundPage)};
  align-items: center;
  justify-content: center;
`;

export const FilterButtonText = styled.Text<FilterButtonProps>`
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  font-weight: 600;
  color: ${({ active, theme }) => (active ? theme.colors.white : theme.colors.text)};
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const EmptyIcon = styled.Text`
  font-size: 64px;
  margin-bottom: 16px;
`;

export const EmptyText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
  line-height: 22px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const LoadingText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const ErrorText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.lg}px;
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  text-align: center;
`;

export const RetryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: 10px;
`;

export const RetryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  font-weight: 600;
`;

export const ExportButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  align-items: center;
  justify-content: center;
`;

export const ExportButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  font-weight: 600;
`;

export const ExportRow = styled.View`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.background};
`;
