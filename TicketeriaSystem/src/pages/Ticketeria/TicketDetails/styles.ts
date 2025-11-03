import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #F2F2F7;
`;

export const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
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

export const BackButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const BackButtonText = styled.Text`
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
  padding: 16px;
`;

export const Section = styled.View`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 12px;
`;

export const TicketTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 12px;
`;

export const TicketDescription = styled.Text`
  font-size: 16px;
  color: #000000;
  line-height: 24px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: #F2F2F7;
`;

export const InfoLabel = styled.Text`
  font-size: 14px;
  color: #8E8E93;
  font-weight: 500;
`;

export const InfoValue = styled.Text`
  font-size: 14px;
  color: #000000;
`;

export const CommentInputContainer = styled.View`
  margin-top: 16px;
  flex-direction: row;
  gap: 8px;
  align-items: flex-end;
`;

export const CommentInput = styled.TextInput`
  flex: 1;
  background-color: #F2F2F7;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  color: #000000;
  min-height: 80px;
  max-height: 120px;
`;

interface SendButtonProps {
  active?: boolean;
}

export const SendButton = styled.TouchableOpacity<SendButtonProps>`
  background-color: ${({ active }) => (active ? '#007AFF' : '#C7C7CC')};
  padding: 12px 16px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  min-width: 70px;
`;

export const SendButtonText = styled.Text<SendButtonProps>`
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
`;

export const ActionsRow = styled.View`
  gap: 12px;
`;

interface ActionButtonProps {
  active?: boolean;
}

export const ActionButton = styled.TouchableOpacity<ActionButtonProps>`
  background-color: ${({ active }) => (active ? '#FFFFFF' : '#F2F2F7')};
  border-width: 1px;
  border-color: ${({ active }) => (active ? '#007AFF' : '#C7C7CC')};
  padding: 12px;
  border-radius: 10px;
  align-items: center;
  opacity: ${({ active }) => (active ? 1 : 0.5)};
`;

export const ActionButtonText = styled.Text<ActionButtonProps>`
  color: ${({ active }) => (active ? '#007AFF' : '#8E8E93')};
  font-size: 14px;
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

export const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const ErrorText = styled.Text`
  font-size: 18px;
  color: #FF3B30;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
`;

export const RetryButton = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 12px 24px;
  border-radius: 10px;
`;

export const RetryButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
`;

export const EmptyCommentsText = styled.Text`
  font-size: 14px;
  color: #8E8E93;
  text-align: center;
  padding: 20px;
`;
