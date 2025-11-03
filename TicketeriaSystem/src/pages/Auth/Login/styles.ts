import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
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
  padding: 24px;
`;

export const Logo = styled.View`
  align-items: center;
  margin-bottom: 48px;
`;

export const LogoText = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #007aff;
`;

export const LogoSubtitle = styled.Text`
  font-size: 16px;
  color: #666;
  margin-top: 8px;
`;

export const FormContainer = styled.View`
  width: 100%;
`;

export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: #333;
`;

export const ErrorText = styled.Text`
  color: #ff3b30;
  font-size: 12px;
  margin-top: 4px;
`;

export const ForgotPasswordButton = styled.TouchableOpacity`
  align-self: flex-end;
  margin-top: 8px;
  margin-bottom: 24px;
`;

export const ForgotPasswordText = styled.Text`
  color: #007aff;
  font-size: 14px;
`;

export const LoginButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) => (props.disabled ? '#ccc' : '#007aff')};
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 16px;
`;

export const LoginButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

export const BiometricButton = styled.TouchableOpacity`
  background-color: #fff;
  border: 1px solid #007aff;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 24px;
`;

export const BiometricButtonText = styled.Text`
  color: #007aff;
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
`;

export const BiometricIcon = styled.Text`
  font-size: 24px;
`;

export const Divider = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 24px 0;
`;

export const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: #ddd;
`;

export const DividerText = styled.Text`
  color: #666;
  font-size: 14px;
  margin: 0 16px;
`;

export const RegisterContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
`;

export const RegisterText = styled.Text`
  color: #666;
  font-size: 14px;
`;

export const RegisterButton = styled.TouchableOpacity`
  margin-left: 4px;
`;

export const RegisterButtonText = styled.Text`
  color: #007aff;
  font-size: 14px;
  font-weight: 600;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
