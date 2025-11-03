import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
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
  margin-bottom: 8px;
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
  gap: 8px;
`;

export const MetaInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  flex: 1;
  color: #000000;
`;

export const Description = styled.Text`
  font-size: 14px;
  color: #666666;
`;

export const DateText = styled.Text`
  font-size: 12px;
  color: #666666;
`;

export const PriorityBadge = styled.View<{ color: string }>`
  padding: 2px 8px;
  border-radius: 8px;
  background-color: ${({ color }) => `${color}15`};
`;
