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
  background-color: #fff;
  border-radius: 10px;
  padding: 18px;
  /* elevation removed for cross-platform compatibility; use shadow props if needed */
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
`;

export const ModalMessage = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 16px;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

export const CancelButton = styled.TouchableOpacity`
  background-color: #fff;
  border-width: 1px;
  border-color: #e6e6ea;
  padding: 10px 12px;
  border-radius: 8px;
  margin-right: 12px;
`;

export const CancelButtonText = styled.Text`
  color: #007aff;
  font-weight: 600;
`;

export const ConfirmButton = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 10px 12px;
  border-radius: 8px;
`;

export const ConfirmButtonText = styled.Text`
  color: #fff;
  font-weight: 700;
`;
