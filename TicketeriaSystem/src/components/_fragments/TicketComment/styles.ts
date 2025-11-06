import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundPage};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  padding: 12px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const UserName = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const DateText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xs}px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const CommentText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 20px;
`;
