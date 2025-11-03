import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: #F2F2F7;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const UserName = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
`;

export const DateText = styled.Text`
  font-size: 12px;
  color: #8E8E93;
`;

export const CommentText = styled.Text`
  font-size: 14px;
  color: #000000;
  line-height: 20px;
`;
