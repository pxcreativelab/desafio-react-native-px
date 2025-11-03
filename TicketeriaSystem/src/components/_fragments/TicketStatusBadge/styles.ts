import styled from 'styled-components/native';

interface ContainerProps {
  bgColor: string;
}

export const Container = styled.View<ContainerProps>`
  background-color: ${({ bgColor }) => bgColor};
  padding: 4px 12px;
  border-radius: 12px;
`;

export const StatusText = styled.Text<{ color: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ color }) => color};
`;
