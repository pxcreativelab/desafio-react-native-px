import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.45);
  /* justify-content: center; */
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Spacer = styled.TouchableOpacity`
  height: 10%;
`;

export const ModalContainer = styled.View`
  width: 90%;
  max-width: 420px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  padding: 18px;
  /* elevation removed for cross-platform compatibility; use shadow props if needed */
`;

export const ModalTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.lg}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const ModalMessage = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

export const CancelButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.white};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin-right: 12px;
`;

export const CancelButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

export const ConfirmButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

export const ConfirmButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
`;
