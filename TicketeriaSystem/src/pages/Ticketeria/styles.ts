
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #F2F2F7;
`;

export const Header = styled.View`
  flex-direction: row;
  padding: 16px;
  gap: 12px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #E5E5EA;
`;

export const SearchInputContainer = styled.View`
  flex: 1;
  position: relative;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  height: 40px;
  background-color: #F2F2F7;
  border-radius: 10px;
  padding: 0 12px 0 40px;
  font-size: 16px;
  color: #000000;
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
  background-color: #007AFF;
  padding: 10px 16px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

export const CreateButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
`;

export const BoxRow = styled.View`
  background-color: #FFFFFF;
  height: 60px;
  padding: 0 16px;
`;

export const FilterRow = styled.ScrollView`
 
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #E5E5EA;
`;

interface FilterButtonProps {
  active?: boolean;
}

export const FilterButton = styled.TouchableOpacity<FilterButtonProps>`
  padding: 8px 16px;
  border-radius: 20px;
  margin-right: 8px;
  background-color: ${({ active }) => (active ? '#007AFF' : '#F2F2F7')};
`;

export const FilterButtonText = styled.Text<FilterButtonProps>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ active }) => (active ? '#FFFFFF' : '#000000')};
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
  font-size: 16px;
  color: #8E8E93;
  text-align: center;
  line-height: 22px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const LoadingText = styled.Text`
  margin-top: 16px;
  font-size: 16px;
  color: #8E8E93;
`;

export const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const ErrorText = styled.Text`
  font-size: 18px;
  color: #FF3B30;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
`;

export const RetryButton = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 12px 24px;
  border-radius: 10px;
`;

export const RetryButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
`;
