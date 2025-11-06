import styled from 'styled-components/native';

export const HeaderContainer = styled.View`
  width: 100%;
  height:84px;
  padding: 18px ${({ theme }) => theme.spacing.md}px 12px;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const LeftContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const MenuButton = styled.TouchableOpacity`
  padding: 6px;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.lg}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const RightContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const AvatarButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const AvatarText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
`;

