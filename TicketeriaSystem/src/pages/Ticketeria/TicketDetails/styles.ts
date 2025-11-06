import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  margin-top: 0px;
`;

export const BackButton = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

export const BackButtonText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.primary};
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
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export const Section = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const TicketTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xl}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const TicketDescription = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 24px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.backgroundPage};
`;

export const InfoLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 500;
`;

export const InfoValue = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const CommentInputContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: flex-end;
`;

export const CommentInput = styled.TextInput`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundPage};
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  color: ${({ theme }) => theme.colors.text};
  min-height: 80px;
  max-height: 120px;
`;

interface SendButtonProps {
  active?: boolean;
}

export const SendButton = styled.TouchableOpacity<SendButtonProps>`
  background-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.lightGray)};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  min-width: 70px;
`;

export const SendButtonText = styled.Text<SendButtonProps>`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  font-weight: 600;
`;

export const ActionsRow = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

interface ActionButtonProps {
  active?: boolean;
}

export const ActionButton = styled.TouchableOpacity<ActionButtonProps>`
  background-color: ${({ active, theme }) => (active ? theme.colors.background : theme.colors.backgroundPage)};
  border-width: 1px;
  border-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.lightGray)};
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: 10px;
  align-items: center;
  opacity: ${({ active }) => (active ? 1 : 0.5)};
`;

export const ActionButtonText = styled.Text<ActionButtonProps>`
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.gray)};
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
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

export const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const ErrorText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.lg}px;
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  text-align: center;
`;

export const RetryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: 10px;
`;

export const RetryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  font-weight: 600;
`;

export const EmptyCommentsText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
  padding: 20px;
`;

export const CacheBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  margin: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px 0;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const CacheBadgeText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm}px;
  font-weight: 600;
`;
