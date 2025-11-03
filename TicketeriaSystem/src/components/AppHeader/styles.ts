import styled from 'styled-components/native';

export const HeaderContainer = styled.View`
  width: 100%;
  height: 64px;
  padding: 28px 16px 12px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e6e6ea;
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
  font-size: 18px;
  font-weight: 700;
  color: #111;
`;

export const RightContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

