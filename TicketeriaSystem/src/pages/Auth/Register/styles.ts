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
  padding: 24px;
  padding-top: 60px;
`;

export const Header = styled.View`
  align-items: center;
  margin-bottom: 32px;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #333;
`;

export const Subtitle = styled.Text`
  font-size: 14px;
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

export const RegisterButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) => (props.disabled ? '#ccc' : '#007aff')};
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
`;

export const RegisterButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

export const LoginContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
`;

export const LoginText = styled.Text`
  color: #666;
  font-size: 14px;
`;

export const LoginButton = styled.TouchableOpacity`
  margin-left: 4px;
`;

export const LoginButtonText = styled.Text`
  color: #007aff;
  font-size: 14px;
  font-weight: 600;
`;

export const PasswordRequirements = styled.View`
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const RequirementText = styled.Text<{ met?: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.met ? '#34c759' : '#666')};
  margin-bottom: 4px;
`;
