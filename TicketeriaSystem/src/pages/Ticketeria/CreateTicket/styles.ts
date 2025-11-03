import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #F2F2F7;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #E5E5EA;
`;

export const HeaderButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const HeaderButtonText = styled.Text`
  font-size: 16px;
  color: #007AFF;
`;

export const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
`;

export const HeaderSpacer = styled.View`
  width: 70px;
`;

export const Content = styled.View`
  padding: 20px;
`;

export const FormGroup = styled.View`
  margin-bottom: 20px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #E5E5EA;
  border-radius: 10px;
  padding: 12px;
  font-size: 16px;
  color: #000000;
`;

export const TextArea = styled.TextInput`
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #E5E5EA;
  border-radius: 10px;
  padding: 12px;
  font-size: 16px;
  color: #000000;
  min-height: 120px;
`;

export const PickerContainer = styled.View`
  background-color: #FFFFFF;
  border-radius: 10px;
  overflow: hidden;
`;

export const PickerButton = styled.TouchableOpacity`
  padding: 12px;
  border-width: 1px;
  border-color: #E5E5EA;
  border-radius: 10px;
  margin-bottom: 4px;
`;

interface PickerButtonTextProps {
  selected?: boolean;
}

export const PickerButtonText = styled.Text<PickerButtonTextProps>`
  font-size: 16px;
  color: ${({ selected }) => (selected ? '#000000' : '#8E8E93')};
`;

interface SubmitButtonProps {
  active?: boolean;
}

export const SubmitButton = styled.TouchableOpacity<SubmitButtonProps>`
  background-color: ${({ active }) => (active ? '#007AFF' : '#C7C7CC')};
  padding: 16px;
  border-radius: 10px;
  align-items: center;
  margin-top: 24px;
  opacity: ${({ active }) => (active ? 1 : 0.6)};
`;

export const SubmitButtonText = styled.Text<SubmitButtonProps>`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
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

export const ErrorText = styled.Text`
  font-size: 12px;
  color: #FF3B30;
  margin-top: 4px;
`;
