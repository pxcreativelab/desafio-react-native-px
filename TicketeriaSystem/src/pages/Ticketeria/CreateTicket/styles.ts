import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundPage};
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;



export const HeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.lg}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
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
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const Input = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.white};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 12px;
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const TextArea = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.white};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 12px;
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.text};
  min-height: 120px;
`;

export const PickerContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  overflow: hidden;
`;

export const PickerButton = styled.TouchableOpacity`
  padding: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  margin-bottom: 4px;
`;

interface PickerButtonTextProps {
  selected?: boolean;
}

export const PickerButtonText = styled.Text<PickerButtonTextProps>`
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : theme.colors.gray)};
`;

export const BoxButtons = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

export const CancelButton = styled.TouchableOpacity`
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.danger};
  padding: 12px 0px;
  width: 40%;
  align-items: center;
`;

export const CancelButtonText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
`;

interface SubmitButtonProps {
  active?: boolean;
}

export const SubmitButton = styled.TouchableOpacity<SubmitButtonProps>`
  margin-left: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.lightGray)};
  padding: 12px 0;
  flex: 1;
  border-radius: 10px;
  align-items: center;
  opacity: ${({ active }) => (active ? 1 : 0.6)};
  font-weight: 700;
`;

export const SubmitButtonText = styled.Text<SubmitButtonProps>`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  font-weight: 600;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const LoadingText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const ErrorText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xs}px;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 4px;
`;
