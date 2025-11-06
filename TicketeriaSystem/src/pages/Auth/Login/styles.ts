import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundPage};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
  },
  keyboardShouldPersistTaps: 'handled',
})`
  flex: 1;
`;

export const Content = styled.View`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const Logo = styled.View`
  align-items: center;
  margin-bottom: 48px;
`;

export const LogoText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xxl}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

export const LogoSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export const FormContainer = styled.View`
  width: 100%;
`;

export const InputGroup = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const Label = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const Input = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  padding: 12px ${({ theme }) => theme.spacing.md}px;
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.xs}px;
  margin-top: 4px;
`;


export const LoginButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled, theme }) => (disabled ? theme.colors.lightGray : theme.colors.primary)};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const LoginButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  font-weight: 600;
`;

export const BiometricButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

export const BiometricButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  font-weight: 600;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

export const BiometricIcon = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xxl}px;
`;

export const Divider = styled.View`
  flex-direction: row;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.lg}px 0;
`;

export const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

export const DividerText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  margin: 0 ${({ theme }) => theme.spacing.md}px;
`;

export const RegisterContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

export const RegisterText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
`;

export const RegisterButton = styled.TouchableOpacity`
  margin-left: 4px;
`;

export const RegisterButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  font-weight: 600;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
